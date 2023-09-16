package br.com.tt.painelpreco.api.dto;

import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FormaCompraDTO {
	
	private UUID uuid;
	private String nome;
	private String sigla;

}
