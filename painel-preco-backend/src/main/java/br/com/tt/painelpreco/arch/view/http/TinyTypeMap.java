package br.com.tt.painelpreco.arch.view.http;

import br.com.tt.painelpreco.util.Parameter;

public abstract class TinyTypeMap extends Parameter {

	/** Comum/Padrão **/
	public static final String GRANT_TYPE_KEY = "grant_type";
	public static final String AUTHORIZATION_KEY = "authorization";
	public static final String CLIENT_ID_KEY = "client_id";
	public static final String RESPONSE_TYPE_KEY = "response_type";
	public static final String CONTENT_TYPE_KEY = "content-type";
	
	/** PJe **/
	public static final String PJE_CODE_KEY = "code";
	public static final String PJE_USER_KEY = "login";
	public static final String PJE_PASSWORD_KEY = "senha";
	public static final String PJE_PERFIL_KEY = "id_perfil";
	public static final String GRAU_JURISDICIONAL_KEY = "instancia";
	
	/** KEYCLOAK **/
	public static final String CLIENT_SECRET = "client_secret";
	public static final String USERNAME_KEY = "username";
	public static final String PASSWORD_KEY = "password";
	
}
