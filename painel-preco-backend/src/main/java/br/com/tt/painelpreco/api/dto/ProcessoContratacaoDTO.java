package br.com.tt.painelpreco.api.dto;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import br.com.tt.painelpreco.domain.model.ProcessoContratacao.CriterioJulgamentoEnum;
import br.com.tt.painelpreco.domain.model.ProcessoContratacao.MarcoInicioExecucaoEnum;
import br.com.tt.painelpreco.domain.model.ProcessoContratacao.ModalidadeEnum;
import br.com.tt.painelpreco.domain.model.ProcessoContratacao.PrazoVigenciaFundamentoEnum;
import br.com.tt.painelpreco.domain.model.ProcessoContratacao.RegimeExecucaoEnum;
import br.com.tt.painelpreco.domain.model.ProcessoContratacao.StatusEnum;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProcessoContratacaoDTO {

	private UUID uuid;
	private UUID cotacaoUuid;
	private String objeto;
	private String justificativaNecessidade;
	private ModalidadeEnum modalidadePretendida;
	private CriterioJulgamentoEnum criterioJulgamento;
	private RegimeExecucaoEnum regimeExecucao;
	private Integer prazoVigenciaMeses;
	private PrazoVigenciaFundamentoEnum prazoVigenciaFundamentoLegal;
	private Boolean tipoObjetoContinuo;
	private Boolean orcamentoSigiloso;
	private Boolean registroPrecos;
	private Boolean tratamentoFavorecidoMeEpp;
	private String dotacaoGestaoUnidade;
	private String dotacaoFonteRecursos;
	private String dotacaoProgramaTrabalho;
	private String dotacaoElementoDespesa;
	private String dotacaoPlanoInterno;
	private Boolean dotacaoPostergada;
	private String orgaoNome;
	private String orgaoCnpj;
	private String orgaoEndereco;
	private String orgaoEsfera;
	private String orgaoUasg;
	private String orgaoTelefone;
	private String localExecucaoServicos;
	private String horarioExecucaoServicos;
	private Integer prazoInicioExecucaoDias;
	private MarcoInicioExecucaoEnum marcoInicioExecucao;
	private Integer prazoRecebimentoProvisorioDias;
	private Integer prazoRecebimentoDefinitivoDias;
	private Integer prazoPagamentoDias;
	private Boolean exigeGarantiaContratual;
	private BigDecimal percentualGarantiaContratual;
	private String garantiaServicoDescricao;
	private Boolean permiteSubcontratacao;
	private BigDecimal percentualMaximoSubcontratacao;
	private Boolean exigeUniforme;
	private String especificacaoUniforme;
	private String indiceReajuste;
	private Integer periodicidadeReajusteMeses;
	private BigDecimal percentualMultaMoratoria;
	private BigDecimal percentualMultaCompensatoria;
	private Integer prazoAssinaturaContratoDiasUteis;
	private Integer prazoValidadePropostaDias;
	private String intervaloMinimoLances;
	private String meioImpugnacaoEsclarecimento;
	private StatusEnum status;
	private Date criadoEm;
	private List<ItemProcessoContratacaoDTO> itens;
	private List<ArtefatoGeradoDTO> artefatos;

}
