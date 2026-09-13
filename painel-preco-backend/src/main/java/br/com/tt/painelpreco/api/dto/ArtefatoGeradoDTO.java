package br.com.tt.painelpreco.api.dto;

import java.util.Date;
import java.util.UUID;

import br.com.tt.painelpreco.domain.model.ArtefatoGerado.StatusEnum;
import br.com.tt.painelpreco.domain.model.ArtefatoGerado.TipoEnum;
import lombok.Getter;
import lombok.Setter;

/** Resumo de um artefato gerado (sem o conteúdo binário do docx). */
@Getter
@Setter
public class ArtefatoGeradoDTO {

	private UUID uuid;
	private TipoEnum tipo;
	private Integer versao;
	private StatusEnum status;
	private String nomeArquivo;
	private Date geradoEm;
	private Date revisadoEm;
	private String nomeArquivoFinal;
	private Date finalEnviadoEm;

}
