package br.com.tt.painelpreco.api.dto;

import java.util.Date;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LicitacaoDTO {
	
	private UUID uuid;
	private Integer numero;
	private UnidadeGestoraDTO unidadeGestora;
	private ModalidadeCompraDTO modalidadeCompra;
	private String numeroProcesso;
	private String objeto;
	private SituacaoLicitacaoDTO situacao;
	private OrgaoDTO orgao;
	private OrgaoDTO orgaoSuperior;
	private MunicipioDTO municipio;
	private FormaCompraDTO formaCompra;
	private EsferaDTO esfera;
	private Date dataAbertura;
	private Date dataResultadoCompra;
	private Double valor;
	private Integer anoCompra;	
	private String periodoCompra;
//	private List<ItemLicitacaoDTO> itens;

}
