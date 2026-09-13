package br.com.tt.painelpreco.domain.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import br.com.tt.painelpreco.arch.infra.auth.Usuario;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Processo de contratação em elaboração: reúne os dados institucionais/legais
 * necessários para gerar ETP, Termo de Referência e Edital a partir de uma
 * cotação (pesquisa de preços) já salva.
 */
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Data
@Entity
@Table(name = "processo_contratacao", schema = "mural")
public class ProcessoContratacao {

	public enum ModalidadeEnum { PREGAO, CONCORRENCIA }

	public enum CriterioJulgamentoEnum { MENOR_PRECO, MAIOR_DESCONTO, TECNICA_E_PRECO }

	public enum RegimeExecucaoEnum { COM_DEDICACAO_MAO_DE_OBRA, SEM_DEDICACAO_MAO_DE_OBRA, COMPRAS, OBRAS }

	public enum PrazoVigenciaFundamentoEnum { ART_105, ART_106_107, ART_75_VIII }

	public enum StatusEnum { INTAKE, EM_GERACAO, RASCUNHO_DISPONIVEL, CONCLUIDO }

	public enum MarcoInicioExecucaoEnum { ASSINATURA_CONTRATO, ORDEM_SERVICO }

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_processo_contratacao")
	private Integer id;

	@EqualsAndHashCode.Include
	private UUID uuid;

	@ManyToOne
	@JoinColumn(name = "cotacao_id", nullable = false)
	private Cotacao cotacao;

	@Column(columnDefinition = "TEXT")
	private String objeto;

	@Column(name = "justificativa_necessidade", columnDefinition = "TEXT")
	private String justificativaNecessidade;

	@Enumerated(EnumType.STRING)
	@Column(name = "modalidade_pretendida")
	private ModalidadeEnum modalidadePretendida;

	@Enumerated(EnumType.STRING)
	@Column(name = "criterio_julgamento")
	private CriterioJulgamentoEnum criterioJulgamento;

	@Enumerated(EnumType.STRING)
	@Column(name = "regime_execucao")
	private RegimeExecucaoEnum regimeExecucao;

	@Column(name = "prazo_vigencia_meses")
	private Integer prazoVigenciaMeses;

	@Enumerated(EnumType.STRING)
	@Column(name = "prazo_vigencia_fundamento_legal")
	private PrazoVigenciaFundamentoEnum prazoVigenciaFundamentoLegal;

	@Column(name = "tipo_objeto_continuo")
	private Boolean tipoObjetoContinuo;

	@Column(name = "orcamento_sigiloso", nullable = false)
	private Boolean orcamentoSigiloso = false;

	@Column(name = "registro_precos", nullable = false)
	private Boolean registroPrecos = false;

	// Tratamento favorecido a ME/EPP/equiparadas no Edital (art. 4º-I da Lei nº
	// 14.133/2021 trata isso como regra geral) — default true (conceder), só
	// fica false quando o órgão justificar exceção explicitamente no intake.
	@Column(name = "tratamento_favorecido_me_epp", nullable = false)
	private Boolean tratamentoFavorecidoMeEpp = true;

	@Column(name = "dotacao_gestao_unidade")
	private String dotacaoGestaoUnidade;

	@Column(name = "dotacao_fonte_recursos")
	private String dotacaoFonteRecursos;

	@Column(name = "dotacao_programa_trabalho")
	private String dotacaoProgramaTrabalho;

	@Column(name = "dotacao_elemento_despesa")
	private String dotacaoElementoDespesa;

	@Column(name = "dotacao_plano_interno")
	private String dotacaoPlanoInterno;

	@Column(name = "dotacao_postergada", nullable = false)
	private Boolean dotacaoPostergada = false;

	// Snapshot institucional do órgão requisitante, resolvido uma única vez na
	// criação (nunca re-buscado), para que artefatos já gerados permaneçam
	// reprodutíveis mesmo se os dados do órgão mudarem depois.
	@Column(name = "orgao_nome")
	private String orgaoNome;

	@Column(name = "orgao_cnpj")
	private String orgaoCnpj;

	@Column(name = "orgao_endereco")
	private String orgaoEndereco;

	@Column(name = "orgao_esfera")
	private String orgaoEsfera;

	@Column(name = "orgao_uasg")
	private String orgaoUasg;

	@Column(name = "orgao_telefone")
	private String orgaoTelefone;

	// Parâmetros jurídicos que, quando não informados, aparecem como pendência
	// ("[A SER PREENCHIDO PELO ÓRGÃO]") no TR/Edital gerado — ver
	// DocxSecaoDraftService.fatosCompletos(). Todos opcionais: em branco, o
	// comportamento de sinalizar a lacuna continua exatamente como antes.
	@Column(name = "local_execucao_servicos")
	private String localExecucaoServicos;

	@Column(name = "horario_execucao_servicos")
	private String horarioExecucaoServicos;

	@Column(name = "prazo_inicio_execucao_dias")
	private Integer prazoInicioExecucaoDias;

	@Enumerated(EnumType.STRING)
	@Column(name = "marco_inicio_execucao")
	private MarcoInicioExecucaoEnum marcoInicioExecucao;

	@Column(name = "prazo_recebimento_provisorio_dias")
	private Integer prazoRecebimentoProvisorioDias;

	@Column(name = "prazo_recebimento_definitivo_dias")
	private Integer prazoRecebimentoDefinitivoDias;

	@Column(name = "prazo_pagamento_dias")
	private Integer prazoPagamentoDias;

	@Column(name = "exige_garantia_contratual", nullable = false)
	private Boolean exigeGarantiaContratual = false;

	@Column(name = "percentual_garantia_contratual", precision = 5, scale = 2)
	private BigDecimal percentualGarantiaContratual;

	@Column(name = "garantia_servico_descricao", columnDefinition = "TEXT")
	private String garantiaServicoDescricao;

	@Column(name = "permite_subcontratacao", nullable = false)
	private Boolean permiteSubcontratacao = false;

	@Column(name = "percentual_maximo_subcontratacao", precision = 5, scale = 2)
	private BigDecimal percentualMaximoSubcontratacao;

	@Column(name = "exige_uniforme", nullable = false)
	private Boolean exigeUniforme = false;

	@Column(name = "especificacao_uniforme", columnDefinition = "TEXT")
	private String especificacaoUniforme;

	@Column(name = "indice_reajuste")
	private String indiceReajuste;

	@Column(name = "periodicidade_reajuste_meses")
	private Integer periodicidadeReajusteMeses;

	@Column(name = "percentual_multa_moratoria", precision = 5, scale = 2)
	private BigDecimal percentualMultaMoratoria;

	@Column(name = "percentual_multa_compensatoria", precision = 5, scale = 2)
	private BigDecimal percentualMultaCompensatoria;

	@Column(name = "prazo_assinatura_contrato_dias_uteis")
	private Integer prazoAssinaturaContratoDiasUteis;

	@Column(name = "prazo_validade_proposta_dias")
	private Integer prazoValidadePropostaDias;

	@Column(name = "intervalo_minimo_lances")
	private String intervaloMinimoLances;

	@Column(name = "meio_impugnacao_esclarecimento")
	private String meioImpugnacaoEsclarecimento;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private StatusEnum status = StatusEnum.INTAKE;

	@ManyToOne
	@JoinColumn(name = "criado_por", nullable = false)
	private Usuario criadoPor;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "criado_em", nullable = false)
	private Date criadoEm = new Date();

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "atualizado_em")
	private Date atualizadoEm;

	@OneToMany(mappedBy = "processoContratacao", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
	private List<ItemProcessoContratacao> itens = new ArrayList<>();

}
