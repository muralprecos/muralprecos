package br.com.tt.painelpreco.api.dto;

import java.text.NumberFormat;
import java.util.Date;
import java.util.Locale;
import java.util.UUID;

import br.com.tt.painelpreco.util.DateUtil;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LicitacaoDTO {
	
	private UUID uuid;
	private String numero;
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
	
	public String getDataResultadoCompra() {
		return dataResultadoCompra != null ? DateUtil.format(dataResultadoCompra, DateUtil.DEFAULT_MASK) : null;
	}
	
	public String getDataAbertura() {
		return dataAbertura != null ? DateUtil.format(dataAbertura, DateUtil.DEFAULT_MASK) : null;
	}
	
	public String getValor() {
		Locale localBrasil = new Locale("pt", "BR");
		return NumberFormat.getCurrencyInstance(localBrasil).format(valor);
	}

}
