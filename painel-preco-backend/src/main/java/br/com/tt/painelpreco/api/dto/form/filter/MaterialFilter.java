package br.com.tt.painelpreco.api.dto.form.filter;

import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MaterialFilter {
	
	private UUID uuid;
	private Integer codigo;
	private String nome;

}
