package br.com.tt.painelpreco.pncp.domain.service;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.tt.painelpreco.domain.model.Fornecedor;
import br.com.tt.painelpreco.domain.model.PorteFornecedor;
import br.com.tt.painelpreco.domain.repository.FornecedorRepository;
import br.com.tt.painelpreco.domain.repository.ItemLicitacaoRepository;
import br.com.tt.painelpreco.domain.repository.PorteFornecedorRepository;
import br.com.tt.painelpreco.pncp.api.ResultadoClient;
import feign.FeignException;

@Service
public class IngestaoResultadoItemService {

    private static final int TAMANHO_PAGINA = 50;
    private static final int SITUACAO_HOMOLOGADO = 1;
    private static final int BATCH_SIZE = 500;

    @Value("${pncp.coleta.num-threads:8}")
    private int numThreads;

    @Value("${pncp.coleta.fornecedores.max-duration-hours:18}")
    private int maxDurationHoras;

    @Value("${pncp.api.output.dir}")
    private String jsonDir;

    @Autowired private ResultadoClient resultadoClient;
    @Autowired private ItemLicitacaoRepository itemLicitacaoRepository;
    @Autowired private FornecedorRepository fornecedorRepository;
    @Autowired private PorteFornecedorRepository porteFornecedorRepository;
    @Autowired private JdbcTemplate jdbcTemplate;

    private String folderResultados;

    @PostConstruct
    public void init() {
        folderResultados = jsonDir + "resultados/";
        new File(folderResultados).mkdirs();
    }

    private static final int PAGE_SIZE = 500_000;

    @CacheEvict(value = {"fornecedor-kpis", "fornecedor-ranking", "fornecedor-porte", "fornecedor-evolucao"}, allEntries = true)
    public void carregaResultadosBaixadosNoBanco() {
        long inicio = System.currentTimeMillis();

        // ── 1. Caches em memória (carregados uma vez, compartilhados entre páginas) ──
        Map<String, PorteFornecedor> porteCache = porteFornecedorRepository.findAll().stream()
                .collect(Collectors.toConcurrentMap(PorteFornecedor::getNome, p -> p, (a, b) -> a));
        ConcurrentHashMap<String, Fornecedor> fornecedorCache = new ConcurrentHashMap<>();
        fornecedorRepository.findAll().forEach(f -> fornecedorCache.put(f.getDocumento(), f));
        System.out.printf("INFO: Cache carregado — %d portes, %d fornecedores.%n",
                porteCache.size(), fornecedorCache.size());

        // ── 2. Paginação por keyset — inclui NULL e Padrão (id=1) ────────────
        // Processa 500K itens por página para não estourar heap com 6.5M+ registros.
        long lastId = 0;
        int pagina = 0;
        int totalAtualizados = 0;
        long maxDurationMillis = TimeUnit.HOURS.toMillis(maxDurationHoras);
        ExecutorService executor = Executors.newFixedThreadPool(numThreads);

        while (true) {
            if (System.currentTimeMillis() - inicio > maxDurationMillis) {
                System.out.printf("INFO: Orçamento de tempo (%dh) atingido — encerrando coleta de fornecedores, "
                        + "restante fica para a próxima execução.%n", maxDurationHoras);
                break;
            }

            List<Object[]> itensPagina = itemLicitacaoRepository.findPendentesRawPage(lastId, PAGE_SIZE);
            if (itensPagina.isEmpty()) break;

            pagina++;
            System.out.printf("INFO: Página %d — %d itens (lastId=%d).%n", pagina, itensPagina.size(), lastId);
            lastId = ((Number) itensPagina.get(itensPagina.size() - 1)[0]).longValue();

            // ── 3. Processamento paralelo da página ───────────────────────────
            ConcurrentLinkedQueue<long[]> updates = new ConcurrentLinkedQueue<>();
            ConcurrentLinkedQueue<Long> naoResolvidos = new ConcurrentLinkedQueue<>();
            List<Future<?>> futures = new ArrayList<>();
            int itemsPerThread = Math.max(1, (itensPagina.size() + numThreads - 1) / numThreads);

            for (int t = 0; t < numThreads; t++) {
                int from = t * itemsPerThread;
                int to = Math.min(from + itemsPerThread, itensPagina.size());
                if (from >= itensPagina.size()) break;
                final List<Object[]> grupo = Collections.unmodifiableList(itensPagina.subList(from, to));
                final ObjectMapper mapper = new ObjectMapper();
                futures.add(executor.submit(() ->
                        processarGrupo(grupo, mapper, porteCache, fornecedorCache, updates, naoResolvidos)));
            }

            for (Future<?> f : futures) {
                try { f.get(); } catch (Exception e) {
                    System.err.println("ERROR: Thread falhou: " + e.getMessage());
                }
            }

            // ── 4. JDBC batch update da página ────────────────────────────────
            List<long[]> pageUpdates = new ArrayList<>(updates);
            totalAtualizados += pageUpdates.size();
            for (int i = 0; i < pageUpdates.size(); i += BATCH_SIZE) {
                final List<long[]> lote = pageUpdates.subList(i, Math.min(i + BATCH_SIZE, pageUpdates.size()));
                jdbcTemplate.batchUpdate(
                        "UPDATE mural.item_licitacao SET fornecedor_id = ? WHERE id_item_licitacao = ?",
                        lote, BATCH_SIZE,
                        (ps, u) -> { ps.setLong(1, u[0]); ps.setLong(2, u[1]); });
            }

            // ── 4b. Marca cooldown dos itens não resolvidos nesta passada ──────
            // Evita reprocessar hoje itens que falharam/ainda não têm resultado homologado,
            // liberando as chamadas throttled para itens que ainda não foram tentados.
            List<Long> pageNaoResolvidos = new ArrayList<>(naoResolvidos);
            for (int i = 0; i < pageNaoResolvidos.size(); i += BATCH_SIZE) {
                final List<Long> lote = pageNaoResolvidos.subList(i, Math.min(i + BATCH_SIZE, pageNaoResolvidos.size()));
                jdbcTemplate.batchUpdate(
                        "UPDATE mural.item_licitacao SET ultima_tentativa_fornecedor = NOW() WHERE id_item_licitacao = ?",
                        lote, BATCH_SIZE,
                        (ps, id) -> ps.setLong(1, id));
            }

            System.out.printf("INFO: Página %d concluída — %d itens resolvidos, %d em cooldown até amanhã "
                    + "(acumulado resolvidos: %d) em %.1fs%n",
                    pagina, pageUpdates.size(), pageNaoResolvidos.size(), totalAtualizados,
                    (System.currentTimeMillis() - inicio) / 1000.0);
        }

        executor.shutdown();
        refreshMaterializedView();
        System.out.printf("INFO: Coleta concluída — %d itens atualizados no total em %.1fs%n",
                totalAtualizados, (System.currentTimeMillis() - inicio) / 1000.0);
    }

