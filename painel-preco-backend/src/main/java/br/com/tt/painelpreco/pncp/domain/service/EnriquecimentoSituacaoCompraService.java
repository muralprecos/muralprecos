package br.com.tt.painelpreco.pncp.domain.service;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Popula situacao_compra e situacao_compra_id lendo os JSONs de licitações.
 *
 * Lê arquivos em janelas de FILES_PER_FLUSH para não acumular tudo na heap.
 * A cada janela faz o batch UPDATE e libera a lista.
 * Situações distintas (~4 valores) são mantidas em memória e upsertadas uma vez.
 */
@Service
public class EnriquecimentoSituacaoCompraService {

    private static final int BATCH_SIZE    = 2000;
    private static final int FILES_PER_FLUSH = 500;

    @Value("${pncp.api.output.dir}")
    private String jsonDir;

    @Autowired
    private JdbcTemplate jdbc;

    private final ObjectMapper mapper = new ObjectMapper();
    private String folder;

    @PostConstruct
    public void init() {
        folder = jsonDir;
    }

    public void enriquecer() {
        long inicio = System.currentTimeMillis();
        System.out.println("INFO: Iniciando enriquecimento de situacao_compra...");

        File dir = new File(folder);
        File[] arquivos = dir.listFiles((d, name) -> name.startsWith("licitacoes") && name.endsWith(".json"));
        if (arquivos == null || arquivos.length == 0) {
            System.out.println("INFO: Nenhum arquivo de licitação encontrado.");
            return;
        }

        System.out.printf("INFO: %d arquivos encontrados.%n", arquivos.length);

        // Situações distintas — cabe tranquilamente em memória (~4 valores)
        Map<Integer, String> situacoesDistintas = new HashMap<>();
        int totalArquivos = 0;
        int totalAtualizados = 0;

        List<Object[]> buffer = new ArrayList<>(FILES_PER_FLUSH * 50);

        for (int i = 0; i < arquivos.length; i++) {
            File arq = arquivos[i];
            try {
                JsonNode root = mapper.readTree(arq);
                JsonNode dataNode = root.get("data");
                if (dataNode == null || !dataNode.isArray()) continue;

                for (JsonNode item : dataNode) {
                    int situacaoId = item.path("situacaoCompraId").asInt(-1);
                    String situacaoNome = item.path("situacaoCompraNome").asText(null);
                    String numeroPncp = item.path("numeroControlePNCP").asText(null);
                    if (situacaoId < 0 || situacaoNome == null || numeroPncp == null) continue;

                    situacoesDistintas.putIfAbsent(situacaoId, situacaoNome);
                    buffer.add(new Object[]{situacaoId, numeroPncp});
                }
                totalArquivos++;
            } catch (Exception e) {
                System.err.printf("ERROR: Arquivo %s: %s%n", arq.getName(), e.getMessage());
            }

            // A cada FILES_PER_FLUSH arquivos, persiste situações e faz flush do buffer
            boolean ultima = (i == arquivos.length - 1);
            if ((i + 1) % FILES_PER_FLUSH == 0 || ultima) {
                upsertSituacoes(situacoesDistintas);
                totalAtualizados += flushBuffer(buffer);
                System.out.printf("INFO: %d/%d arquivos processados, %d licitações atualizadas acumuladas.%n",
                        i + 1, arquivos.length, totalAtualizados);
            }
        }

        System.out.printf("INFO: Enriquecimento concluído — %d arquivos, %d licitações atualizadas em %.1fs%n",
                totalArquivos, totalAtualizados, (System.currentTimeMillis() - inicio) / 1000.0);
    }

    private void upsertSituacoes(Map<Integer, String> situacoes) {
        for (Map.Entry<Integer, String> e : situacoes.entrySet()) {
            jdbc.update(
                    "INSERT INTO mural.situacao_compra(id_situacao_compra, nome) VALUES (?, ?) " +
                    "ON CONFLICT (id_situacao_compra) DO UPDATE SET nome = EXCLUDED.nome",
                    e.getKey(), e.getValue());
        }
    }

    private int flushBuffer(List<Object[]> buffer) {
        if (buffer.isEmpty()) return 0;
        int atualizados = 0;
        for (int i = 0; i < buffer.size(); i += BATCH_SIZE) {
            List<Object[]> lote = buffer.subList(i, Math.min(i + BATCH_SIZE, buffer.size()));
            int[][] counts = jdbc.batchUpdate(
                    "UPDATE mural.licitacao SET situacao_compra_id = ? WHERE numero_controle_pncp = ?",
                    lote, BATCH_SIZE,
                    (ps, args) -> { ps.setInt(1, (Integer) args[0]); ps.setString(2, (String) args[1]); });
            for (int[] batch : counts) for (int c : batch) atualizados += Math.max(c, 0);
        }
        buffer.clear();
        return atualizados;
    }
}
