package br.com.tt.painelpreco.api.dto;

import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UnidadeGestoraDTO {
	
	private UUID uuid;
	private Integer codigo;
	private String nome;

}