    private void processarGrupo(List<Object[]> grupo, ObjectMapper mapper,
                                 Map<String, PorteFornecedor> porteCache,
                                 ConcurrentHashMap<String, Fornecedor> fornecedorCache,
                                 ConcurrentLinkedQueue<long[]> updates,
                                 ConcurrentLinkedQueue<Long> naoResolvidos) {
        int resolvidos = 0;
        for (Object[] row : grupo) {
            long itemId = ((Number) row[0]).longValue();
            String numeroPncp = row[1] != null ? row[1].toString() : null;
            // numero_item é character varying(10) no BD → retorna como String na query nativa
            int numeroItem = 0;
            if (row[2] != null) {
                try { numeroItem = Integer.parseInt(row[2].toString()); } catch (NumberFormatException ignored) {}
            }

            if (numeroPncp == null || numeroItem == 0) {
                naoResolvidos.add(itemId);
                continue;
            }

            try {
                String cnpj = extrairCnpj(numeroPncp);
                String ano = extrairAno(numeroPncp);
                String sequencial = extrairSequencial(numeroPncp);

                JsonNode resultado = buscarResultadoHomologado(mapper, cnpj, ano, sequencial, numeroItem);
                if (resultado == null) {
                    naoResolvidos.add(itemId);
                    continue;
                }

                String documento = resultado.path("niFornecedor").asText(null);
                String nome = resultado.path("nomeRazaoSocialFornecedor").asText(null);
                String porteNome = resultado.path("porteFornecedorNome").asText("Não Informado");

                if (documento == null || nome == null) {
                    naoResolvidos.add(itemId);
                    continue;
                }

                PorteFornecedor porte = findOrCreatePorteCached(porteNome, porteCache);
                Fornecedor fornecedor = findOrCreateFornecedorCached(documento, nome, porte, fornecedorCache);

                updates.add(new long[]{fornecedor.getId(), itemId});
                resolvidos++;

                if (resolvidos % 1000 == 0) {
                    System.out.printf("INFO [Thread %s]: %d fornecedores resolvidos%n",
                            Thread.currentThread().getName(), resolvidos);
                }

            } catch (Exception e) {
                System.err.printf("ERROR: Item %s/%d: %s%n", numeroPncp, numeroItem, e.getMessage());
                naoResolvidos.add(itemId);
            }
        }
    }

