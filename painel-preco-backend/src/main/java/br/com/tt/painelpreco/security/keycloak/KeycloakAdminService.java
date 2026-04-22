package br.com.tt.painelpreco.security.keycloak;

import java.util.List;

import javax.annotation.PostConstruct;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import br.com.tt.painelpreco.arch.api.controller.HttpClientController;
import br.com.tt.painelpreco.arch.exception.ArchException;
import br.com.tt.painelpreco.arch.view.http.Body;
import br.com.tt.painelpreco.arch.view.http.ContentType;
import br.com.tt.painelpreco.arch.view.http.GrantType;
import br.com.tt.painelpreco.arch.view.http.Header;
import br.com.tt.painelpreco.arch.view.http.HttpResponse;
import br.com.tt.painelpreco.arch.view.http.QueryParam;
import br.com.tt.painelpreco.arch.view.http.exception.HttpException;
import br.com.tt.painelpreco.config.KeycloakProperties;
import lombok.extern.slf4j.Slf4j;

/**
 * Serviço para comunicação com Keycloak Admin API.
 * Responsável por criar e gerenciar usuários e groups (organizações) no
 * Keycloak.
 */
@Slf4j
@Service
public class KeycloakAdminService extends HttpClientController {

  private static final String ADMIN_TOKEN_URL = "%s/realms/master/protocol/openid-connect/token";
  private static final String ADMIN_USERS_URL = "%s/admin/realms/%s/users";
  private static final String ADMIN_GROUPS_URL = "%s/admin/realms/%s/groups";

  @Autowired
  private KeycloakProperties keycloakProperties;

  @Value("${keycloak-admin.username}")
  private String adminUsername;

  @Value("${keycloak-admin.password}")
  private String adminPassword;

  @Value("${keycloak-admin.client-id}")
  private String adminClientId;

  private String tokenUrl;
  private String usersUrl;
  private String groupsUrl;
  private String accessToken;
  private long tokenExpirationTime;

  @PostConstruct
  public void init() {
    this.tokenUrl = String.format(ADMIN_TOKEN_URL, keycloakProperties.getAuthServerUrl());
    this.usersUrl = String.format(ADMIN_USERS_URL, keycloakProperties.getAuthServerUrl(), keycloakProperties.getRealm());
    this.groupsUrl = String.format(ADMIN_GROUPS_URL, keycloakProperties.getAuthServerUrl(), keycloakProperties.getRealm());
  }

  public String obterAccessTokenAdmin() {
    // Verifica se o token ainda é válido (com margem de 30 segundos)
    if (accessToken != null && System.currentTimeMillis() < tokenExpirationTime - 30000) {
      return accessToken;
    }

    log.debug("Obtendo novo token admin do Keycloak");

    try {
      Header header = new Header();
      header.setContentType(ContentType.APPLICATION_FORM_URLENCODED);

      Body body = new Body();
      body.add("grant_type", GrantType.PASSWORD.getName())
          .add("client_id", adminClientId)
          .add("username", adminUsername)
          .add("password", adminPassword);

      HttpResponse response = super.requestPost(header, body, QueryParam.NONE, tokenUrl);

      accessToken = response.getAccessToken();
      Integer expiresIn = response.getProperty("expires_in");

      // Calcula quando o token expira (em milissegundos)
      tokenExpirationTime = System.currentTimeMillis() + (expiresIn * 1000L);

      log.debug("Token admin obtido com sucesso. Expira em {} segundos", expiresIn);

      return accessToken;

    } catch (HttpException e) {
      log.error("Erro ao obter token admin do Keycloak: {}", e.getMessage());
      throw new ArchException("Falha ao autenticar no Keycloak Admin API: " + e.getMessage(), e);
    }
  }

