package br.com.tt.painelpreco.api.controller;

import java.util.List;
import java.util.UUID;

import javax.validation.Valid;

import org.keycloak.KeycloakPrincipal;
import org.keycloak.adapters.springsecurity.token.KeycloakAuthenticationToken;
import org.keycloak.representations.AccessToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.tt.painelpreco.api.dto.UsuarioDTO;
import br.com.tt.painelpreco.api.dto.form.PerfilForm;
import br.com.tt.painelpreco.api.dto.form.UsuarioForm;
import br.com.tt.painelpreco.arch.exception.ArchException;
import br.com.tt.painelpreco.arch.infra.auth.Usuario;
import br.com.tt.painelpreco.domain.service.UsuarioService;
import br.com.tt.painelpreco.security.keycloak.KeycloakAdminService;
import br.com.tt.painelpreco.util.ApiVersion;
import br.com.tt.painelpreco.util.ModelConverter;

@RestController
@RequestMapping(ApiVersion.LATEST + "/usuarios")
public class UsuarioController {

  @Autowired
  private UsuarioService usuarioService;

  @Autowired
  private KeycloakAdminService keycloakAdminService;

  @Autowired
  private ModelConverter converter;

  @GetMapping
  public Page<UsuarioDTO> listar(@PageableDefault(size = 10) Pageable pageable) {
    Page<Usuario> usuarios = usuarioService.listarUsuarios(pageable);
    List<UsuarioDTO> usuariosDTO = converter.toDTOCollection(usuarios.getContent(), UsuarioDTO.class);
    return new PageImpl<>(usuariosDTO, pageable, usuarios.getTotalElements());
  }

  @GetMapping("/me")
  public ResponseEntity<UsuarioDTO> me() {
    AccessToken token = obterAccessToken();
    String keycloakUserId = token.getSubject();
    Usuario usuario = usuarioService.buscarUsuario(keycloakUserId);
    if (usuario == null) {
      // Usuário existe no Keycloak mas não no banco local — retorna dados do token
      return ResponseEntity.ok(dtoFromToken(token));
    }
    UsuarioDTO dto = converter.toDTO(usuario, UsuarioDTO.class);
    if (usuario.getOrganizacao() != null) {
      dto.setOrganizacaoNome(usuario.getOrganizacao().getNome());
      dto.setOrganizacaoId(usuario.getOrganizacao().getId());
    }
    return ResponseEntity.ok(dto);
  }

  @PutMapping("/me")
  public ResponseEntity<UsuarioDTO> atualizarMe(@Valid @RequestBody PerfilForm form) {
    AccessToken token = obterAccessToken();
    String keycloakUserId = token.getSubject();
    try {
      Usuario usuario = usuarioService.buscarUsuario(keycloakUserId);
      if (usuario == null) {
        // Usuário existe no Keycloak mas não no banco local — atualiza apenas no Keycloak
        keycloakAdminService.atualizarUsuario(keycloakUserId, form.getEmail(),
            form.getFirstName(), form.getLastName(), null);
        if (form.getPassword() != null && !form.getPassword().isBlank()) {
          keycloakAdminService.atualizarSenhaUsuario(keycloakUserId, form.getPassword());
        }
        UsuarioDTO dto = dtoFromToken(token);
        // Atualiza com os novos valores do form
        if (form.getEmail() != null) dto.setEmail(form.getEmail());
        String nome = (form.getFirstName() != null ? form.getFirstName() : "") +
            (form.getLastName() != null && !form.getLastName().isBlank() ? " " + form.getLastName() : "");
        if (!nome.isBlank()) dto.setNome(nome);
        return ResponseEntity.ok(dto);
      }

      UsuarioForm usuarioForm = new UsuarioForm();
      usuarioForm.setEmail(form.getEmail());
      usuarioForm.setFirstName(form.getFirstName());
      usuarioForm.setLastName(form.getLastName());
      usuarioForm.setPassword(form.getPassword());

      usuario = usuarioService.atualizarUsuario(keycloakUserId, usuarioForm);
      UsuarioDTO dto = converter.toDTO(usuario, UsuarioDTO.class);
      if (usuario.getOrganizacao() != null) {
        dto.setOrganizacaoNome(usuario.getOrganizacao().getNome());
        dto.setOrganizacaoId(usuario.getOrganizacao().getId());
      }
      return ResponseEntity.ok(dto);
    } catch (ArchException e) {
      throw e;
    } catch (Exception e) {
      throw new ArchException(
          "Erro ao atualizar perfil: " + (e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName()), e);
    }
  }

