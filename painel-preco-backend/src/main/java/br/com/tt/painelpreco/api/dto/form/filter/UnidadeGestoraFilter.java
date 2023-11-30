package br.com.tt.painelpreco.api.dto.form.filter;

import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UnidadeGestoraFilter {
	
	private UUID uuid;
	private String codigo;
	private String nome;

}
