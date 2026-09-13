package br.com.tt.painelpreco.api.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartFile;

import br.com.tt.painelpreco.api.dto.PncpOutputExtracaoDTO;
import br.com.tt.painelpreco.domain.service.PncpOutputUploadService;
import br.com.tt.painelpreco.security.SecurityRoles;
import br.com.tt.painelpreco.util.ApiVersion;

/**
 * Upload administrativo (em chunks) de um output.tar.gz com JSONs do PNCP já baixados em
 * outro ambiente, para popular o diretório de saída sem precisar rebaixar tudo da API do
 * PNCP. Ver {@link PncpOutputUploadService} para a justificativa do upload em pedaços.
 */
@RestController
@RequestMapping(ApiVersion.LATEST + "/admin/pncp-output")
public class PncpOutputUploadController {

    @Autowired
    private PncpOutputUploadService service;

    @PostMapping("/uploads")
    @PreAuthorize("hasRole('" + SecurityRoles.ADMIN + "')")
    public ResponseEntity<Map<String, Object>> iniciar() {
        String uploadId = service.iniciarUpload();
        Map<String, Object> body = new HashMap<>();
        body.put("uploadId", uploadId);
        return ResponseEntity.ok(body);
    }

    @PutMapping("/uploads/{uploadId}/chunks/{index}")
    @PreAuthorize("hasRole('" + SecurityRoles.ADMIN + "')")
    public ResponseEntity<Void> receberChunk(
            @PathVariable String uploadId,
            @PathVariable int index,
            @RequestParam("chunk") MultipartFile chunk) throws IOException {
        service.receberChunk(uploadId, index, chunk);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/uploads/{uploadId}/status")
    @PreAuthorize("hasRole('" + SecurityRoles.ADMIN + "')")
    public ResponseEntity<Map<String, Object>> status(@PathVariable String uploadId) {
        Set<Integer> recebidos = service.statusChunks(uploadId);
        Map<String, Object> body = new HashMap<>();
        body.put("chunksRecebidos", recebidos);
        return ResponseEntity.ok(body);
    }

    @PostMapping("/uploads/{uploadId}/finalizar")
    @PreAuthorize("hasRole('" + SecurityRoles.ADMIN + "')")
    public ResponseEntity<PncpOutputExtracaoDTO> finalizar(
            @PathVariable String uploadId,
            @RequestParam("totalChunks") int totalChunks) throws IOException {
        PncpOutputExtracaoDTO resultado = service.finalizar(uploadId, totalChunks);
        return ResponseEntity.ok(resultado);
    }

    @DeleteMapping("/uploads/{uploadId}")
    @PreAuthorize("hasRole('" + SecurityRoles.ADMIN + "')")
    public ResponseEntity<Void> abortar(@PathVariable String uploadId) throws IOException {
        service.abortar(uploadId);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler({ IllegalArgumentException.class, IllegalStateException.class })
    public ResponseEntity<Map<String, Object>> handleErroValidacao(RuntimeException e) {
        Map<String, Object> body = new HashMap<>();
        body.put("erro", e.getMessage());
        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, Object>> handleChunkGrandeDemais(MaxUploadSizeExceededException e) {
        Map<String, Object> body = new HashMap<>();
        body.put("erro", "Chunk maior que o limite permitido — reduza o tamanho do chunk no script de envio.");
        return ResponseEntity.badRequest().body(body);
    }

}