  private AccessToken obterAccessToken() {
    try {
      KeycloakAuthenticationToken authentication =
          (KeycloakAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
      @SuppressWarnings("unchecked")
      KeycloakPrincipal<?> principal = (KeycloakPrincipal<?>) authentication.getPrincipal();
      return principal.getKeycloakSecurityContext().getToken();
    } catch (Exception e) {
      throw new ArchException("Não foi possível identificar o usuário autenticado");
    }
  }

  private String obterKeycloakUserId() {
    return obterAccessToken().getSubject();
  }

  private UsuarioDTO dtoFromToken(AccessToken token) {
    UsuarioDTO dto = new UsuarioDTO();
    dto.setUuid(UUID.fromString(token.getSubject()));
    dto.setUsername(token.getPreferredUsername());
    dto.setEmail(token.getEmail());
    String firstName = token.getGivenName() != null ? token.getGivenName() : "";
    String lastName = token.getFamilyName() != null ? token.getFamilyName() : "";
    dto.setNome(firstName + (lastName.isBlank() ? "" : " " + lastName));
    dto.setAtivo(true);
    return dto;
  }

  @GetMapping("/{id}")
  public ResponseEntity<UsuarioDTO> buscar(@PathVariable String id) {
    Usuario usuario = usuarioService.buscarUsuario(id);
    if (usuario == null) {
      return ResponseEntity.notFound().build();
    }
    UsuarioDTO dto = converter.toDTO(usuario, UsuarioDTO.class);
    // Preencher campos adicionais do DTO
    if (usuario.getOrganizacao() != null) {
      dto.setOrganizacaoNome(usuario.getOrganizacao().getNome());
      dto.setOrganizacaoId(usuario.getOrganizacao().getId());
    }
    return ResponseEntity.ok(dto);
  }

  @GetMapping("/{id}/detalhes")
  public ResponseEntity<UsuarioDTO> detalhes(@PathVariable String id) {
    UsuarioDTO dto = usuarioService.buscarDetalhesUsuario(id);
    if (dto == null) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(dto);
  }

  @PutMapping("/{id}")
  public ResponseEntity<UsuarioDTO> atualizar(@PathVariable String id, @Valid @RequestBody UsuarioForm form) {
    try {
      Usuario usuario = usuarioService.atualizarUsuario(id, form);
      UsuarioDTO dto = converter.toDTO(usuario, UsuarioDTO.class);
      // Preencher campos adicionais do DTO
      if (usuario.getOrganizacao() != null) {
        dto.setOrganizacaoNome(usuario.getOrganizacao().getNome());
        dto.setOrganizacaoId(usuario.getOrganizacao().getId());
      }
      return ResponseEntity.ok(dto);
    } catch (ArchException e) {
      throw e;
    } catch (Exception e) {
      throw new ArchException(
          "Erro ao atualizar usuário: " + (e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName()), e);
    }
  }

  @PutMapping("/{id}/reativar")
  public ResponseEntity<UsuarioDTO> reativar(@PathVariable String id) {
    try {
      Usuario usuario = usuarioService.reativarUsuario(id);
      UsuarioDTO dto = converter.toDTO(usuario, UsuarioDTO.class);
      if (usuario.getOrganizacao() != null) {
        dto.setOrganizacaoNome(usuario.getOrganizacao().getNome());
        dto.setOrganizacaoId(usuario.getOrganizacao().getId());
      }
      return ResponseEntity.ok(dto);
    } catch (ArchException e) {
      throw e;
    } catch (Exception e) {
      throw new ArchException(
          "Erro ao reativar usuário: " + (e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName()), e);
    }
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> desativar(@PathVariable String id) {
    try {
      usuarioService.desativarUsuario(id);
      return ResponseEntity.noContent().build();
    } catch (ArchException e) {
      throw e;
    } catch (Exception e) {
      throw new ArchException(
          "Erro ao desativar usuário: " + (e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName()), e);
    }
  }

}