  public String criarUsuario(String username, String email, String firstName, String lastName,
      String password, boolean enabled, boolean emailVerified) {

    log.info("Criando usuário no Keycloak: {}", username);

    try {
      String token = obterAccessTokenAdmin();

      Header header = new Header();
      header.setContentType(ContentType.APPLICATION_JSON);
      header.add("Authorization", "Bearer " + token);

      JSONObject userJson = new JSONObject();
      userJson.put("username", username);
      userJson.put("email", email);
      userJson.put("firstName", firstName);
      userJson.put("lastName", lastName);
      userJson.put("enabled", enabled);
      userJson.put("emailVerified", emailVerified);
      userJson.put("credentials", new JSONArray()
          .put(new JSONObject()
              .put("type", "password")
              .put("value", password)
              .put("temporary", false)));

      Body body = new Body(userJson);

      super.requestPost(header, body, QueryParam.NONE, usersUrl);

      String userId = null;
      int tentativas = 0;
      int maxTentativas = 5;

      while (userId == null && tentativas < maxTentativas) {
        try {
          Thread.sleep(200 * (tentativas + 1));
          userId = buscarUsuarioPorUsername(username);
          tentativas++;
        } catch (InterruptedException e) {
          Thread.currentThread().interrupt();
          throw new ArchException("Interrompido ao aguardar criação do usuário no Keycloak", e);
        }
      }

      if (userId == null) {
        throw new ArchException(
            "Usuário criado no Keycloak mas não foi possível obter o ID após " + maxTentativas + " tentativas");
      }

      log.info("Usuário criado no Keycloak com sucesso. ID: {}", userId);

      return userId;

    } catch (HttpException e) {
      log.error("Erro ao criar usuário no Keycloak. Status: {}, Mensagem: {}", e.getStatusCode(), e.getMessage());

      if (e.getStatusCode() == 409) {
        String mensagemErro = extrairMensagemErroKeycloak(e.getMessage());
        if (mensagemErro.contains("username")) {
          throw new ArchException("Username já cadastrado no sistema: " + username);
        } else if (mensagemErro.contains("email")) {
          throw new ArchException("Email já cadastrado no sistema: " + email);
        } else {
          throw new ArchException("Usuário já existe no sistema: " + mensagemErro);
        }
      }

      throw new ArchException("Falha ao criar usuário no Keycloak: " + e.getMessage(), e);
    }
  }

  public String buscarUsuarioPorUsername(String username) {
    log.debug("Buscando usuário no Keycloak por username: {}", username);

    try {
      String token = obterAccessTokenAdmin();

      Header header = new Header();
      header.setContentType(ContentType.APPLICATION_JSON);
      header.add("Authorization", "Bearer " + token);

      QueryParam queryParam = new QueryParam();
      queryParam.add("username", username);
      queryParam.add("exact", "true");

      String responseRaw = obterRespostaRawGet(header, queryParam, usersUrl);

      if (responseRaw == null || responseRaw.trim().isEmpty()) {
        log.debug("Resposta vazia do Keycloak");
        return null;
      }

      JSONArray usersArray = new JSONArray(responseRaw);

      if (usersArray.length() > 0) {
        JSONObject user = usersArray.getJSONObject(0);
        String userId = user.getString("id");
        log.debug("Usuário encontrado. ID: {}", userId);
        return userId;
      }

      log.debug("Usuário não encontrado (array vazio)");
      return null;

    } catch (org.json.JSONException e) {
      log.debug("Erro ao parsear resposta como JSONArray: {}", e.getMessage());
      return null;
    } catch (HttpException e) {
      if (e.getStatusCode() == 404) {
        return null;
      }
      log.error("Erro ao buscar usuário no Keycloak: {}", e.getMessage());
      throw new ArchException("Falha ao buscar usuário no Keycloak: " + e.getMessage(), e);
    } catch (Exception e) {
      log.error("Erro ao processar resposta do Keycloak: {}", e.getMessage());
      return null;
    }
  }

