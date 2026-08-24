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
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.tt.painelpreco.domain.model.AtaRegistroPreco;
import br.com.tt.painelpreco.domain.model.Fornecedor;
import br.com.tt.painelpreco.domain.model.Licitacao;
import br.com.tt.painelpreco.domain.model.PorteFornecedor;
import br.com.tt.painelpreco.domain.repository.AtaRegistroPrecoRepository;
import br.com.tt.painelpreco.domain.repository.FornecedorRepository;
import br.com.tt.painelpreco.domain.repository.LicitacaoRepository;
import br.com.tt.painelpreco.domain.repository.PorteFornecedorRepository;
import br.com.tt.painelpreco.pncp.api.AtaClient;
import br.com.tt.painelpreco.util.DateUtil;
import feign.FeignException;

@Service
public class IngestaoAtaRegistroPrecoService {

    private static final int TAMANHO_PAGINA = 50;
    private static final int BATCH_SIZE = 200;

    @Value("${pncp.coleta.num-threads:8}")
    private int numThreads;

    @Value("${pncp.coleta.atas.max-duration-hours:4}")
    private int maxDurationHoras;

    @Value("${pncp.api.output.dir}")
    private String jsonDir;

    private volatile long inicioExecucao;

    @Autowired private AtaClient ataClient;
    @Autowired private LicitacaoRepository licitacaoRepository;
    @Autowired private AtaRegistroPrecoRepository ataRepository;
    @Autowired private FornecedorRepository fornecedorRepository;
    @Autowired private PorteFornecedorRepository porteFornecedorRepository;
    @Autowired private JdbcTemplate jdbcTemplate;

    private String folderAtas;
    private String folderItensAta;

    @PostConstruct
    public void init() {
        folderAtas = jsonDir + "atas/";
        folderItensAta = jsonDir + "atas/itens/";
        new File(folderAtas).mkdirs();
        new File(folderItensAta).mkdirs();
    }

    public void carregaAtasBaixadasNoBanco() {
        long inicio = System.currentTimeMillis();
        inicioExecucao = inicio;

        // ── 1. Apenas licitações SRP com atas/itens ainda não integralmente processados ──
        List<Licitacao> licitacoes = licitacaoRepository.findPendentesImportacaoAtas();
        System.out.printf("INFO: %d licitações SRP pendentes de ingestão de atas.%n", licitacoes.size());

        if (licitacoes.isEmpty()) return;

        // ── 2. Caches in-memory para Fornecedor/PorteFornecedor ────────────────
        Map<String, PorteFornecedor> porteCache = porteFornecedorRepository.findAll().stream()
                .collect(Collectors.toConcurrentMap(PorteFornecedor::getNome, p -> p, (a, b) -> a));
        ConcurrentHashMap<String, Fornecedor> fornecedorCache = new ConcurrentHashMap<>();
        fornecedorRepository.findAll().forEach(f -> fornecedorCache.put(f.getDocumento(), f));

        // ── 3. Processamento paralelo ─────────────────────────────────────────
        ConcurrentLinkedQueue<AtaRegistroPreco> atasParaSalvar = new ConcurrentLinkedQueue<>();
        ConcurrentLinkedQueue<long[]> itemUpdates = new ConcurrentLinkedQueue<>();
        ConcurrentLinkedQueue<Long> licitacoesConcluidas = new ConcurrentLinkedQueue<>();
        AtomicInteger atasEncontradas = new AtomicInteger(0);
        AtomicInteger atasSalvas = new AtomicInteger(0);
        AtomicInteger itensSalvos = new AtomicInteger(0);

        ExecutorService executor = Executors.newFixedThreadPool(numThreads);
        List<Future<?>> futures = new ArrayList<>();
        int itemsPerThread = Math.max(1, (licitacoes.size() + numThreads - 1) / numThreads);

        for (int t = 0; t < numThreads; t++) {
            int from = t * itemsPerThread;
            int to = Math.min(from + itemsPerThread, licitacoes.size());
            if (from >= licitacoes.size()) break;
            final List<Licitacao> grupo = Collections.unmodifiableList(licitacoes.subList(from, to));
            final ObjectMapper mapper = new ObjectMapper();
            futures.add(executor.submit(() ->
                    processarGrupoLicitacoes(grupo, mapper, porteCache, fornecedorCache,
                            atasParaSalvar, itemUpdates, atasEncontradas, licitacoesConcluidas)));
        }

        // ── 4. Flush periódico a cada 30s (garante persistência mesmo se interrompido) ─
        ScheduledExecutorService flusher = Executors.newSingleThreadScheduledExecutor();
        flusher.scheduleAtFixedRate(() -> {
            try {
                flushPendentes(atasParaSalvar, itemUpdates, licitacoesConcluidas, atasSalvas, itensSalvos);
            } catch (Exception e) {
                System.err.println("ERROR [flush periódico]: " + e.getMessage());
            }
        }, 30, 30, TimeUnit.SECONDS);

        for (Future<?> f : futures) {
            try { f.get(); } catch (Exception e) {
                System.err.println("ERROR: Thread atas falhou: " + e.getMessage());
            }
        }
        executor.shutdown();
        flusher.shutdown();

        // ── 5. Flush final ────────────────────────────────────────────────────
        flushPendentes(atasParaSalvar, itemUpdates, licitacoesConcluidas, atasSalvas, itensSalvos);

        System.out.printf("INFO: %d atas salvas, %d itens atualizados via atas em %.1fs%n",
                atasSalvas.get(), itensSalvos.get(), (System.currentTimeMillis() - inicio) / 1000.0);
    }

