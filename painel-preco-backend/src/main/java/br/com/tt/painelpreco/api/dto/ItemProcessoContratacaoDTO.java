package br.com.tt.painelpreco.api.dto;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ItemProcessoContratacaoDTO {

	private String numeroItem;
	private String descricao;
	private String descricaoComplementar;
	private String unidadeFornecimento;
	private Long quantidade;
	private BigDecimal valorUnitario;
	private BigDecimal valorTotal;
	private String fornecedorNome;
	private String fornecedorDocumento;
	private String licitacaoNumeroPncp;
	private String licitacaoModalidade;
	private String licitacaoUf;

}
