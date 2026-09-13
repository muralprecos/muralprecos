package br.com.tt.painelpreco.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.tt.painelpreco.api.dto.ColetaPncpStatusDTO;
import br.com.tt.painelpreco.pncp.domain.service.ColetaDadosPncpService;
import br.com.tt.painelpreco.security.SecurityRoles;
import br.com.tt.painelpreco.util.ApiVersion;

/**
 * Disparos de coleta PNCP a partir da área administrativa (Keycloak ADMIN), em contraste
 * com {@link ColetaPncpController}, que é protegido por chave compartilhada para uso via
 * script/ops. Todos os disparos aqui são assíncronos (retornam imediatamente) e reaproveitam
 * as mesmas travas de concorrência do agendamento noturno.
 */
@RestController
@RequestMapping(ApiVersion.LATEST + "/admin/coleta-pncp")
public class ColetaPncpAdminController {

    @Autowired
    private ColetaDadosPncpService coletaService;

    @GetMapping("/status")
    @PreAuthorize("hasRole('" + SecurityRoles.ADMIN + "')")
    public ResponseEntity<ColetaPncpStatusDTO> status() {
        return ResponseEntity.ok(coletaService.getStatus());
    }

    @PostMapping("/fornecedores")
    @PreAuthorize("hasRole('" + SecurityRoles.ADMIN + "')")
    public ResponseEntity<ColetaPncpStatusDTO> dispararFornecedores() {
        coletaService.dispararFornecedoresAsync();
        return ResponseEntity.ok(coletaService.getStatus());
    }

    @PostMapping("/atas")
    @PreAuthorize("hasRole('" + SecurityRoles.ADMIN + "')")
    public ResponseEntity<ColetaPncpStatusDTO> dispararAtas() {
        coletaService.dispararAtasAsync();
        return ResponseEntity.ok(coletaService.getStatus());
    }

    @PostMapping("/licitacoes-itens")
    @PreAuthorize("hasRole('" + SecurityRoles.ADMIN + "')")
    public ResponseEntity<ColetaPncpStatusDTO> dispararLicitacoesItens(
            @RequestParam(value = "licitacoesOnly", defaultValue = "false") boolean licitacoesOnly) {
        coletaService.dispararLicitacoesItensAsync(licitacoesOnly);
        return ResponseEntity.ok(coletaService.getStatus());
    }

}
