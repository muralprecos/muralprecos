package br.com.tt.painelpreco.domain.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.tt.painelpreco.api.dto.SincronizacaoResultadoDTO;
import br.com.tt.painelpreco.arch.infra.auth.Organizacao;
import br.com.tt.painelpreco.arch.infra.auth.Usuario;
import br.com.tt.painelpreco.domain.repository.OrganizacaoRepository;
import br.com.tt.painelpreco.domain.repository.UsuarioRepository;
import br.com.tt.painelpreco.security.keycloak.KeycloakAdminService;
import lombok.extern.slf4j.Slf4j;

/**
 * Serviço responsável por sincronizar usuários e organizações entre o Keycloak e o banco local.
 *
 * Regras:
 * - Registro no banco sem correspondente no Keycloak (por UUID) → desativar no banco.
 * - Registro desativado no banco mas presente no Keycloak → reativar.
 * - Registro no Keycloak sem correspondente no banco → criar no banco (detecta conflitos de login/email/nome).
 * - Todos os registros processados recebem data/detalhes/executorId da sincronização.
 */
@Slf4j
@Service
public class SincronizacaoService {



  @Autowired
  private UsuarioRepository usuarioRepository;

  @Autowired
  private OrganizacaoRepository organizacaoRepository;

  @Autowired
  private KeycloakAdminService keycloakAdminService;

  @Transactional
  public SincronizacaoResultadoDTO sincronizar(Integer executorId) {
    log.info("Iniciando sincronização Keycloak → Banco. Executor ID: {}", executorId);
    LocalDateTime agora = LocalDateTime.now();
    SincronizacaoResultadoDTO resultado = new SincronizacaoResultadoDTO();

    sincronizarOrganizacoes(executorId, agora, resultado);
    sincronizarUsuarios(executorId, agora, resultado);

    log.info("Sincronização concluída: {}", resultado);
    return resultado;
  }

  // -------------------------------------------------------------------------
  // Organizações
  // -------------------------------------------------------------------------

  private void sincronizarOrganizacoes(Integer executorId, LocalDateTime agora, SincronizacaoResultadoDTO resultado) {
    log.info("Sincronizando organizações...");

    List<JSONObject> keycloakGroups = keycloakAdminService.listarTodosGroups();
    Map<String, JSONObject> keycloakGroupsMap = new HashMap<>();
    for (JSONObject group : keycloakGroups) {
      keycloakGroupsMap.put(group.getString("id"), group);
    }

    List<Organizacao> dbOrgs = organizacaoRepository.findAll();
    Map<String, Organizacao> dbOrgsByUuid = new HashMap<>();
    for (Organizacao org : dbOrgs) {
      if (org.getUuid() != null) {
        dbOrgsByUuid.put(org.getUuid().toString(), org);
      }
    }

    // Processar organizações existentes no banco
    for (Organizacao org : dbOrgs) {
      if (org.getUuid() == null) continue;
      String uuidStr = org.getUuid().toString();

      if (!keycloakGroupsMap.containsKey(uuidStr)) {
        if (Boolean.TRUE.equals(org.getAtivo())) {
          org.setAtivo(false);
          org.setDetalhesUltimaSincronizacao(SituacaoSincronizacao.ORGANIZACAO_DESATIVADA.getDescricao());
          org.setDataUltimaSincronizacao(agora);
          org.setUsuarioSincronizacaoId(executorId);
          organizacaoRepository.save(org);
          resultado.incrementOrganizacoesDesativadas();
          resultado.addMensagem("Organização desativada: " + org.getNome());
        } else {
          org.setDetalhesUltimaSincronizacao(SituacaoSincronizacao.ORGANIZACAO_NAO_ENCONTRADA_NO_KEYCLOAK.getDescricao());
          org.setDataUltimaSincronizacao(agora);
          org.setUsuarioSincronizacaoId(executorId);
          organizacaoRepository.save(org);
          resultado.incrementOrganizacoesNaoAlteradas();
        }

      } else if (Boolean.FALSE.equals(org.getAtivo())) {
        org.setAtivo(true);
        org.setDetalhesUltimaSincronizacao(SituacaoSincronizacao.ORGANIZACAO_REATIVADA.getDescricao());
        org.setDataUltimaSincronizacao(agora);
        org.setUsuarioSincronizacaoId(executorId);
        organizacaoRepository.save(org);
        resultado.incrementOrganizacoesReativadas();
        resultado.addMensagem("Organização reativada: " + org.getNome());

      } else {
        org.setDetalhesUltimaSincronizacao(SituacaoSincronizacao.ORGANIZACAO_SINCRONIZADA.getDescricao());
        org.setDataUltimaSincronizacao(agora);
        org.setUsuarioSincronizacaoId(executorId);
        organizacaoRepository.save(org);
        resultado.incrementOrganizacoesNaoAlteradas();
      }
    }

    // Criar organizações que existem no Keycloak mas não no banco
    for (Map.Entry<String, JSONObject> entry : keycloakGroupsMap.entrySet()) {
      if (dbOrgsByUuid.containsKey(entry.getKey())) continue;

      JSONObject group = entry.getValue();
      String nome = group.optString("name", "");

      Organizacao conflito = organizacaoRepository.findByNome(nome);
      if (conflito != null) {
        conflito.setDetalhesUltimaSincronizacao(
            SituacaoSincronizacao.ORGANIZACAO_CONFLITO_NOME.formatar(nome, entry.getKey()));
        conflito.setDataUltimaSincronizacao(agora);
        conflito.setUsuarioSincronizacaoId(executorId);
        organizacaoRepository.save(conflito);
        resultado.incrementOrganizacoesComConflito();
        resultado.addMensagem("Conflito de nome em organização: " + nome);
        continue;
      }

      Organizacao novaOrg = new Organizacao();
      novaOrg.setUuid(UUID.fromString(entry.getKey()));
      novaOrg.setNome(nome);
      novaOrg.setAtivo(true);
      novaOrg.setDetalhesUltimaSincronizacao(SituacaoSincronizacao.ORGANIZACAO_CRIADA.getDescricao());
      novaOrg.setDataUltimaSincronizacao(agora);
      novaOrg.setUsuarioSincronizacaoId(executorId);
      organizacaoRepository.save(novaOrg);
      resultado.incrementOrganizacoesCriadas();
      resultado.addMensagem("Organização criada: " + nome);
    }
  }

