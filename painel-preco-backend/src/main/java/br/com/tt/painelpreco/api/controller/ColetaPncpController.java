package br.com.tt.painelpreco.api.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.tt.painelpreco.pncp.domain.service.ColetaDadosPncpService;
import br.com.tt.painelpreco.util.ApiVersion;

@RestController
@RequestMapping(ApiVersion.LATEST + "/coleta/pncp")
public class ColetaPncpController {

    @Autowired
    private ColetaDadosPncpService coletaService;

    @Value("${pncp.api.key}")
    private String apiKey;

    /**
     * Dispara coleta completa (download + ingestão).
     * POST /serverapi/v1/coleta/pncp/completa?chave=...&licitacoesOnly=false
     */
    @PostMapping("/completa")
    public ResponseEntity<Map<String, Object>> dispararColeta(
            @RequestParam("chave") String chave,
            @RequestParam(value = "licitacoesOnly", defaultValue = "false") boolean licitacoesOnly) {

        ResponseEntity<Map<String, Object>> validacao = validarChave(chave);
        if (validacao != null) return validacao;

        long inicio = System.currentTimeMillis();
        coletaService.getDados(true, licitacoesOnly);
        return ok("completa", licitacoesOnly, inicio);
    }

    /**
     * Ingere apenas os JSONs já baixados no disco (sem chamar a API PNCP).
     * POST /serverapi/v1/coleta/pncp/ingestao?chave=...
     */
    @PostMapping("/ingestao")
    public ResponseEntity<Map<String, Object>> ingerirExistentes(
            @RequestParam("chave") String chave) {

        ResponseEntity<Map<String, Object>> validacao = validarChave(chave);
        if (validacao != null) return validacao;

        long inicio = System.currentTimeMillis();
        coletaService.ingerirDadosExistentes();
        return ok("ingestao", false, inicio);
    }

    /**
     * Coleta resultados para popular fornecedores em itens sem fornecedor.
     * POST /serverapi/v1/coleta/pncp/fornecedores?chave=...
     */
    @PostMapping("/fornecedores")
    public ResponseEntity<Map<String, Object>> coletarFornecedores(
            @RequestParam("chave") String chave) {

        ResponseEntity<Map<String, Object>> validacao = validarChave(chave);
        if (validacao != null) return validacao;

        long inicio = System.currentTimeMillis();
        coletaService.coletarFornecedores();
        return ok("fornecedores", false, inicio);
    }

    /**
     * Lê os JSONs de licitações e popula situacao_compra + situacao_compra_id em licitacao.
     * POST /serverapi/v1/coleta/pncp/situacao-compra?chave=...
     */
    @PostMapping("/situacao-compra")
    public ResponseEntity<Map<String, Object>> enriquecerSituacaoCompra(
            @RequestParam("chave") String chave) {

        ResponseEntity<Map<String, Object>> validacao = validarChave(chave);
        if (validacao != null) return validacao;

        long inicio = System.currentTimeMillis();
        coletaService.enriquecerSituacaoCompra();
        return ok("situacao-compra", false, inicio);
    }

    /**
     * Ingere atas de registro de preço para licitações SRP pendentes.
     * POST /serverapi/v1/coleta/pncp/atas?chave=...
     */
    @PostMapping("/atas")
    public ResponseEntity<Map<String, Object>> coletarAtas(
            @RequestParam("chave") String chave) {

        ResponseEntity<Map<String, Object>> validacao = validarChave(chave);
        if (validacao != null) return validacao;

        long inicio = System.currentTimeMillis();
        coletaService.coletarAtas();
        return ok("atas", false, inicio);
    }

    private ResponseEntity<Map<String, Object>> validarChave(String chave) {
        if (!apiKey.equals(chave)) {
            Map<String, Object> erro = new HashMap<>();
            erro.put("erro", "Chave inválida");
            return ResponseEntity.status(403).body(erro);
        }
        return null;
    }

    private ResponseEntity<Map<String, Object>> ok(String etapa, boolean licitacoesOnly, long inicio) {
        Map<String, Object> resultado = new HashMap<>();
        resultado.put("status", "concluido");
        resultado.put("etapa", etapa);
        resultado.put("duracaoMs", System.currentTimeMillis() - inicio);
        resultado.put("licitacoesOnly", licitacoesOnly);
        return ResponseEntity.ok(resultado);
    }
}
