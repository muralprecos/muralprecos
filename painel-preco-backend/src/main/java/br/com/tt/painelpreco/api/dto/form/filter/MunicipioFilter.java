package br.com.tt.painelpreco.api.dto.form.filter;

import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MunicipioFilter {
	
	private UUID uf;
	private String nome;

}
