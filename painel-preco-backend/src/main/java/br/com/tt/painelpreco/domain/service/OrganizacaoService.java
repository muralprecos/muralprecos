package br.com.tt.painelpreco.domain.service;

import java.util.List;
import java.util.UUID;

import javax.transaction.Transactional;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import br.com.tt.painelpreco.api.dto.form.OrganizacaoForm;
import br.com.tt.painelpreco.arch.exception.ArchException;
import br.com.tt.painelpreco.arch.infra.auth.Organizacao;
import br.com.tt.painelpreco.domain.repository.OrganizacaoRepository;
import br.com.tt.painelpreco.domain.repository.UsuarioRepository;
import br.com.tt.painelpreco.security.keycloak.KeycloakAdminService;
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
      // Não é um UUID válido, tenta como ID sequencial
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
      keycloakGroupId = keycloakAdminService.criarGroup(form.getNome());
      log.info("Group criado no Keycloak com ID: {}", keycloakGroupId);
    } catch (Exception e) {
      log.error("Erro ao criar group no Keycloak: {}", e.getMessage());
      throw new ArchException("Falha ao criar organização no Keycloak: " + e.getMessage(), e);
    }

    // Persistir no banco local
    Organizacao organizacao = new Organizacao();
    organizacao.setUuid(UUID.fromString(keycloakGroupId));
    organizacao.setNome(form.getNome());
    organizacao.setCnpj(form.getCnpj());
    organizacao.setNumero(form.getNumero());
    organizacao.setAtivo(true);

    try {
      organizacao = organizacaoRepository.save(organizacao);
      log.info("Organização criada no banco de dados com ID: {}", organizacao.getId());
      return organizacao;
    } catch (Exception e) {
      log.error("Erro ao salvar organização no banco de dados: {}", e.getMessage());
      // Tentar deletar o group no Keycloak para manter consistência
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

    // Atualizar group no Keycloak
    try {
      String groupId = organizacao.getUuid().toString();
      keycloakAdminService.atualizarGroup(groupId, form.getNome());
      log.info("Group atualizado no Keycloak: {}", groupId);
    } catch (Exception e) {
      log.error("Erro ao atualizar group no Keycloak: {}", e.getMessage());
      throw new ArchException("Falha ao atualizar organização no Keycloak: " + e.getMessage(), e);
    }

    // Atualizar no banco local
    organizacao.setNome(form.getNome());
    organizacao.setCnpj(form.getCnpj());
    organizacao.setNumero(form.getNumero());

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
  public void deletarOrganizacao(String organizacaoId) {
    log.info("Iniciando deleção de organização: {}", organizacaoId);

    Organizacao organizacao = buscarOrganizacao(organizacaoId);
    if (organizacao == null) {
      throw new ArchException("Organização não encontrada com identificador: " + organizacaoId);
    }

    validarPodeDeletar(organizacao);

    // Deletar group no Keycloak
    try {
      String groupId = organizacao.getUuid().toString();
      keycloakAdminService.deletarGroup(groupId);
      log.info("Group deletado no Keycloak: {}", groupId);
    } catch (Exception e) {
      log.error("Erro ao deletar group no Keycloak: {}", e.getMessage());
      throw new ArchException("Falha ao deletar organização no Keycloak: " + e.getMessage(), e);
    }

    // Deletar no banco local (hard delete)
    try {
      organizacaoRepository.delete(organizacao);
      log.info("Organização deletada do banco de dados com ID: {}", organizacao.getId());
    } catch (Exception e) {
      log.error("Erro ao deletar organização do banco de dados: {}", e.getMessage());
      throw new ArchException("Falha ao deletar organização do banco de dados: " + e.getMessage(), e);
    }
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
      // Se estiver atualizando, verificar se é o mesmo group
      if (organizacaoExistente == null || !groupIdExistente.equals(organizacaoExistente.getUuid().toString())) {
        throw new ArchException("Já existe uma organização com o nome no sistema: " + form.getNome());
      }
    }

    // ToDo: Validações adicionais de CNPJ podem ser adicionadas aqui
  }

  private void validarPodeDeletar(Organizacao organizacao) {
    long countUsuarios = usuarioRepository.countByOrganizacao(organizacao);
    if (countUsuarios > 0) {
      throw new ArchException(
          "Não é possível deletar a organização. Existem " + countUsuarios + " usuário(s) associado(s).");
    }

    try {
      List<JSONObject> usuarios = keycloakAdminService.buscarUsuariosDoGroup(organizacao.getUuid().toString());
      if (usuarios != null && !usuarios.isEmpty()) {
        throw new ArchException(
            "Não é possível deletar a organização. Existem " + usuarios.size()
                + " usuário(s) no Keycloak associado(s).");
      }
    } catch (Exception e) {
      log.warn("Erro ao verificar usuários do group no Keycloak: {}", e.getMessage());
    }
  }

}