  private String obterRespostaRawGet(Header header, QueryParam queryParam, String url) {
    try {
      // Monta a requisição manualmente para obter a resposta raw
      org.apache.http.client.methods.HttpGet httpGet = new org.apache.http.client.methods.HttpGet();

      // Adiciona headers
      if (header != null) {
        header.map().forEach((key, value) -> httpGet.addHeader(key, value.toString()));
      }

      // Adiciona query parameters
      if (queryParam != null && !queryParam.map().isEmpty()) {
        java.net.URI uri = new java.net.URI(url);
        org.apache.http.client.utils.URIBuilder uriBuilder = new org.apache.http.client.utils.URIBuilder(uri);
        queryParam.map().forEach((key, value) -> {
          if (value != null) {
            uriBuilder.addParameter(key, value.toString());
          }
        });
        httpGet.setURI(uriBuilder.build());
      } else {
        httpGet.setURI(new java.net.URI(url));
      }

      // Executa a requisição
      org.apache.http.impl.client.CloseableHttpClient httpClient = getHttpClientRaw();
      org.apache.http.client.methods.CloseableHttpResponse response = httpClient.execute(httpGet);

      try {
        // Verifica status code
        int statusCode = response.getStatusLine().getStatusCode();
        if (statusCode < 200 || statusCode >= 300) {
          String errorBody = org.apache.http.util.EntityUtils.toString(response.getEntity(),
              java.nio.charset.StandardCharsets.UTF_8);
          throw new HttpException(statusCode, "Status code: " + statusCode + "; response: " + errorBody);
        }

        // Obtém o body como string
        if (response.getEntity() != null) {
          String responseStr = br.com.tt.painelpreco.util.IOUtil.toString(response.getEntity().getContent());
          return responseStr;
        }

        return null;
      } finally {
        response.close();
      }

    } catch (Exception e) {
      log.error("Erro ao obter resposta raw: {}", e.getMessage());
      throw new ArchException("Falha ao obter resposta raw: " + e.getMessage(), e);
    }
  }

  private org.apache.http.impl.client.CloseableHttpClient getHttpClientRaw() {
    try {
      org.apache.http.client.config.RequestConfig requestConfig = org.apache.http.client.config.RequestConfig.custom()
          .setContentCompressionEnabled(true)
          .setExpectContinueEnabled(true)
          .build();

      return org.apache.http.impl.client.HttpClientBuilder.create()
          .setDefaultRequestConfig(requestConfig)
          .setSSLSocketFactory(new org.apache.http.conn.ssl.SSLConnectionSocketFactory(
              org.apache.http.ssl.SSLContexts.custom()
                  .loadTrustMaterial(null, new org.apache.http.conn.ssl.TrustSelfSignedStrategy())
                  .build()))
          .build();
    } catch (Exception e) {
      log.error("Erro ao criar HttpClient: {}", e.getMessage());
      throw new ArchException("Falha ao criar HttpClient", e);
    }
  }

  public void adicionarUsuarioAoGroup(String userId, String groupId) {
    log.info("Adicionando usuário {} ao group {}", userId, groupId);

    try {
      String token = obterAccessTokenAdmin();

      Header header = new Header();
      header.setContentType(ContentType.APPLICATION_JSON);
      header.add("Authorization", "Bearer " + token);

      String url = usersUrl + "/" + userId + "/groups/" + groupId;

      super.requestPut(header, Body.DEFAULT, QueryParam.NONE, url);

      log.info("Usuário adicionado ao group com sucesso");

    } catch (HttpException e) {
      log.error("Erro ao adicionar usuário ao group no Keycloak: {}", e.getMessage());
      throw new ArchException("Falha ao adicionar usuário ao group no Keycloak: " + e.getMessage(), e);
    }
  }

  public String criarGroup(String nome, String cnpj, String telefone) {
    log.info("Criando group no Keycloak: {}", nome);

    try {
      String token = obterAccessTokenAdmin();

      Header header = new Header();
      header.setContentType(ContentType.APPLICATION_JSON);
      header.add("Authorization", "Bearer " + token);

      JSONObject groupJson = new JSONObject();
      groupJson.put("name", nome);
      groupJson.put("attributes", construirAtributosOrganizacao(nome, cnpj, telefone));

      Body body = new Body(groupJson);

      super.requestPost(header, body, QueryParam.NONE, groupsUrl);

      String groupId = buscarGroupPorNome(nome);

      log.info("Group criado no Keycloak com sucesso. ID: {}", groupId);

      return groupId;

    } catch (HttpException e) {
      log.error("Erro ao criar group no Keycloak: {}", e.getMessage());
      throw new ArchException("Falha ao criar group no Keycloak: " + e.getMessage(), e);
    }
  }

