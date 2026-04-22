package br.com.tt.painelpreco.domain.service;

/**
 * Situações possíveis de um registro durante a sincronização Keycloak → Banco,
 * com as respectivas mensagens de detalhe.
 *
 * Para situações com dados dinâmicos (conflitos), use {@link #formatar(Object...)}
 * em vez de {@link #getDescricao()} diretamente.
 */
public enum SituacaoSincronizacao {

  // ---- Usuário ----------------------------------------------------------------
  USUARIO_SINCRONIZADO("Sincronização realizada com sucesso."),
  USUARIO_DESATIVADO("Usuário não encontrado no Keycloak. Registro desativado."),
  USUARIO_NAO_ENCONTRADO_NO_KEYCLOAK("Não encontrado no Keycloak."),
  USUARIO_REATIVADO("Registro reativado via sincronização com Keycloak."),
  USUARIO_CRIADO("Usuário criado via sincronização com Keycloak."),
  USUARIO_CONFLITO_LOGIN("Conflito de sincronização: login '%s' já existe para outro UUID Keycloak (%s)."),
  USUARIO_CONFLITO_EMAIL("Conflito de sincronização: email '%s' já existe para outro UUID Keycloak (%s)."),

  // ---- Organização ------------------------------------------------------------
  ORGANIZACAO_SINCRONIZADA("Sincronização realizada com sucesso."),
  ORGANIZACAO_DESATIVADA("Organização não encontrada no Keycloak. Registro desativado."),
  ORGANIZACAO_NAO_ENCONTRADA_NO_KEYCLOAK("Não encontrada no Keycloak."),
  ORGANIZACAO_REATIVADA("Registro reativado via sincronização com Keycloak."),
  ORGANIZACAO_CRIADA("Organização criada via sincronização com Keycloak."),
  ORGANIZACAO_CONFLITO_NOME("Conflito de sincronização: nome '%s' já existe para outro UUID Keycloak (%s).");

  private final String descricao;

  SituacaoSincronizacao(String descricao) {
    this.descricao = descricao;
  }

  /** Retorna a descrição fixa da situação. */
  public String getDescricao() {
    return descricao;
  }

  /**
   * Formata a descrição substituindo os placeholders {@code %s} pelos argumentos fornecidos.
   * Use apenas para situações com dados dinâmicos (ex.: conflitos).
   */
  public String formatar(Object... args) {
    return String.format(descricao, args);
  }
}
