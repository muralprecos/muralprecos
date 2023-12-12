package br.com.tt.painelpreco.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ObjetoLicitacaoDTO {

	@JsonProperty("nome")
	private String objeto;

}