    private synchronized void flushPendentes(ConcurrentLinkedQueue<AtaRegistroPreco> atasParaSalvar,
                                              ConcurrentLinkedQueue<long[]> itemUpdates,
                                              ConcurrentLinkedQueue<Long> licitacoesConcluidas,
                                              AtomicInteger atasSalvas, AtomicInteger itensSalvos) {
        // Drena atas
        List<AtaRegistroPreco> lote = new ArrayList<>();
        AtaRegistroPreco ata;
        while ((ata = atasParaSalvar.poll()) != null) lote.add(ata);
        if (!lote.isEmpty()) {
            for (int i = 0; i < lote.size(); i += BATCH_SIZE) {
                List<AtaRegistroPreco> sub = lote.subList(i, Math.min(i + BATCH_SIZE, lote.size()));
                try {
                    ataRepository.saveAll(sub);
                    atasSalvas.addAndGet(sub.size());
                } catch (Exception e) {
                    for (AtaRegistroPreco a : sub) {
                        try { ataRepository.save(a); atasSalvas.incrementAndGet(); } catch (Exception ignored) {}
                    }
                }
            }
            System.out.printf("INFO [flush]: %d atas salvas (total: %d)%n", lote.size(), atasSalvas.get());
        }
        // Drena item updates
        List<long[]> updates = new ArrayList<>();
        long[] upd;
        while ((upd = itemUpdates.poll()) != null) updates.add(upd);
        if (!updates.isEmpty()) {
            for (int i = 0; i < updates.size(); i += BATCH_SIZE) {
                List<long[]> sub = updates.subList(i, Math.min(i + BATCH_SIZE, updates.size()));
                jdbcTemplate.batchUpdate(
                        "UPDATE mural.item_licitacao SET fornecedor_id = ? WHERE id_item_licitacao = ? AND fornecedor_id IS NULL",
                        sub, BATCH_SIZE,
                        (ps, u) -> { ps.setLong(1, u[0]); ps.setLong(2, u[1]); });
                itensSalvos.addAndGet(sub.size());
            }
        }
        // Drena licitações concluídas por ÚLTIMO: garante que atas/itens já foram
        // persistidos acima antes de marcar a licitação como concluída (evita marcar
        // conclusão sem os dados correspondentes estarem de fato gravados).
        List<Long> concluidas = new ArrayList<>();
        Long licitacaoId;
        while ((licitacaoId = licitacoesConcluidas.poll()) != null) concluidas.add(licitacaoId);
        if (!concluidas.isEmpty()) {
            for (int i = 0; i < concluidas.size(); i += BATCH_SIZE) {
                List<Long> sub = concluidas.subList(i, Math.min(i + BATCH_SIZE, concluidas.size()));
                jdbcTemplate.batchUpdate(
                        "UPDATE mural.licitacao SET atas_completo_em = NOW() WHERE id_licitacao = ?",
                        sub, BATCH_SIZE,
                        (ps, id) -> ps.setLong(1, id));
            }
        }
    }