  // -------------------------------------------------------------------------
  // Usuários
  // -------------------------------------------------------------------------

  private void sincronizarUsuarios(Integer executorId, LocalDateTime agora, SincronizacaoResultadoDTO resultado) {
    log.info("Sincronizando usuários...");

    List<JSONObject> keycloakUsers = keycloakAdminService.listarTodosUsuarios();
    Map<String, JSONObject> keycloakUsersMap = new HashMap<>();
    for (JSONObject user : keycloakUsers) {
      keycloakUsersMap.put(user.getString("id"), user);
    }

    List<Usuario> dbUsers = usuarioRepository.findAll();
    Map<String, Usuario> dbUsersByUuid = new HashMap<>();
    for (Usuario user : dbUsers) {
      if (user.getUuid() != null) {
        dbUsersByUuid.put(user.getUuid().toString(), user);
      }
    }

    // Processar usuários existentes no banco
    for (Usuario user : dbUsers) {
      if (user.getUuid() == null) continue;
      String uuidStr = user.getUuid().toString();

      if (!keycloakUsersMap.containsKey(uuidStr)) {
        if (Boolean.TRUE.equals(user.getAtivo())) {
          user.setAtivo(false);
          user.setDetalhesUltimaSincronizacao(SituacaoSincronizacao.USUARIO_DESATIVADO.getDescricao());
          user.setDataUltimaSincronizacao(agora);
          user.setUsuarioSincronizacaoId(executorId);
          usuarioRepository.save(user);
          resultado.incrementUsuariosDesativados();
          resultado.addMensagem("Usuário desativado: " + user.getLogin());
        } else {
          user.setDetalhesUltimaSincronizacao(SituacaoSincronizacao.USUARIO_NAO_ENCONTRADO_NO_KEYCLOAK.getDescricao());
          user.setDataUltimaSincronizacao(agora);
          user.setUsuarioSincronizacaoId(executorId);
          usuarioRepository.save(user);
          resultado.incrementUsuariosNaoAlterados();
        }

      } else if (Boolean.FALSE.equals(user.getAtivo())) {
        user.setAtivo(true);
        user.setDetalhesUltimaSincronizacao(SituacaoSincronizacao.USUARIO_REATIVADO.getDescricao());
        user.setDataUltimaSincronizacao(agora);
        user.setUsuarioSincronizacaoId(executorId);
        usuarioRepository.save(user);
        resultado.incrementUsuariosReativados();
        resultado.addMensagem("Usuário reativado: " + user.getLogin());

      } else {
        user.setDetalhesUltimaSincronizacao(SituacaoSincronizacao.USUARIO_SINCRONIZADO.getDescricao());
        user.setDataUltimaSincronizacao(agora);
        user.setUsuarioSincronizacaoId(executorId);
        usuarioRepository.save(user);
        resultado.incrementUsuariosNaoAlterados();
      }
    }

    // Criar usuários que existem no Keycloak mas não no banco
    for (Map.Entry<String, JSONObject> entry : keycloakUsersMap.entrySet()) {
      if (dbUsersByUuid.containsKey(entry.getKey())) continue;

      JSONObject kcUser = entry.getValue();
      String username = kcUser.optString("username", "");
      String email = kcUser.optString("email", "");
      String firstName = kcUser.optString("firstName", "");
      String lastName = kcUser.optString("lastName", "");
      String nome = (firstName + " " + lastName).trim();

      // Verificar conflito de login
      if (!username.isEmpty()) {
        Usuario conflito = usuarioRepository.findByLogin(username);
        if (conflito != null) {
          conflito.setDetalhesUltimaSincronizacao(
              SituacaoSincronizacao.USUARIO_CONFLITO_LOGIN.formatar(username, entry.getKey()));
          conflito.setDataUltimaSincronizacao(agora);
          conflito.setUsuarioSincronizacaoId(executorId);
          usuarioRepository.save(conflito);
          resultado.incrementUsuariosComConflito();
          resultado.addMensagem("Conflito de login em usuário: " + username);
          continue;
        }
      }

      // Verificar conflito de email
      if (!email.isEmpty()) {
        Usuario conflito = usuarioRepository.findByEmail(email);
        if (conflito != null) {
          conflito.setDetalhesUltimaSincronizacao(
              SituacaoSincronizacao.USUARIO_CONFLITO_EMAIL.formatar(email, entry.getKey()));
          conflito.setDataUltimaSincronizacao(agora);
          conflito.setUsuarioSincronizacaoId(executorId);
          usuarioRepository.save(conflito);
          resultado.incrementUsuariosComConflito();
          resultado.addMensagem("Conflito de email em usuário: " + email);
          continue;
        }
      }

      // Tentar vincular organização pelo grupo Keycloak do usuário
      Organizacao organizacao = resolverOrganizacao(entry.getKey());

      Usuario novoUsuario = new Usuario();
      novoUsuario.setUuid(UUID.fromString(entry.getKey()));
      novoUsuario.setLogin(username.isEmpty() ? null : username);
      novoUsuario.setNome(nome.isEmpty() ? username : nome);
      novoUsuario.setEmail(email.isEmpty() ? null : email);
      novoUsuario.setAtivo(true);
      novoUsuario.setOrganizacao(organizacao);
      novoUsuario.setDetalhesUltimaSincronizacao(SituacaoSincronizacao.USUARIO_CRIADO.getDescricao());
      novoUsuario.setDataUltimaSincronizacao(agora);
      novoUsuario.setUsuarioSincronizacaoId(executorId);
      usuarioRepository.save(novoUsuario);
      resultado.incrementUsuariosCriados();
      resultado.addMensagem("Usuário criado: " + username);
    }
  }

  private Organizacao resolverOrganizacao(String keycloakUserId) {
    try {
      List<JSONObject> userGroups = keycloakAdminService.buscarGroupsDoUsuario(keycloakUserId);
      for (JSONObject group : userGroups) {
        String groupId = group.optString("id", "");
        if (!groupId.isEmpty()) {
          Organizacao org = organizacaoRepository.findByUuid(UUID.fromString(groupId));
          if (org != null) {
            return org;
          }
        }
      }
    } catch (Exception e) {
      log.warn("Não foi possível resolver organização do usuário Keycloak {}: {}", keycloakUserId, e.getMessage());
    }
    return null;
  }

}
