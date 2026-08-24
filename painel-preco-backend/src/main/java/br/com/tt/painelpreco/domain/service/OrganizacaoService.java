package br.com.tt.painelpreco.domain.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.transaction.Transactional;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import br.com.tt.painelpreco.api.dto.OrganizacaoDetalhesDTO;
import br.com.tt.painelpreco.api.dto.form.OrganizacaoForm;
import br.com.tt.painelpreco.arch.exception.ArchException;
import br.com.tt.painelpreco.arch.infra.auth.Organizacao;
import br.com.tt.painelpreco.arch.infra.auth.Usuario;
import br.com.tt.painelpreco.domain.repository.OrganizacaoRepository;
import br.com.tt.painelpreco.domain.repository.UsuarioRepository;
import br.com.tt.painelpreco.security.Role;
import br.com.tt.painelpreco.security.keycloak.KeycloakAdminService;
import br.com.tt.painelpreco.security.keycloak.OrganizacaoKeycloakAttributes;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class OrganizacaoService {

  @Autowired
  private OrganizacaoRepository organizacaoRepository;

  @Autowired
  private UsuarioRepository usuarioRepository;

  @Autowired
  private KeycloakAdminService keycloakAdminService;

  public Page<Organizacao> listarOrganizacoes(Pageable pageable) {
    log.debug("Listando organizações - página: {}, tamanho: {}", pageable.getPageNumber(), pageable.getPageSize());
    return organizacaoRepository.findAll(pageable);
  }

  public Organizacao buscarOrganizacao(String organizacaoId) {
    if (organizacaoId == null || organizacaoId.trim().isEmpty()) {
      log.warn("Identificador de organização é null ou vazio");
      return null;
    }

    // Tenta primeiro como UUID
    try {
      UUID uuid = UUID.fromString(organizacaoId);
      Organizacao org = organizacaoRepository.findByUuid(uuid);
      if (org != null) {
        log.debug("Organização encontrada por UUID: {}", uuid);
        return org;
      }
    } catch (IllegalArgumentException e) {
      log.debug("Identificador '{}' não é um UUID válido, tentando como ID sequencial", organizacaoId);
    }

    // Tenta como ID sequencial
    try {
      Integer id = Integer.parseInt(organizacaoId);
      return organizacaoRepository.findById(id).orElse(null);
    } catch (NumberFormatException e) {
      log.warn("Identificador '{}' não é nem UUID nem ID sequencial válido", organizacaoId);
      return null;
    }
  }

  @Transactional
  public Organizacao criarOrganizacao(OrganizacaoForm form) {
    log.info("Iniciando criação de organização: {}", form.getNome());

    validarDadosOrganizacao(form, null);

    // Criar group no Keycloak
    String keycloakGroupId;
    try {
      keycloakGroupId = keycloakAdminService.criarGroup(form.getNome(), form.getCnpj(), form.getNumero(), "true");
      log.info("Group criado no Keycloak com ID: {}", keycloakGroupId);
    } catch (Exception e) {
      log.error("Erro ao criar group no Keycloak: {}", e.getMessage());
      throw new ArchException("Falha ao criar organização no Keycloak: " + e.getMessage(), e);
    }

    // Persistir no banco local (sem cnpj/numero — ficam apenas no Keycloak)
    Organizacao organizacao = new Organizacao();
    organizacao.setUuid(UUID.fromString(keycloakGroupId));
    organizacao.setNome(form.getNome());
    organizacao.setAtivo(true);

    try {
      organizacao = organizacaoRepository.save(organizacao);
      log.info("Organização criada no banco de dados com ID: {}", organizacao.getId());
      return organizacao;
    } catch (Exception e) {
      log.error("Erro ao salvar organização no banco de dados: {}", e.getMessage());
      try {
        keycloakAdminService.deletarGroup(keycloakGroupId);
        log.warn("Group deletado no Keycloak após falha ao salvar no banco");
      } catch (Exception ex) {
        log.error("Erro ao deletar group no Keycloak após falha: {}", ex.getMessage());
      }
      throw new ArchException("Falha ao salvar organização no banco de dados: " + e.getMessage(), e);
    }
  }

  @Transactional
  public Organizacao atualizarOrganizacao(String organizacaoId, OrganizacaoForm form) {
    log.info("Iniciando atualização de organização: {}", organizacaoId);

    Organizacao organizacao = buscarOrganizacao(organizacaoId);
    if (organizacao == null) {
      throw new ArchException("Organização não encontrada com identificador: " + organizacaoId);
    }

    validarDadosOrganizacao(form, organizacao);

    // Atualizar group no Keycloak (inclui cnpj/numero como atributos)
    try {
      String groupId = organizacao.getUuid().toString();
      String enabledStr = String.valueOf(organizacao.getAtivo() != null ? organizacao.getAtivo() : true);
      keycloakAdminService.atualizarGroup(groupId, form.getNome(), form.getCnpj(), form.getNumero(), enabledStr);
      log.info("Group atualizado no Keycloak: {}", groupId);
    } catch (Exception e) {
      log.error("Erro ao atualizar group no Keycloak: {}", e.getMessage());
      throw new ArchException("Falha ao atualizar organização no Keycloak: " + e.getMessage(), e);
    }

    // Atualizar no banco local (apenas campos presentes na entidade)
    organizacao.setNome(form.getNome());

    try {
      organizacao = organizacaoRepository.save(organizacao);
      log.info("Organização atualizada no banco de dados com ID: {}", organizacao.getId());
      return organizacao;
    } catch (Exception e) {
      log.error("Erro ao atualizar organização no banco de dados: {}", e.getMessage());
      throw new ArchException("Falha ao atualizar organização no banco de dados: " + e.getMessage(), e);
    }
  }

  @Transactional
  public Organizacao desativarOrganizacao(String organizacaoId) {
    log.info("Iniciando desativação de organização: {}", organizacaoId);

    Organizacao organizacao = buscarOrganizacao(organizacaoId);
    if (organizacao == null) {
      throw new ArchException("Organização não encontrada com identificador: " + organizacaoId);
    }

    // Desativar usuários ativos em cascata
    List<Usuario> usuariosAtivos = usuarioRepository.findByOrganizacaoAndAtivo(organizacao, true);
    for (Usuario usuario : usuariosAtivos) {
      usuario.setAtivo(false);
      usuarioRepository.save(usuario);
      try {
        keycloakAdminService.desativarUsuario(usuario.getUuid().toString());
        log.info("Usuário {} desativado no Keycloak em cascata", usuario.getUuid());
      } catch (Exception e) {
        log.warn("Erro ao desativar usuário {} no Keycloak durante cascata: {}", usuario.getUuid(), e.getMessage());
      }
    }

    // Desativar organização no banco local
    organizacao.setAtivo(false);
    organizacao = organizacaoRepository.save(organizacao);
    log.info("Organização desativada com sucesso no banco. ID: {}", organizacao.getId());

    try {
      keycloakAdminService.alterarStatusGroup(organizacao.getUuid().toString(), false);
      log.info("Organização desativada no Keycloak");
    } catch (Exception e) {
      log.warn("Erro ao desativar organização no Keycloak: {}", e.getMessage());
    }

    return organizacao;
  }

  @Transactional
  public Organizacao reativarOrganizacao(String organizacaoId) {
    log.info("Iniciando reativação de organização: {}", organizacaoId);

    Organizacao organizacao = buscarOrganizacao(organizacaoId);
    if (organizacao == null) {
      throw new ArchException("Organização não encontrada com identificador: " + organizacaoId);
    }

    if (Boolean.TRUE.equals(organizacao.getAtivo())) {
      throw new ArchException("Organização já está ativa: " + organizacaoId);
    }

    organizacao.setAtivo(true);
    organizacao = organizacaoRepository.save(organizacao);
    log.info("Organização reativada com sucesso no banco. ID: {}", organizacao.getId());

    try {
      keycloakAdminService.alterarStatusGroup(organizacao.getUuid().toString(), true);
      log.info("Organização reativada no Keycloak");
    } catch (Exception e) {
      log.warn("Erro ao reativar organização no Keycloak: {}", e.getMessage());
    }

    return organizacao;
  }

  public OrganizacaoDetalhesDTO buscarDetalhesOrganizacao(String organizacaoId) {
    log.debug("Buscando detalhes de organização: {}", organizacaoId);

    Organizacao organizacao = buscarOrganizacao(organizacaoId);
    if (organizacao == null) {
      return null;
    }

    OrganizacaoDetalhesDTO dto = new OrganizacaoDetalhesDTO();
    dto.setId(organizacao.getId());
    dto.setUuid(organizacao.getUuid());
    dto.setNome(organizacao.getNome());
    dto.setAtivo(organizacao.getAtivo());
    dto.setDataCriacao(organizacao.getDataCriacao());

    // Buscar atributos extras do Keycloak (cnpj, telefone)
    try {
      JSONObject group = keycloakAdminService.buscarGroupPorId(organizacao.getUuid().toString());
      if (group != null) {
        dto.setKeycloakNaoEncontrado(false);
        JSONObject attributes = group.optJSONObject("attributes");
        if (attributes != null) {
          JSONArray cnpjArr = attributes.optJSONArray(OrganizacaoKeycloakAttributes.CNPJ);
          if (cnpjArr != null && cnpjArr.length() > 0) {
            dto.setCnpj(cnpjArr.getString(0));
          }
          JSONArray telefArr = attributes.optJSONArray(OrganizacaoKeycloakAttributes.TELEFONE);
          if (telefArr != null && telefArr.length() > 0) {
            dto.setTelefone(telefArr.getString(0));
          }
        }
      } else {
        log.warn("Group do Keycloak não encontrado para o UUID: {}", organizacao.getUuid());
        dto.setKeycloakNaoEncontrado(true);
      }
    } catch (Exception e) {
      log.warn("Erro ao buscar atributos do group no Keycloak: {}", e.getMessage());
      dto.setKeycloakNaoEncontrado(true);
    }

    // Buscar membros do group no Keycloak
    List<OrganizacaoDetalhesDTO.MembroDTO> membros = new ArrayList<>();
    try {
      List<JSONObject> keycloakMembros = keycloakAdminService.buscarUsuariosDoGroup(organizacao.getUuid().toString());
      if (keycloakMembros != null) {
        for (JSONObject m : keycloakMembros) {
          OrganizacaoDetalhesDTO.MembroDTO membro = new OrganizacaoDetalhesDTO.MembroDTO();
          membro.setUuid(m.optString("id"));
          membro.setUsername(m.optString("username"));
          String firstName = m.optString("firstName", "");
          String lastName = m.optString("lastName", "");
          membro.setNome((firstName + " " + lastName).trim());
          membro.setEmail(m.optString("email"));
          membro.setAtivo(m.optBoolean("enabled", true));
          List<String> userRoles = keycloakAdminService.obterRolesDoUsuario(m.optString("id"));
          membro.setGestor(userRoles.contains(Role.GESTOR.getRoleName()));
          membros.add(membro);
        }
      }
    } catch (Exception e) {
      log.warn("Erro ao buscar membros do group no Keycloak: {}", e.getMessage());
    }
    dto.setMembros(membros);

    return dto;
  }

  private void validarDadosOrganizacao(OrganizacaoForm form, Organizacao organizacaoExistente) {
    Organizacao orgComMesmoNome = organizacaoRepository.findAll().stream()
        .filter(org -> org.getNome().equalsIgnoreCase(form.getNome()))
        .filter(org -> organizacaoExistente == null || !org.getId().equals(organizacaoExistente.getId()))
        .findFirst()
        .orElse(null);

    if (orgComMesmoNome != null) {
      throw new ArchException("Já existe uma organização com o nome: " + form.getNome());
    }

    String groupIdExistente = keycloakAdminService.buscarGroupPorNome(form.getNome());
    if (groupIdExistente != null) {
      if (organizacaoExistente == null || !groupIdExistente.equals(organizacaoExistente.getUuid().toString())) {
        throw new ArchException("Já existe uma organização com o nome no sistema: " + form.getNome());
      }
    }
  }

  public void adicionarGestor(String organizacaoId, String usuarioId) {
    Organizacao organizacao = buscarOrganizacao(organizacaoId);
    Usuario usuario = buscarUsuarioParaOrg(usuarioId);
    if (organizacao == null || usuario == null || usuario.getOrganizacao() == null
        || !usuario.getOrganizacao().getId().equals(organizacao.getId())) {
      throw new ArchException("Usuário não pertence a esta organização.");
    }
    keycloakAdminService.atribuirRoleGestor(usuario.getUuid().toString());
  }

  public void removerGestor(String organizacaoId, String usuarioId) {
    Organizacao organizacao = buscarOrganizacao(organizacaoId);
    Usuario usuario = buscarUsuarioParaOrg(usuarioId);
    if (organizacao == null || usuario == null || usuario.getOrganizacao() == null
        || !usuario.getOrganizacao().getId().equals(organizacao.getId())) {
      throw new ArchException("Usuário não pertence a esta organização.");
    }
    keycloakAdminService.removerRoleGestor(usuario.getUuid().toString());
  }

  private Usuario buscarUsuarioParaOrg(String usuarioId) {
    try {
      UUID uuid = UUID.fromString(usuarioId);
      Usuario usuario = usuarioRepository.findByUuid(uuid);
      if (usuario != null)
        return usuario;
    } catch (IllegalArgumentException e) {
      // ignore
    }
    try {
      return usuarioRepository.findById(Integer.parseInt(usuarioId)).orElse(null);
    } catch (NumberFormatException e) {
      return null;
    }
  }

}