    private void processarGrupoLicitacoes(List<Licitacao> grupo, ObjectMapper mapper,
                                           Map<String, PorteFornecedor> porteCache,
                                           ConcurrentHashMap<String, Fornecedor> fornecedorCache,
                                           ConcurrentLinkedQueue<AtaRegistroPreco> atasParaSalvar,
                                           ConcurrentLinkedQueue<long[]> itemUpdates,
                                           AtomicInteger atasEncontradas,
                                           ConcurrentLinkedQueue<Long> licitacoesConcluidas) {
        long maxDurationMillis = TimeUnit.HOURS.toMillis(maxDurationHoras);
        for (Licitacao licitacao : grupo) {
            if (System.currentTimeMillis() - inicioExecucao > maxDurationMillis) {
                System.out.printf("INFO [Thread %s]: orçamento de tempo (%dh) atingido — "
                        + "restante fica para a próxima execução.%n",
                        Thread.currentThread().getName(), maxDurationHoras);
                break;
            }

            String numeroPncp = licitacao.getNumeroPncp();
            if (numeroPncp == null) continue;

            try {
                String cnpj = extrairCnpj(numeroPncp);
                String ano = extrairAno(numeroPncp);
                String sequencial = extrairSequencial(numeroPncp);

                for (int pagina = 1; pagina <= 100; pagina++) {
                    JsonNode raw = lerOuBaixarAtas(mapper, cnpj, ano, sequencial, pagina);
                    if (raw == null) break;
                    JsonNode atasNode = raw.isArray() ? raw : raw.path("data");
                    if (!atasNode.isArray() || atasNode.size() == 0) break;

                    for (JsonNode ataNode : atasNode) {
                        AtaRegistroPreco ata = mapearAta(ataNode, licitacao);
                        if (ata == null) continue;

                        if (!ataRepository.existsByNumeroPncp(ata.getNumeroPncp())) {
                            atasParaSalvar.add(ata);
                            int total = atasEncontradas.incrementAndGet();
                            if (total % 500 == 0) {
                                System.out.printf("INFO [Thread %s]: %d atas encontradas%n",
                                        Thread.currentThread().getName(), total);
                            }
                        }

                        // Resolve fornecedor dos itens via atas
                        processarItensAta(mapper, ata, cnpj, String.valueOf(ata.getAno()),
                                String.valueOf(ata.getSequencial()), licitacao.getId(),
                                porteCache, fornecedorCache, itemUpdates);
                    }

                    if (atasNode.size() < TAMANHO_PAGINA) break;
                }

                // Todas as atas e itens desta licitação foram processados sem exceção
                // (mesmo que zero atas tenham sido encontradas) — marca como concluída
                // para não ficar reprocessando a mesma licitação a cada execução.
                licitacoesConcluidas.add(licitacao.getId());
            } catch (Exception e) {
                System.err.printf("ERROR: Licitação %s: %s%n", numeroPncp, e.getMessage());
            }
        }
    }

