package br.com.tt.painelpreco.arch.view.http;

public enum AuthorizationType {
	
	BASIC("Basic "), BEARER("Bearer "), CODE_AUTH("code");

	private String name;

	AuthorizationType(String name) {
		this.name = name;
	}
	
	public String getName() {
		return name;
	}

}