  public String buscarGroupPorNome(String name) {
    log.debug("Buscando group no Keycloak por nome: {}", name);

    try {
      String token = obterAccessTokenAdmin();

      Header header = new Header();
      header.setContentType(ContentType.APPLICATION_JSON);
      header.add("Authorization", "Bearer " + token);

      QueryParam queryParam = new QueryParam();
      queryParam.add("search", name);

      String responseRaw = obterRespostaRawGet(header, queryParam, groupsUrl);

      if (responseRaw == null || responseRaw.trim().isEmpty()) {
        log.debug("Resposta vazia do Keycloak");
        return null;
      }

      JSONArray groupsArray = new JSONArray(responseRaw);

      // Busca exata pelo nome
      for (int i = 0; i < groupsArray.length(); i++) {
        JSONObject group = groupsArray.getJSONObject(i);
        if (name.equals(group.getString("name"))) {
          String groupId = group.getString("id");
          log.debug("Group encontrado. ID: {}", groupId);
          return groupId;
        }
      }

      log.debug("Group não encontrado");
      return null;

    } catch (org.json.JSONException e) {
      log.debug("Erro ao parsear resposta como JSONArray: {}", e.getMessage());
      return null;
    } catch (HttpException e) {
      if (e.getStatusCode() == 404) {
        return null;
      }
      log.error("Erro ao buscar group no Keycloak: {}", e.getMessage());
      throw new ArchException("Falha ao buscar group no Keycloak: " + e.getMessage(), e);
    } catch (Exception e) {
      log.error("Erro ao processar resposta do Keycloak: {}", e.getMessage());
      return null;
    }
  }

  public JSONObject buscarGroupPorId(String groupId) {
    log.debug("Buscando group no Keycloak por ID: {}", groupId);

    try {
      String token = obterAccessTokenAdmin();

      Header header = new Header();
      header.setContentType(ContentType.APPLICATION_JSON);
      header.add("Authorization", "Bearer " + token);

      String url = groupsUrl + "/" + groupId;

      HttpResponse response = super.requestGet(header, Body.DEFAULT, QueryParam.NONE, url);

      JSONObject group = response.getResponse();
      log.debug("Group encontrado: {}", group.getString("name"));
      return group;

    } catch (HttpException e) {
      if (e.getStatusCode() == 404) {
        return null;
      }
      log.error("Erro ao buscar group no Keycloak: {}", e.getMessage());
      throw new ArchException("Falha ao buscar group no Keycloak: " + e.getMessage(), e);
    }
  }

  public List<JSONObject> listarGroups() {
    log.debug("Listando groups do Keycloak");

    try {
      String token = obterAccessTokenAdmin();

      Header header = new Header();
      header.setContentType(ContentType.APPLICATION_JSON);
      header.add("Authorization", "Bearer " + token);

      HttpResponse response = super.requestGet(header, Body.DEFAULT, QueryParam.NONE, groupsUrl);

      String responseStr = response.getResponse().toString();
      JSONArray groupsArray = new JSONArray(responseStr);

      log.debug("Encontrados {} groups", groupsArray.length());

      java.util.List<JSONObject> groups = new java.util.ArrayList<>();
      for (int i = 0; i < groupsArray.length(); i++) {
        groups.add(groupsArray.getJSONObject(i));
      }

      return groups;

    } catch (HttpException e) {
      log.error("Erro ao listar groups no Keycloak: {}", e.getMessage());
      throw new ArchException("Falha ao listar groups no Keycloak: " + e.getMessage(), e);
    }
  }

