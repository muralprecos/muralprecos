package br.com.tt.painelpreco.api.dto.form;

import java.math.BigDecimal;
import java.util.UUID;

import javax.validation.constraints.NotNull;

import br.com.tt.painelpreco.domain.model.ProcessoContratacao.CriterioJulgamentoEnum;
import br.com.tt.painelpreco.domain.model.ProcessoContratacao.MarcoInicioExecucaoEnum;
import br.com.tt.painelpreco.domain.model.ProcessoContratacao.ModalidadeEnum;
import br.com.tt.painelpreco.domain.model.ProcessoContratacao.PrazoVigenciaFundamentoEnum;
import br.com.tt.painelpreco.domain.model.ProcessoContratacao.RegimeExecucaoEnum;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProcessoContratacaoForm {

	@NotNull(message = "cotacaoUuid é obrigatório")
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

	// Dados do órgão requisitante para o cabeçalho do TR/Edital. orgaoNome é
	// pré-preenchido pelo backend a partir da organização do usuário logado
	// quando não informado; os demais ficam em branco até o usuário preencher
	// (nunca inventados).
	private String orgaoNome;
	private String orgaoCnpj;
	private String orgaoEndereco;
	private String orgaoEsfera;
	private String orgaoUasg;
	private String orgaoTelefone;

	// Parâmetros jurídicos adicionais do TR/Edital (ver ProcessoContratacao) —
	// todos opcionais; em branco, o documento continua sinalizando a lacuna
	// como antes.
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

}
