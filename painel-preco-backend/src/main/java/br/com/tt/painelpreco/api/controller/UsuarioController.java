package br.com.tt.painelpreco.api.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.tt.painelpreco.api.dto.UsuarioDTO;
import br.com.tt.painelpreco.api.dto.form.UsuarioForm;
import br.com.tt.painelpreco.arch.exception.ArchException;
import br.com.tt.painelpreco.arch.infra.auth.Usuario;
import br.com.tt.painelpreco.domain.service.UsuarioService;
import br.com.tt.painelpreco.util.ApiVersion;
import br.com.tt.painelpreco.util.ModelConverter;

@RestController
@RequestMapping(ApiVersion.LATEST + "/usuarios")
public class UsuarioController {

  @Autowired
  private UsuarioService usuarioService;

  @Autowired
  private ModelConverter converter;

  @GetMapping
  public Page<UsuarioDTO> listar(@PageableDefault(size = 10) Pageable pageable) {
    Page<Usuario> usuarios = usuarioService.listarUsuarios(pageable);
    List<UsuarioDTO> usuariosDTO = converter.toDTOCollection(usuarios.getContent(), UsuarioDTO.class);
    return new PageImpl<>(usuariosDTO, pageable, usuarios.getTotalElements());
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

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deletar(@PathVariable String id) {
    try {
      usuarioService.deletarUsuario(id);
      return ResponseEntity.noContent().build();
    } catch (ArchException e) {
      throw e;
    } catch (Exception e) {
      throw new ArchException(
          "Erro ao deletar usuário: " + (e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName()), e);
    }
  }

}
