package br.com.tt.painelpreco.domain.service;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.TreeSet;
import java.util.UUID;
import java.util.regex.Pattern;

import org.apache.commons.compress.archivers.tar.TarArchiveEntry;
import org.apache.commons.compress.archivers.tar.TarArchiveInputStream;
import org.apache.commons.compress.compressors.gzip.GzipCompressorInputStream;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import br.com.tt.painelpreco.api.dto.PncpOutputExtracaoDTO;

/**
 * Recebe, em pedaços (chunks), um output.tar.gz com JSONs do PNCP já baixados em outro
 * ambiente (ex.: local) e extrai diretamente no diretório de saída ({@code pncp.api.output.dir}),
 * evitando que o ambiente de destino precise rebaixar tudo da API do PNCP.
 *
 * Upload em chunks (não um arquivo único) porque o volume real é de dezenas de GB — um único
 * POST desse tamanho esbarraria em timeout de conexões instáveis, no limite padrão de multipart
 * do Spring e, frequentemente, em limites de proxy/CDN à frente do backend que não estão sob
 * nosso controle. Cada chunk vira um arquivo próprio em disco (sessão identificada por
 * {@code uploadId}), permitindo retomar/reenviar só o que faltar em caso de falha de rede.
 */
@Service
public class PncpOutputUploadService {

    private static final Pattern UUID_PATTERN =
            Pattern.compile("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$");

    private static final Set<String> PASTAS_PERMITIDAS = Set.of("atas", "resultados", "itens");

    // Folgas generosas acima do volume real atual (~7,4M arquivos / ~36GB) só para conter
    // um upload claramente malformado ou malicioso — isto é um endpoint ADMIN autenticado,
    // não uma superfície pública, então o modelo de ameaça aqui é "erro humano", não ataque.
    private static final long MAX_ENTRADAS = 20_000_000L;
    private static final long MAX_BYTES_TOTAL = 200L * 1024 * 1024 * 1024; // 200GB

    @Value("${pncp.api.output.dir}")
    private String outputDir;

    @Value("${pncp.output.upload.tmp-dir}")
    private String tmpDirBase;

    public String iniciarUpload() {
        String uploadId = UUID.randomUUID().toString();
        File dir = diretorioSessao(uploadId);
        if (!dir.mkdirs()) {
            throw new IllegalStateException("Não foi possível criar o diretório temporário do upload.");
        }
        return uploadId;
    }

    public void receberChunk(String uploadId, int index, MultipartFile chunk) throws IOException {
        if (index < 0) {
            throw new IllegalArgumentException("Índice de chunk inválido: " + index);
        }
        File dir = diretorioSessaoExistente(uploadId);
        File destino = new File(dir, "chunk-" + index);
        chunk.transferTo(destino);
    }

    public Set<Integer> statusChunks(String uploadId) {
        File dir = diretorioSessaoExistente(uploadId);
        String[] arquivos = dir.list((d, name) -> name.startsWith("chunk-"));
        Set<Integer> indices = new TreeSet<>();
        if (arquivos != null) {
            for (String nome : arquivos) {
                try {
                    indices.add(Integer.parseInt(nome.substring("chunk-".length())));
                } catch (NumberFormatException ignored) {
                    // arquivo inesperado no diretório da sessão — ignora
                }
            }
        }
        return indices;
    }

    public void abortar(String uploadId) throws IOException {
        File dir = diretorioSessao(uploadId);
        if (dir.isDirectory()) {
            apagarRecursivo(dir.toPath());
        }
    }

    public PncpOutputExtracaoDTO finalizar(String uploadId, int totalChunks) throws IOException {
        File dir = diretorioSessaoExistente(uploadId);

        for (int i = 0; i < totalChunks; i++) {
            if (!new File(dir, "chunk-" + i).isFile()) {
                throw new IllegalStateException(
                        "Chunk " + i + " de " + totalChunks + " ainda não recebido — reenvie antes de finalizar.");
            }
        }

        File tarGz = new File(dir, "output.tar.gz");
        try (OutputStream out = new BufferedOutputStream(new FileOutputStream(tarGz))) {
            for (int i = 0; i < totalChunks; i++) {
                File chunkFile = new File(dir, "chunk-" + i);
                try (InputStream in = new FileInputStream(chunkFile)) {
                    in.transferTo(out);
                }
                chunkFile.delete();
            }
        }

        try {
            return extrair(tarGz);
        } finally {
            apagarRecursivo(dir.toPath());
        }
    }