    private void processarItensAta(ObjectMapper mapper, AtaRegistroPreco ata,
                                    String cnpj, String ano, String sequencial,
                                    Long licitacaoId,
                                    Map<String, PorteFornecedor> porteCache,
                                    ConcurrentHashMap<String, Fornecedor> fornecedorCache,
                                    ConcurrentLinkedQueue<long[]> itemUpdates) {
        // Itens pendentes desta licitação (query leve: só id + numero_item)
        List<Object[]> itensPendentes = jdbcTemplate.query(
                "SELECT id_item_licitacao, numero_item FROM mural.item_licitacao " +
                "WHERE licitacao_id = ? AND fornecedor_id IS NULL",
                (rs, row) -> new Object[]{rs.getLong(1), rs.getString(2)},
                licitacaoId);

        if (itensPendentes.isEmpty()) return;

        Map<String, Long> itemMap = itensPendentes.stream()
                .filter(r -> r[1] != null)
                .collect(Collectors.toMap(r -> r[1].toString(), r -> (Long) r[0], (a, b) -> a));

        for (int pagina = 1; pagina <= 100; pagina++) {
            JsonNode raw = lerOuBaixarItensAta(mapper, cnpj, ano, sequencial, pagina, ata.getNumeroPncp());
            if (raw == null) break;
            JsonNode itensNode = raw.isArray() ? raw : raw.path("data");
            if (!itensNode.isArray() || itensNode.size() == 0) break;

            for (JsonNode itemNode : itensNode) {
                String numeroItemStr = String.valueOf(itemNode.path("numeroItem").asInt(0));
                Long itemId = itemMap.get(numeroItemStr);
                if (itemId == null) continue;

                String documento = itemNode.path("niFornecedor").asText(null);
                String nome = itemNode.path("nomeFornecedor").asText(null);
                if (documento == null || nome == null) continue;

                String porteNome = itemNode.path("porteFornecedor").asText("Não Informado");
                PorteFornecedor porte = findOrCreatePorteCached(porteNome, porteCache);
                Fornecedor fornecedor = findOrCreateFornecedorCached(documento, nome, porte, fornecedorCache);

                itemUpdates.add(new long[]{fornecedor.getId(), itemId});
                itemMap.remove(numeroItemStr); // evita duplicata
            }

            if (itensNode.size() < TAMANHO_PAGINA) break;
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

    private AtaRegistroPreco mapearAta(JsonNode node, Licitacao licitacao) {
        try {
            String numeroPncp = node.path("numeroControlePNCP").asText(null);
            if (numeroPncp == null) return null;
            boolean cancelado = node.path("cancelado").asBoolean(false);
            AtaRegistroPreco ata = new AtaRegistroPreco();
            ata.setNumeroAta(parseIntNullable(node.path("numeroAtaRegistroPreco").asText(null)));
            ata.setAno(node.path("anoAta").asInt(0));
            ata.setSequencial(node.path("sequencialAta").asInt(0));
            ata.setNumeroPncp(numeroPncp);
            ata.setDataAssinatura(parseDate(node.path("dataAssinatura").asText(null)));
            ata.setDataVigenciaInicio(parseDate(node.path("dataVigenciaInicio").asText(null)));
            ata.setDataVigenciaFim(parseDate(node.path("dataVigenciaFim").asText(null)));
            ata.setSituacaoId(cancelado ? 2 : 1);
            ata.setSituacaoNome(cancelado ? "Cancelada" : "Vigente");
            ata.setLicitacao(licitacao);
            return ata;
        } catch (Exception e) {
            return null;
        }
    }

    private Integer parseIntNullable(String s) {
        if (s == null || s.isBlank()) return null;
        try { return Integer.parseInt(s.trim()); } catch (Exception e) { return null; }
    }

    private java.util.Date parseDate(String s) {
        if (s == null || s.isBlank()) return null;
        // Tenta LocalDateTime primeiro (ex: "2025-11-24T00:00:00"), retorna null se falhar
        java.util.Date d = DateUtil.convert(s);
        if (d != null) return d;
        try {
            // Fallback: LocalDate (ex: "2025-11-24")
            java.time.LocalDate ld = java.time.LocalDate.parse(s.substring(0, 10));
            return java.util.Date.from(ld.atStartOfDay(java.time.ZoneId.systemDefault()).toInstant());
        } catch (Exception e) {
            return null;
        }
    }

    private JsonNode lerOuBaixarAtas(ObjectMapper mapper, String cnpj, String ano,
                                     String sequencial, int pagina) {
        String fileName = String.format("%satas-%s-%s-%s-%d.json", folderAtas, cnpj, ano, sequencial, pagina);
        File arquivo = new File(fileName);
        if (!arquivo.exists()) {
            try {
                String resposta = ataClient.getAtas(cnpj, ano, sequencial, pagina, TAMANHO_PAGINA);
                if (resposta == null || resposta.equals("[]")) {
                    try { mapper.writeValue(arquivo, mapper.readTree("[]")); } catch (Exception ignored) {}
                    return null;
                }
                JsonNode node = mapper.readTree(resposta);
                mapper.writerWithDefaultPrettyPrinter().writeValue(arquivo, node);
                return node;
            } catch (FeignException.NotFound e) {
                try { mapper.writeValue(arquivo, mapper.readTree("[]")); } catch (Exception ignored) {}
                return null;
            } catch (Exception e) {
                System.err.printf("ERROR: Download atas %s/%s pág %d: %s%n", cnpj, sequencial, pagina, e.getMessage());
                return null;
            }
        }
        try { return mapper.readTree(arquivo); } catch (Exception e) { return null; }
    }

    private JsonNode lerOuBaixarItensAta(ObjectMapper mapper, String cnpj, String ano,
                                          String sequencial, int pagina, String numeroPncpAta) {
        String fileName = String.format("%sitens-%s-%d.json",
                folderItensAta, numeroPncpAta.replace("/", "-"), pagina);
        File arquivo = new File(fileName);
        if (!arquivo.exists()) {
            try {
                String resposta = ataClient.getItensAta(cnpj, ano, sequencial, pagina, TAMANHO_PAGINA);
                if (resposta == null || resposta.equals("[]")) {
                    try { mapper.writeValue(arquivo, mapper.readTree("[]")); } catch (Exception ignored) {}
                    return null;
                }
                JsonNode node = mapper.readTree(resposta);
                mapper.writerWithDefaultPrettyPrinter().writeValue(arquivo, node);
                return node;
            } catch (FeignException.NotFound e) {
                try { mapper.writeValue(arquivo, mapper.readTree("[]")); } catch (Exception ignored) {}
                return null;
            } catch (Exception e) {
                System.err.printf("ERROR: Download itens ata %s pág %d: %s%n", numeroPncpAta, pagina, e.getMessage());
                return null;
            }
        }
        try { return mapper.readTree(arquivo); } catch (Exception e) { return null; }
    }

    private String extrairCnpj(String numeroPncp) {
        return numeroPncp.substring(0, numeroPncp.indexOf("-"));
    }

    private String extrairSequencial(String numeroPncp) {
        int ini = numeroPncp.lastIndexOf("-") + 1;
        int fim = numeroPncp.indexOf("/");
        return String.valueOf(Integer.parseInt(numeroPncp.substring(ini, fim)));
    }

    private String extrairAno(String numeroPncp) {
        return numeroPncp.substring(numeroPncp.indexOf("/") + 1);
    }
}
