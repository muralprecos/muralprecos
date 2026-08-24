package br.com.tt.painelpreco.api.controller;

import java.util.UUID;

import org.keycloak.KeycloakPrincipal;
import org.keycloak.adapters.springsecurity.token.KeycloakAuthenticationToken;
import org.keycloak.representations.AccessToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.tt.painelpreco.api.dto.SincronizacaoResultadoDTO;
import br.com.tt.painelpreco.arch.infra.auth.Usuario;
import br.com.tt.painelpreco.domain.service.SincronizacaoService;
import br.com.tt.painelpreco.domain.service.UsuarioService;
import br.com.tt.painelpreco.security.SecurityRoles;
import br.com.tt.painelpreco.util.ApiVersion;

@RestController
@RequestMapping(ApiVersion.LATEST + "/sincronizacao")
public class SincronizacaoController {

  @Autowired
  private SincronizacaoService sincronizacaoService;

  @Autowired
  private UsuarioService usuarioService;

  @PostMapping
  @PreAuthorize("hasRole('" + SecurityRoles.ADMIN + "')")
  public ResponseEntity<SincronizacaoResultadoDTO> sincronizar() {
    Integer executorId = obterExecutorId();
    SincronizacaoResultadoDTO resultado = sincronizacaoService.sincronizar(executorId);
    return ResponseEntity.ok(resultado);
  }

  @GetMapping("/simular")
  @PreAuthorize("hasRole('" + SecurityRoles.ADMIN + "')")
  public ResponseEntity<SincronizacaoResultadoDTO> simular() {
    Integer executorId = obterExecutorId();
    SincronizacaoResultadoDTO resultado = sincronizacaoService.simular(executorId);
    return ResponseEntity.ok(resultado);
  }

  private Integer obterExecutorId() {
    try {
      KeycloakAuthenticationToken authentication =
          (KeycloakAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
      @SuppressWarnings("unchecked")
      KeycloakPrincipal<?> principal = (KeycloakPrincipal<?>) authentication.getPrincipal();
      AccessToken token = principal.getKeycloakSecurityContext().getToken();
      UUID uuid = UUID.fromString(token.getSubject());
      Usuario usuario = usuarioService.findByUuid(uuid);
      return usuario != null ? usuario.getId() : null;
    } catch (Exception e) {
      return null;
    }
  }

}
