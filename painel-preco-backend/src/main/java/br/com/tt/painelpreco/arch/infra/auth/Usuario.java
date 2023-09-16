package br.com.tt.painelpreco.arch.infra.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Usuario {
	
	public static final String PJE_USER_API_ACCESS_TOKEN_KEY = "userApiToken";

	private String login;

	private String nome;
	
	private String email;
	
	public Usuario() {}
	
	public Usuario(String login, String nome, String email) {
		this.login = login;
		this.nome = nome;
		this.email = email;
	}

}
