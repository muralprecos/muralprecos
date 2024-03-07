package br.com.tt.painelpreco.api.dto;

import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CotacaoDTO {
	
	private UUID uuid;
	private String nome;
	private String nomeArquivo;
	private String stringBusca;
	private String hashValidacao;
	private byte[] arquivo;
	private String criadoEm;

}