  public void atualizarGroup(String groupId, String nome, String cnpj, String telefone) {
    log.info("Atualizando group {} no Keycloak", groupId);

    try {
      String token = obterAccessTokenAdmin();

      Header header = new Header();
      header.setContentType(ContentType.APPLICATION_JSON);
      header.add("Authorization", "Bearer " + token);

      JSONObject groupJson = new JSONObject();
      groupJson.put("name", nome);
      groupJson.put("attributes", construirAtributosOrganizacao(nome, cnpj, telefone));

      Body body = new Body(groupJson);

      String url = groupsUrl + "/" + groupId;

      super.requestPut(header, body, QueryParam.NONE, url);

      log.info("Group atualizado com sucesso");

    } catch (HttpException e) {
      log.error("Erro ao atualizar group no Keycloak: {}", e.getMessage());
      throw new ArchException("Falha ao atualizar group no Keycloak: " + e.getMessage(), e);
    }
  }

  private JSONObject construirAtributosOrganizacao(String nome, String cnpj, String telefone) {
    JSONObject attributes = new JSONObject();
    if (nome != null) {
      attributes.put(OrganizacaoKeycloakAttributes.NOME, new JSONArray().put(nome));
    }
    if (cnpj != null && !cnpj.trim().isEmpty()) {
      attributes.put(OrganizacaoKeycloakAttributes.CNPJ, new JSONArray().put(cnpj));
    }
    if (telefone != null && !telefone.trim().isEmpty()) {
      attributes.put(OrganizacaoKeycloakAttributes.TELEFONE, new JSONArray().put(telefone));
    }
    return attributes;
  }

  public boolean emailExiste(String email) {
    log.debug("Verificando se email existe no Keycloak: {}", email);

    try {
      String token = obterAccessTokenAdmin();

      Header header = new Header();
      header.setContentType(ContentType.APPLICATION_JSON);
      header.add("Authorization", "Bearer " + token);

      QueryParam queryParam = new QueryParam();
      queryParam.add("email", email);
      queryParam.add("exact", "true");

      String responseRaw = obterRespostaRawGet(header, queryParam, usersUrl);

      if (responseRaw == null || responseRaw.trim().isEmpty()) {
        log.debug("Resposta vazia do Keycloak");
        return false;
      }

      JSONArray usersArray = new JSONArray(responseRaw);

      boolean existe = usersArray.length() > 0;
      log.debug("Email {} existe: {}", email, existe);
      return existe;

    } catch (org.json.JSONException e) {
      log.debug("Erro ao parsear resposta como JSONArray: {}", e.getMessage());
      return false;
    } catch (HttpException e) {
      if (e.getStatusCode() == 404) {
        return false;
      }
      log.error("Erro ao verificar email no Keycloak: {}", e.getMessage());
      throw new ArchException("Falha ao verificar email no Keycloak: " + e.getMessage(), e);
    } catch (Exception e) {
      log.error("Erro ao processar resposta do Keycloak: {}", e.getMessage());
      return false;
    }
  }

  private String extrairMensagemErroKeycloak(String mensagemErro) {
    try {
      int inicioJson = mensagemErro.indexOf("{");
      int fimJson = mensagemErro.lastIndexOf("}");

      if (inicioJson >= 0 && fimJson > inicioJson) {
        String jsonStr = mensagemErro.substring(inicioJson, fimJson + 1);
        JSONObject jsonErro = new JSONObject(jsonStr);

        if (jsonErro.has("errorMessage")) {
          return jsonErro.getString("errorMessage");
        }
        if (jsonErro.has("error")) {
          return jsonErro.getString("error");
        }
      }
    } catch (Exception e) {
      log.debug("Não foi possível extrair mensagem de erro do Keycloak: {}", e.getMessage());
    }

    return mensagemErro;
  }

  public boolean usernameExiste(String username) {
    return buscarUsuarioPorUsername(username) != null;
  }

  public void desativarUsuario(String userId) {
    log.info("Desativando usuário {} no Keycloak", userId);
    atualizarUsuario(userId, null, null, null, false);
  }

  public void ativarUsuario(String userId) {
    log.info("Ativando usuário {} no Keycloak", userId);
    atualizarUsuario(userId, null, null, null, true);
  }

