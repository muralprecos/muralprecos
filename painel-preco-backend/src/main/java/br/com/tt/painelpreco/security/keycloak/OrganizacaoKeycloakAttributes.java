package br.com.tt.painelpreco.security.keycloak;

/**
 * Constantes para os nomes dos atributos de organizações no Keycloak.
 * Segue o mesmo padrão de mapeamento utilizado para atributos de usuários.
 */
public final class OrganizacaoKeycloakAttributes {

  public static final String NOME = "organizacaoNome";
  public static final String CNPJ = "organizacaoCNPJ";
  public static final String TELEFONE = "organizacaoTelefone";
  public static final String ENABLED = "enabled";

  private OrganizacaoKeycloakAttributes() {
  }

}
