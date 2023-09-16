package br.com.tt.painelpreco.arch.view.http;

public enum GrauJurisdicional {
	
	PRIMEIRO_GRAU(1), SEGUNDO_GRAU(2);

	private int grau;

	GrauJurisdicional(int grau) {
		this.grau = grau;
	}
	
	public int getGrau() {
		return grau;
	}

}
