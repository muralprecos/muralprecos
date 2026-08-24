package br.com.tt.painelpreco.api.dto;

import br.com.tt.painelpreco.domain.model.ArtefatoSecaoLog.OrigemEnum;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ArtefatoSecaoLogDTO {

	private String secaoChave;
	private OrigemEnum origem;
	private String clausulaSelecionada;
	private String factsEnviados;
	private String respostaBruta;

}
