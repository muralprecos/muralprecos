package br.com.tt.painelpreco.arch.view.http;

public enum GrantType {
	
	CLIENT_CREDENTIALS("client_credentials"), AUTHORIZATION_CODE("authorization_code"), PASSWORD("password");

	private String name;

	GrantType(String name) {
		this.name = name;
	}
	
	public String getName() {
		return name;
	}

}