    private PncpOutputExtracaoDTO extrair(File tarGz) throws IOException {
        Path baseDir = Paths.get(outputDir).toAbsolutePath().normalize();
        Files.createDirectories(baseDir);

        long totalArquivos = 0;
        long totalBytes = 0;
        Map<String, Long> bytesPorPasta = new TreeMap<>();
        byte[] buffer = new byte[64 * 1024];

        try (InputStream fis = new FileInputStream(tarGz);
                InputStream gis = new GzipCompressorInputStream(new BufferedInputStream(fis));
                TarArchiveInputStream tis = new TarArchiveInputStream(gis)) {

            TarArchiveEntry entry;
            while ((entry = tis.getNextTarEntry()) != null) {
                if (entry.isDirectory()) {
                    continue;
                }
                if (totalArquivos >= MAX_ENTRADAS) {
                    throw new IOException("Limite de segurança de " + MAX_ENTRADAS
                            + " arquivos excedido — upload abortado.");
                }

                String nomeEntrada = normalizarNomeEntrada(entry.getName());
                if (nomeEntrada == null) {
                    continue; // entrada vazia/raiz — ignora
                }

                int barra = nomeEntrada.indexOf('/');
                String pastaTopo = barra >= 0 ? nomeEntrada.substring(0, barra) : nomeEntrada;
                if (!PASTAS_PERMITIDAS.contains(pastaTopo)) {
                    // Fora de atas/, resultados/ ou itens/: ignora silenciosamente. Não precisamos
                    // consumir os bytes da entrada — a próxima chamada a getNextTarEntry() já
                    // avança corretamente para a entrada seguinte.
                    continue;
                }

                Path destino = baseDir.resolve(nomeEntrada).normalize();
                if (!destino.startsWith(baseDir)) {
                    // Tentativa de path traversal (zip-slip) — ignora a entrada.
                    continue;
                }

                Files.createDirectories(destino.getParent());
                long bytesEsteArquivo = 0;
                try (OutputStream fout = new BufferedOutputStream(
                        Files.newOutputStream(destino))) {
                    int lidos;
                    while ((lidos = tis.read(buffer)) != -1) {
                        fout.write(buffer, 0, lidos);
                        bytesEsteArquivo += lidos;
                        totalBytes += lidos;
                        if (totalBytes > MAX_BYTES_TOTAL) {
                            throw new IOException("Limite de segurança de " + (MAX_BYTES_TOTAL / (1024 * 1024 * 1024))
                                    + "GB extraídos excedido — upload abortado.");
                        }
                    }
                }
                totalArquivos++;
                bytesPorPasta.merge(pastaTopo, bytesEsteArquivo, Long::sum);
            }
        }

        return new PncpOutputExtracaoDTO(totalArquivos, totalBytes, bytesPorPasta);
    }

    /** Remove "./" e "/" iniciais; retorna null se a entrada não sobrar com nenhum nome útil. */
    private String normalizarNomeEntrada(String nomeOriginal) {
        String nome = nomeOriginal.replace('\\', '/');
        while (nome.startsWith("./")) {
            nome = nome.substring(2);
        }
        while (nome.startsWith("/")) {
            nome = nome.substring(1);
        }
        return nome.isEmpty() ? null : nome;
    }

    private File diretorioSessao(String uploadId) {
        validarUploadId(uploadId);
        return new File(tmpDirBase, uploadId);
    }

    private File diretorioSessaoExistente(String uploadId) {
        File dir = diretorioSessao(uploadId);
        if (!dir.isDirectory()) {
            throw new IllegalArgumentException("Sessão de upload não encontrada ou já finalizada: " + uploadId);
        }
        return dir;
    }

    private void validarUploadId(String uploadId) {
        if (uploadId == null || !UUID_PATTERN.matcher(uploadId).matches()) {
            throw new IllegalArgumentException("uploadId inválido.");
        }
    }

    private void apagarRecursivo(Path caminho) throws IOException {
        if (!Files.exists(caminho)) {
            return;
        }
        try (var stream = Files.walk(caminho)) {
            stream.sorted((a, b) -> b.compareTo(a)).forEach(p -> {
                try {
                    Files.deleteIfExists(p);
                } catch (IOException e) {
                    System.err.println("WARN: falha ao remover " + p + ": " + e.getMessage());
                }
            });
        }
    }

}