  public void deletarGroup(String groupId) {
    log.info("Deletando group {} no Keycloak", groupId);

    try {
      String token = obterAccessTokenAdmin();

      Header header = new Header();
      header.setContentType(ContentType.APPLICATION_JSON);
      header.add("Authorization", "Bearer " + token);

      String url = groupsUrl + "/" + groupId;

      super.requestDelete(header, Body.DEFAULT, QueryParam.NONE, url);

      log.info("Group deletado com sucesso");

    } catch (HttpException e) {
      log.error("Erro ao deletar group no Keycloak: {}", e.getMessage());
      throw new ArchException("Falha ao deletar group no Keycloak: " + e.getMessage(), e);
    }
  }

  public List<JSONObject> buscarUsuariosDoGroup(String groupId) {
    log.debug("Buscando usuários do group {} no Keycloak", groupId);

    try {
      String token = obterAccessTokenAdmin();

      Header header = new Header();
      header.setContentType(ContentType.APPLICATION_JSON);
      header.add("Authorization", "Bearer " + token);

      String url = groupsUrl + "/" + groupId + "/members";

      String responseStr = obterRespostaRawGet(header, QueryParam.NONE, url);

      if (responseStr == null || responseStr.trim().isEmpty()) {
        return new java.util.ArrayList<>();
      }

      JSONArray usersArray = new JSONArray(responseStr);

      log.debug("Encontrados {} usuários no group", usersArray.length());

      java.util.List<JSONObject> users = new java.util.ArrayList<>();
      for (int i = 0; i < usersArray.length(); i++) {
        users.add(usersArray.getJSONObject(i));
      }

      return users;

    } catch (HttpException e) {
      if (e.getStatusCode() == 404) {
        log.debug("Group não encontrado ou sem usuários");
        return new java.util.ArrayList<>();
      }
      log.error("Erro ao buscar usuários do group no Keycloak: {}", e.getMessage());
      throw new ArchException("Falha ao buscar usuários do group no Keycloak: " + e.getMessage(), e);
    }
  }

  public JSONObject buscarUsuarioPorId(String userId) {
    log.debug("Buscando usuário no Keycloak por ID: {}", userId);

    try {
      String token = obterAccessTokenAdmin();

      Header header = new Header();
      header.setContentType(ContentType.APPLICATION_JSON);
      header.add("Authorization", "Bearer " + token);

      String url = usersUrl + "/" + userId;

      HttpResponse response = super.requestGet(header, Body.DEFAULT, QueryParam.NONE, url);

      JSONObject user = response.getResponse();
      log.debug("Usuário encontrado: {}", user.getString("username"));
      return user;

    } catch (HttpException e) {
      if (e.getStatusCode() == 404) {
        return null;
      }
      log.error("Erro ao buscar usuário no Keycloak: {}", e.getMessage());
      throw new ArchException("Falha ao buscar usuário no Keycloak: " + e.getMessage(), e);
    }
  }

  public void atualizarUsuario(String userId, String email, String firstName, String lastName,
      Boolean enabled) {
    log.info("Atualizando usuário {} no Keycloak", userId);

    try {
      String token = obterAccessTokenAdmin();

      Header header = new Header();
      header.setContentType(ContentType.APPLICATION_JSON);
      header.add("Authorization", "Bearer " + token);

      JSONObject userJson = new JSONObject();
      if (email != null) {
        userJson.put("email", email);
      }
      if (firstName != null) {
        userJson.put("firstName", firstName);
      }
      if (lastName != null) {
        userJson.put("lastName", lastName);
      }
      if (enabled != null) {
        userJson.put("enabled", enabled);
      }

      Body body = new Body(userJson);

      String url = usersUrl + "/" + userId;

      super.requestPut(header, body, QueryParam.NONE, url);

      log.info("Usuário atualizado com sucesso");

    } catch (HttpException e) {
      log.error("Erro ao atualizar usuário no Keycloak. Status: {}, Mensagem: {}", e.getStatusCode(),
          e.getMessage());

      if (e.getStatusCode() == 409) {
        String mensagemErro = extrairMensagemErroKeycloak(e.getMessage());
        if (mensagemErro.contains("email")) {
          throw new ArchException("Email já cadastrado no sistema: " + email);
        } else {
          throw new ArchException("Erro ao atualizar usuário: " + mensagemErro);
        }
      }

      throw new ArchException("Falha ao atualizar usuário no Keycloak: " + e.getMessage(), e);
    }
  }

