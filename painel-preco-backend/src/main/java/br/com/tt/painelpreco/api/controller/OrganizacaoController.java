package br.com.tt.painelpreco.api.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.tt.painelpreco.api.dto.OrganizacaoDTO;
import br.com.tt.painelpreco.api.dto.OrganizacaoDetalhesDTO;
import br.com.tt.painelpreco.api.dto.form.OrganizacaoForm;
import br.com.tt.painelpreco.arch.exception.ArchException;
import br.com.tt.painelpreco.arch.infra.auth.Organizacao;
import br.com.tt.painelpreco.domain.service.OrganizacaoService;
import br.com.tt.painelpreco.security.SecurityRoles;
import br.com.tt.painelpreco.util.ApiVersion;
import br.com.tt.painelpreco.util.ModelConverter;

@RestController
@RequestMapping(ApiVersion.LATEST + "/organizacoes")
public class OrganizacaoController {

  @Autowired
  private OrganizacaoService organizacaoService;

  @Autowired
  private ModelConverter converter;

  @GetMapping
  @PreAuthorize("hasRole('" + SecurityRoles.ADMIN + "')")
  public Page<OrganizacaoDTO> listar(@PageableDefault(size = 10) Pageable pageable) {
    Page<Organizacao> organizacoes = organizacaoService.listarOrganizacoes(pageable);
    List<OrganizacaoDTO> organizacoesDTO = converter.toDTOCollection(organizacoes.getContent(),
        OrganizacaoDTO.class);
    return new PageImpl<>(organizacoesDTO, pageable, organizacoes.getTotalElements());
  }

  @GetMapping("/{id}")
  @PreAuthorize("hasRole('" + SecurityRoles.ADMIN + "')")
  public ResponseEntity<OrganizacaoDTO> buscar(@PathVariable String id) {
    Organizacao organizacao = organizacaoService.buscarOrganizacao(id);
    if (organizacao == null) {
      return ResponseEntity.notFound().build();
    }
    OrganizacaoDTO dto = converter.toDTO(organizacao, OrganizacaoDTO.class);
    return ResponseEntity.ok(dto);
  }

  @GetMapping("/{id}/detalhes")
  @PreAuthorize("hasRole('" + SecurityRoles.ADMIN + "')")
  public ResponseEntity<OrganizacaoDetalhesDTO> detalhes(@PathVariable String id) {
    OrganizacaoDetalhesDTO dto = organizacaoService.buscarDetalhesOrganizacao(id);
    if (dto == null) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(dto);
  }

  @PostMapping
  @PreAuthorize("hasRole('" + SecurityRoles.ADMIN + "')")
  public ResponseEntity<OrganizacaoDTO> criar(@Valid @RequestBody OrganizacaoForm form) {
    try {
      Organizacao organizacao = organizacaoService.criarOrganizacao(form);
      OrganizacaoDTO dto = converter.toDTO(organizacao, OrganizacaoDTO.class);
      return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    } catch (ArchException e) {
      throw e;
    } catch (Exception e) {
      throw new ArchException(
          "Erro ao criar organização: " + (e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName()), e);
    }
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasRole('" + SecurityRoles.ADMIN + "')")
  public ResponseEntity<OrganizacaoDTO> atualizar(@PathVariable String id,
      @Valid @RequestBody OrganizacaoForm form) {
    try {
      Organizacao organizacao = organizacaoService.atualizarOrganizacao(id, form);
      OrganizacaoDTO dto = converter.toDTO(organizacao, OrganizacaoDTO.class);
      return ResponseEntity.ok(dto);
    } catch (ArchException e) {
      throw e;
    } catch (Exception e) {
      throw new ArchException(
          "Erro ao atualizar organização: " + (e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName()),
          e);
    }
  }

  @PutMapping("/{id}/reativar")
  @PreAuthorize("hasRole('" + SecurityRoles.ADMIN + "')")
  public ResponseEntity<OrganizacaoDTO> reativar(@PathVariable String id) {
    try {
      Organizacao organizacao = organizacaoService.reativarOrganizacao(id);
      OrganizacaoDTO dto = converter.toDTO(organizacao, OrganizacaoDTO.class);
      return ResponseEntity.ok(dto);
    } catch (ArchException e) {
      throw e;
    } catch (Exception e) {
      throw new ArchException(
          "Erro ao reativar organização: " + (e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName()),
          e);
    }
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('" + SecurityRoles.ADMIN + "')")
  public ResponseEntity<Void> desativar(@PathVariable String id) {
    try {
      organizacaoService.desativarOrganizacao(id);
      return ResponseEntity.noContent().build();
    } catch (ArchException e) {
      throw e;
    } catch (Exception e) {
      throw new ArchException(
          "Erro ao desativar organização: " + (e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName()),
          e);
    }
  }

  @PutMapping("/{id}/gestores/{usuarioId}")
  @PreAuthorize("hasRole('" + SecurityRoles.ADMIN + "')")
  public ResponseEntity<Void> adicionarGestor(@PathVariable String id, @PathVariable String usuarioId) {
    try {
      organizacaoService.adicionarGestor(id, usuarioId);
      return ResponseEntity.ok().build();
    } catch (ArchException e) {
      throw e;
    } catch (Exception e) {
      throw new ArchException("Erro ao adicionar gestor: " + e.getMessage(), e);
    }
  }

  @DeleteMapping("/{id}/gestores/{usuarioId}")
  @PreAuthorize("hasRole('" + SecurityRoles.ADMIN + "')")
  public ResponseEntity<Void> removerGestor(@PathVariable String id, @PathVariable String usuarioId) {
    try {
      organizacaoService.removerGestor(id, usuarioId);
      return ResponseEntity.noContent().build();
    } catch (ArchException e) {
      throw e;
    } catch (Exception e) {
      throw new ArchException("Erro ao remover gestor: " + e.getMessage(), e);
    }
  }

}