    private PorteFornecedor findOrCreatePorteCached(String nome, Map<String, PorteFornecedor> cache) {
        PorteFornecedor p = cache.get(nome);
        if (p != null) return p;
        synchronized (cache) {
            p = cache.get(nome);
            if (p != null) return p;
            PorteFornecedor existente = porteFornecedorRepository.findFirstByNome(nome);
            if (existente != null) { cache.put(nome, existente); return existente; }
            PorteFornecedor novo = new PorteFornecedor();
            novo.setNome(nome);
            novo = porteFornecedorRepository.save(novo);
            cache.put(nome, novo);
            return novo;
        }
    }

    private Fornecedor findOrCreateFornecedorCached(String documento, String nome, PorteFornecedor porte,
                                                     ConcurrentHashMap<String, Fornecedor> cache) {
        Fornecedor f = cache.get(documento);
        if (f != null) return f;
        // Double-check locking: evita INSERT duplicado quando duas threads tentam criar o mesmo fornecedor
        synchronized (this) {
            f = cache.get(documento);
            if (f != null) return f;
            f = fornecedorRepository.findFirstByDocumento(documento);
            if (f == null) {
                f = new Fornecedor();
                f.setDocumento(documento);
                f.setNome(nome);
                f.setPorte(porte);
                f = fornecedorRepository.save(f);
            }
            cache.put(documento, f);
            return f;
        }
    }

    // ── Lógica de arquivo (sem alteração de comportamento) ────────────────────

    private JsonNode buscarResultadoHomologado(ObjectMapper mapper, String cnpj, String ano,
                                               String sequencial, int numeroItem) {
        for (int pagina = 1; pagina <= 100; pagina++) {
            String caminho = String.format("%sresultados-%s-%s-%s-%d-%d.json",
                    folderResultados, cnpj, ano, sequencial, numeroItem, pagina);
            File arquivo = new File(caminho);

            JsonNode arrayNode = lerOuBaixar(mapper, arquivo, cnpj, ano, sequencial, numeroItem, pagina);
            if (arrayNode == null || !arrayNode.isArray() || arrayNode.size() == 0) break;

            for (JsonNode resultado : arrayNode) {
                if (resultado.path("situacaoCompraItemResultadoId").asInt(-1) == SITUACAO_HOMOLOGADO) {
                    return resultado;
                }
            }
            if (arrayNode.size() < TAMANHO_PAGINA) break;
        }
        return null;
    }

    private JsonNode lerOuBaixar(ObjectMapper mapper, File arquivo, String cnpj, String ano,
                                  String sequencial, int numeroItem, int pagina) {
        if (!arquivo.exists()) {
            try {
                String resposta = resultadoClient.getResultados(cnpj, ano, sequencial, numeroItem, pagina, TAMANHO_PAGINA);
                if (resposta == null || resposta.equals("[]")) {
                    mapper.writeValue(arquivo, mapper.readTree("[]"));
                    return null;
                }
                JsonNode node = mapper.readTree(resposta);
                mapper.writerWithDefaultPrettyPrinter().writeValue(arquivo, node);
                return node;
            } catch (FeignException.NotFound e) {
                try { mapper.writeValue(arquivo, mapper.readTree("[]")); } catch (Exception ignored) {}
                return null;
            } catch (Exception e) {
                System.err.printf("ERROR: Download resultado %s/%s/%d pág %d: %s%n",
                        cnpj, sequencial, numeroItem, pagina, e.getMessage());
                return null;
            }
        }
        try {
            return mapper.readTree(arquivo);
        } catch (Exception e) {
            System.err.println("ERROR: Leitura do arquivo " + arquivo.getName() + ": " + e.getMessage());
            return null;
        }
    }

    private void refreshMaterializedView() {
        try {
            jdbcTemplate.execute("REFRESH MATERIALIZED VIEW CONCURRENTLY mural.mv_fornecedor_ranking");
            System.out.println("INFO: Materialized view mv_fornecedor_ranking atualizada.");
        } catch (Exception e) {
            System.err.println("WARN: Falha ao atualizar mv_fornecedor_ranking: " + e.getMessage());
        }
    }

    private String extrairCnpj(String numeroPncp) {
        return numeroPncp.substring(0, numeroPncp.indexOf("-"));
    }

    private String extrairSequencial(String numeroPncp) {
        int inicioSeq = numeroPncp.lastIndexOf("-") + 1;
        int fimSeq = numeroPncp.indexOf("/");
        return String.valueOf(Integer.parseInt(numeroPncp.substring(inicioSeq, fimSeq)));
    }

    private String extrairAno(String numeroPncp) {
        return numeroPncp.substring(numeroPncp.indexOf("/") + 1);
    }
}