  public void deletarUsuario(String userId) {
    log.info("Deletando usuário {} no Keycloak", userId);

    try {
      String token = obterAccessTokenAdmin();

      Header header = new Header();
      header.setContentType(ContentType.APPLICATION_JSON);
      header.add("Authorization", "Bearer " + token);

      String url = usersUrl + "/" + userId;

      super.requestDelete(header, Body.DEFAULT, QueryParam.NONE, url);

      log.info("Usuário deletado com sucesso");

    } catch (HttpException e) {
      log.error("Erro ao deletar usuário no Keycloak: {}", e.getMessage());
      throw new ArchException("Falha ao deletar usuário no Keycloak: " + e.getMessage(), e);
    }
  }

  public void removerUsuarioDoGroup(String userId, String groupId) {
    log.info("Removendo usuário {} do group {}", userId, groupId);

    try {
      String token = obterAccessTokenAdmin();

      Header header = new Header();
      header.setContentType(ContentType.APPLICATION_JSON);
      header.add("Authorization", "Bearer " + token);

      String url = usersUrl + "/" + userId + "/groups/" + groupId;

      super.requestDelete(header, Body.DEFAULT, QueryParam.NONE, url);

      log.info("Usuário removido do group com sucesso");

    } catch (HttpException e) {
      log.error("Erro ao remover usuário do group no Keycloak: {}", e.getMessage());
      throw new ArchException("Falha ao remover usuário do group no Keycloak: " + e.getMessage(), e);
    }
  }

  public void atualizarSenhaUsuario(String userId, String novaSenha) {
    log.info("Atualizando senha do usuário {} no Keycloak", userId);

    try {
      String token = obterAccessTokenAdmin();

      Header header = new Header();
      header.setContentType(ContentType.APPLICATION_JSON);
      header.add("Authorization", "Bearer " + token);

      JSONObject credentialsJson = new JSONObject();
      credentialsJson.put("type", "password");
      credentialsJson.put("value", novaSenha);
      credentialsJson.put("temporary", false);

      JSONArray credentialsArray = new JSONArray();
      credentialsArray.put(credentialsJson);

      JSONObject userJson = new JSONObject();
      userJson.put("credentials", credentialsArray);

      Body body = new Body(userJson);

      String url = usersUrl + "/" + userId + "/reset-password";

      super.requestPut(header, body, QueryParam.NONE, url);

      log.info("Senha do usuário atualizada com sucesso");

    } catch (HttpException e) {
      log.error("Erro ao atualizar senha do usuário no Keycloak: {}", e.getMessage());
      throw new ArchException("Falha ao atualizar senha do usuário no Keycloak: " + e.getMessage(), e);
    }
  }

  public List<JSONObject> listarUsuarios(Integer first, Integer max) {
    log.debug("Listando usuários do Keycloak - first: {}, max: {}", first, max);

    try {
      String token = obterAccessTokenAdmin();

      Header header = new Header();
      header.setContentType(ContentType.APPLICATION_JSON);
      header.add("Authorization", "Bearer " + token);

      QueryParam queryParam = new QueryParam();
      if (first != null) {
        queryParam.add("first", first.toString());
      }
      if (max != null) {
        queryParam.add("max", max.toString());
      }

      HttpResponse response = super.requestGet(header, Body.DEFAULT, queryParam, usersUrl);

      String responseStr = response.getResponse().toString();
      JSONArray usersArray = new JSONArray(responseStr);

      log.debug("Encontrados {} usuários", usersArray.length());

      java.util.List<JSONObject> users = new java.util.ArrayList<>();
      for (int i = 0; i < usersArray.length(); i++) {
        users.add(usersArray.getJSONObject(i));
      }

      return users;

    } catch (HttpException e) {
      log.error("Erro ao listar usuários no Keycloak: {}", e.getMessage());
      throw new ArchException("Falha ao listar usuários no Keycloak: " + e.getMessage(), e);
    }
  }

}
