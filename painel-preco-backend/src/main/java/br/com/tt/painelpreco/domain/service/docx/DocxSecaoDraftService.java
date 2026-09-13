package br.com.tt.painelpreco.domain.service.docx;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.tt.painelpreco.arch.exception.ArchException;
import br.com.tt.painelpreco.domain.model.ArtefatoGerado;
import br.com.tt.painelpreco.domain.model.ArtefatoSecaoLog;
import br.com.tt.painelpreco.domain.model.ArtefatoSecaoLog.OrigemEnum;
import br.com.tt.painelpreco.domain.model.ItemProcessoContratacao;
import br.com.tt.painelpreco.domain.model.ProcessoContratacao;
import br.com.tt.painelpreco.llm.domain.service.LlmClientService;

/**
 * Redação por seção, por IA, para os três artefatos (ETP, TR e Edital) — passo único
 * que substitui o antigo {@code DocxNarrativeDraftService} (restrito ao ETP). Cada
 * seção é redigida isoladamente, com o MESMO grounding estrito já validado no ETP:
 * a IA recebe todos os fatos conhecidos do processo (nunca apenas um subconjunto
 * estreito) e, quando um dado necessário não foi informado, deve escrever
 * literalmente "[A SER PREENCHIDO PELO ÓRGÃO]" em vez de presumir algo plausível.
 *
 * Para TR e Edital, cada seção também recebe (quando existir) um trecho de
 * referência extraído do modelo oficial da AGU ({@link CatalogoReferenciaSecoesTR}/
 * {@link CatalogoReferenciaSecoesEdital}) — só como contexto de terminologia e
 * estrutura, nunca copiado literalmente: a instrução deixa isso explícito.
 *
 * Os pontos que já são fato determinístico (valor, item, órgão, dotação) ou
 * decisão binária pré-catalogada (continuidade, vigência, sigilo orçamentário,
 * dotação postergada, divisão de itens, tratamento ME/EPP) continuam resolvidos
 * por {@link DocxDeterministicFillService}/{@link DocxClauseSelectionService},
 * sem nenhuma mudança — este serviço só cobre os tokens {@code {{DRAFT:*}}}.
 */
@Service
public class DocxSecaoDraftService {

	private static final String SYSTEM_PROMPT =
			"Você é um assistente técnico especializado em elaboração de documentos de contratação pública "
			+ "(Estudo Técnico Preliminar, Termo de Referência e Edital), sob a Lei nº 14.133/2021. Redija de forma "
			+ "objetiva, em linguagem técnica formal, o trecho solicitado. REGRA ABSOLUTA: baseie-se exclusivamente "
			+ "nos fatos fornecidos abaixo — nunca invente número, prazo, percentual, fornecedor, fundamento legal "
			+ "específico ou qualquer circunstância que não tenha sido informada. Se um dado necessário para "
			+ "completar o texto não foi fornecido, escreva literalmente '[A SER PREENCHIDO PELO ÓRGÃO]' no lugar "
			+ "dele, em vez de presumir algo plausível. O trecho de referência (quando houver) é só um guia de "
			+ "terminologia e estrutura do modelo oficial — não o copie literalmente, redija de forma própria e "
			+ "coesa. Os fatos são fornecidos como um JSON de chave/valor para sua interpretação — NUNCA mencione "
			+ "o nome técnico de uma chave (ex.: 'tipoObjetoContinuo', 'orcamentoSigiloso') no texto; descreva "
			+ "sempre a informação em português corrente, como um redator humano faria. Este trecho é uma entre "
			+ "várias seções do mesmo documento; assuma que o leitor já leu as seções anteriores — não repita a "
			+ "descrição completa do objeto, do valor estimado ou dos demais fatos gerais a cada seção, apenas "
			+ "refira-se a eles brevemente quando for relevante para o ponto específico desta seção. Responda "
			+ "APENAS com o texto final do trecho: não repita nem parafraseie o título da seção como primeira "
			+ "frase, não numere a resposta como se fosse uma subseção própria, sem comentários, sem marcações de "
			+ "markdown.";

	private static final NumberFormat MOEDA_BR = NumberFormat.getCurrencyInstance(new Locale("pt", "BR"));

	@Autowired
	private LlmClientService llmClientService;

	@Autowired
	private DocxTemplateEngine engine;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private CatalogoReferenciaSecoesTR referenciaTR;

	@Autowired
	private CatalogoReferenciaSecoesEdital referenciaEdital;

	// ── Estrutura declarativa de seções por tipo de artefato ──────────────────

	/** @param chaveReferencia chave no catálogo de referência da AGU (pode ser {@code null}: sem trecho de referência). */
	private static final class SecaoDraft {
		final String chave;
		final String instrucao;
		final String chaveReferencia;

		SecaoDraft(String chave, String instrucao, String chaveReferencia) {
			this.chave = chave;
			this.instrucao = instrucao;
			this.chaveReferencia = chaveReferencia;
		}
	}

	private static final List<SecaoDraft> SECOES_ETP = List.of(
			new SecaoDraft("NECESSIDADE",
					"Redija a descrição da necessidade da contratação (por que ela é necessária), com base no objeto e na justificativa informados.",
					null),
			new SecaoDraft("LEVANTAMENTO_MERCADO",
					"Redija o levantamento de mercado e a justificativa da escolha do tipo de solução, com base no objeto e nos itens pesquisados.",
					null),
			new SecaoDraft("DESCRICAO_SOLUCAO",
					"Redija a descrição da solução como um todo, considerando o ciclo de vida do objeto, com base no objeto e nos itens pesquisados.",
					null),
			new SecaoDraft("PARCELAMENTO",
					"Redija a justificativa para o parcelamento ou não da contratação, com base na quantidade e natureza dos itens pesquisados.",
					null),
			new SecaoDraft("RESULTADOS_PRETENDIDOS",
					"Redija os resultados pretendidos com a contratação, com base no objeto informado.",
					null),
			new SecaoDraft("POSICIONAMENTO_CONCLUSIVO",
					"Redija um posicionamento conclusivo sobre a viabilidade da contratação, encerrando com a recomendação de que o "
					+ "prosseguimento do processo está sujeito à revisão técnica e jurídica da equipe responsável do órgão.",
					null));

	private static final List<SecaoDraft> SECOES_TR = List.of(
			new SecaoDraft("CONDICOES_GERAIS",
					"Redija as condições gerais da contratação: classificação do objeto (bem ou serviço, contínuo ou não, com base no fato "
					+ "tipoObjetoContinuo), regime de execução e forma de seleção resumida, com base nos fatos informados.",
					"CONDICOES_GERAIS_DA_CONTRATACAO"),
			new SecaoDraft("FUNDAMENTACAO_NECESSIDADE",
					"Redija a fundamentação e a descrição da necessidade da contratação, com base no objeto e na justificativa informados.",
					"FUNDAMENTACAO_E_DESCRICAO_DA_NECESSIDADE_DA_CONTRATACAO"),
			new SecaoDraft("DESCRICAO_SOLUCAO",
					"Redija a descrição da solução como um todo, considerado o ciclo de vida do objeto, com base no objeto e nos itens.",
					"DESCRICAO_DA_SOLUCAO_COMO_UM_TODO_CONSIDERADO_O_CICLO_DE_VIDA_DO_OBJETO"),
			new SecaoDraft("REQUISITOS_CONTRATACAO",
					"Redija os requisitos da contratação (sustentabilidade, exigências técnicas gerais aplicáveis ao objeto). Cite o "
					+ "percentual e/ou a descrição de garantia contratual (fatos exigeGarantiaContratual/percentualGarantiaContratual/"
					+ "garantiaServicoDescricao) e as exigências de uniforme (fatos exigeUniforme/especificacaoUniforme) quando informados; "
					+ "não invente esses valores quando ausentes — marque como [A SER PREENCHIDO PELO ÓRGÃO].",
					"REQUISITOS_DA_CONTRATACAO"),
			new SecaoDraft("SUBCONTRATACAO",
					"Redija a cláusula de subcontratação. Use o fato permiteSubcontratacao para dizer se é admitida ou vedada e, se admitida "
					+ "e o fato percentualMaximoSubcontratacao estiver informado, cite o limite percentual; caso contrário, trate genericamente "
					+ "das condições sem inventar um percentual.",
					"SUBCONTRATACAO"),
			new SecaoDraft("MODELO_EXECUCAO",
					"Redija o modelo de execução do objeto: condições de execução, rotinas a cumprir, com base no objeto informado. Cite o "
					+ "local (localExecucaoServicos) e o horário (horarioExecucaoServicos) de prestação dos serviços e o prazo de início da "
					+ "execução (prazoInicioExecucaoDias, contado do marco indicado em marcoInicioExecucao) quando esses fatos estiverem "
					+ "informados; quando não estiverem, marque como [A SER PREENCHIDO PELO ÓRGÃO].",
					"MODELO_DE_EXECUCAO_DO_OBJETO"),
			new SecaoDraft("MODELO_GESTAO",
					"Redija o modelo de gestão do contrato: rotinas de fiscalização técnica e administrativa, papel do gestor/fiscal do contrato.",
					"MODELO_DE_GESTAO_DO_CONTRATO"),
			new SecaoDraft("MEDICAO_PAGAMENTO",
					"Redija os critérios de medição e pagamento: liquidação e forma de pagamento, em termos gerais. Cite os prazos de "
					+ "recebimento provisório (prazoRecebimentoProvisorioDias), recebimento definitivo (prazoRecebimentoDefinitivoDias) e "
					+ "pagamento (prazoPagamentoDias), bem como o índice e a periodicidade de reajuste/repactuação (indiceReajuste, "
					+ "periodicidadeReajusteMeses) quando aplicável, sempre que esses fatos estiverem informados; quando não estiverem, "
					+ "marque como [A SER PREENCHIDO PELO ÓRGÃO].",
					"CRITERIOS_DE_MEDICAO_E_PAGAMENTO"),
			new SecaoDraft("SANCOES",
					"Redija as infrações e sanções administrativas aplicáveis, com base nos arts. 155 a 163 da Lei nº 14.133/2021, em termos "
					+ "gerais. Cite os percentuais de multa moratória e compensatória (percentualMultaMoratoria, percentualMultaCompensatoria) "
					+ "quando informados; quando não estiverem, refira-se à forma prevista no instrumento contratual, sem inventar um valor.",
					"INFRACOES_E_SANCOES_ADMINISTRATIVAS"),
			new SecaoDraft("SELECAO_FORNECEDOR",
					"Redija a forma e os critérios de seleção do fornecedor e o regime de execução, com base na modalidade, no critério de "
					+ "julgamento e no regime de execução informados.",
					"FORMA_E_CRITERIOS_DE_SELECAO_DO_FORNECEDOR_E_REGIME_DE_EXECUCAO"),
			new SecaoDraft("DISPOSICOES_FINAIS",
					"Redija as disposições finais do Termo de Referência, em termos gerais e concisos.",
					"DISPOSICOES_FINAIS"),
			new SecaoDraft("FORMALIZACAO_CONTRATACAO",
					"Redija a seção de formalização da contratação (assinatura do contrato/ata, documentos exigidos do adjudicatário), em "
					+ "termos gerais. Cite o prazo para o adjudicatário assinar o contrato ou instrumento equivalente "
					+ "(prazoAssinaturaContratoDiasUteis, em dias úteis) quando informado; caso contrário, marque como "
					+ "[A SER PREENCHIDO PELO ÓRGÃO].",
					"FORMALIZACAO_DA_CONTRATACAO"),
			new SecaoDraft("OBRIGACOES_CONTRATANTE",
					"Redija as obrigações do contratante, em termos gerais e usuais para este tipo de contratação.",
					"OBRIGACOES_DO_CONTRATANTE"),
			new SecaoDraft("OBRIGACOES_CONTRATADO",
					"Redija as obrigações do contratado, em termos gerais e usuais para este tipo de contratação.",
					"OBRIGACOES_DO_CONTRATADO"),
			new SecaoDraft("OBRIGACOES_LGPD",
					"Redija as obrigações das partes quanto à proteção de dados pessoais (LGPD), em termos gerais.",
					"OBRIGACOES_PERTINENTES_A_LGPD"),
			new SecaoDraft("EXTINCAO_CONTRATUAL",
					"Redija as hipóteses e consequências da extinção contratual, com base nos arts. 137 a 139 da Lei nº 14.133/2021, em termos gerais.",
					"DA_EXTINCAO_CONTRATUAL"),
			new SecaoDraft("CASOS_OMISSOS",
					"Redija uma cláusula breve sobre a resolução de casos omissos, remetendo à Lei nº 14.133/2021 e à legislação correlata.",
					"DOS_CASOS_OMISSOS"),
			new SecaoDraft("ALTERACOES_CONTRATUAIS",
					"Redija uma cláusula breve sobre alterações contratuais, com base nos arts. 124 a 136 da Lei nº 14.133/2021.",
					"ALTERACOES"),
			new SecaoDraft("FORO",
					"Redija a cláusula de foro. Use o município/UF do órgão quando informado no fato orgaoEndereco; caso não seja possível "
					+ "identificar com segurança, marque como [A SER PREENCHIDO PELO ÓRGÃO].",
					"FORO"));

	private static final List<SecaoDraft> SECOES_EDITAL = List.of(
			new SecaoDraft("EDITAL_OBJETO",
					"Redija a seção do objeto do edital, restatando de forma formal o objeto da licitação com base no fato objeto e remetendo "
					+ "ao Termo de Referência anexo para as especificações completas.",
					"DO_OBJETO"),
			new SecaoDraft("REGISTRO_PRECOS",
					"Redija a seção sobre o regime de registro de preços. Se o fato registroPrecos for falso, declare explicitamente que este "
					+ "certame NÃO adota o sistema de registro de preços; se verdadeiro, explique o regime em termos gerais.",
					"DO_REGISTRO_DE_PRECOS"),
			new SecaoDraft("PARTICIPACAO_LICITACAO",
					"Redija as condições de participação na licitação, em termos gerais (habilitação jurídica prévia, vedações usuais de "
					+ "participação), sem repetir o tratamento diferenciado a ME/EPP (tratado em cláusula própria).",
					"DA_PARTICIPACAO_NA_LICITACAO"),
			new SecaoDraft("APRESENTACAO_PROPOSTA_HABILITACAO",
					"Redija a seção sobre a apresentação da proposta e dos documentos de habilitação, em termos gerais do rito eletrônico. "
					+ "Cite o prazo de validade da proposta (prazoValidadePropostaDias) quando informado; caso contrário, marque como "
					+ "[A SER PREENCHIDO PELO ÓRGÃO].",
					"DA_APRESENTACAO_DA_PROPOSTA_E_DOS_DOCUMENTOS_DE_HABILITACAO"),
			new SecaoDraft("PREENCHIMENTO_PROPOSTA",
					"Redija a seção sobre o preenchimento da proposta no sistema, em termos gerais.",
					"DO_PREENCHIMENTO_DA_PROPOSTA"),
			new SecaoDraft("ABERTURA_SESSAO_LANCES",
					"Redija a seção sobre a abertura da sessão pública, classificação das propostas e formulação de lances, com base na "
					+ "modalidade informada (pregão eletrônico ou concorrência). Cite o intervalo mínimo de diferença de valores entre lances "
					+ "(intervaloMinimoLances) quando informado; caso contrário, marque como [A SER PREENCHIDO PELO ÓRGÃO].",
					"DA_ABERTURA_DA_SESSAO_CLASSIFICACAO_DAS_PROPOSTAS_E_FORMULACAO_DE_LANCES"),
			new SecaoDraft("FASE_JULGAMENTO",
					"Redija a seção da fase de julgamento das propostas, com base no critério de julgamento informado.",
					"DA_FASE_DE_JULGAMENTO"),
			new SecaoDraft("FASE_HABILITACAO",
					"Redija a seção da fase de habilitação, em termos gerais, remetendo às exigências detalhadas no Termo de Referência anexo.",
					"DA_FASE_DE_HABILITACAO"),
			new SecaoDraft("TERMO_CONTRATO",
					"Redija a seção sobre a formalização do termo de contrato (ou instrumento equivalente), em termos gerais. Cite o prazo "
					+ "para o adjudicatário assinar o contrato (prazoAssinaturaContratoDiasUteis, em dias úteis) quando informado; caso "
					+ "contrário, marque como [A SER PREENCHIDO PELO ÓRGÃO].",
					"DO_TERMO_DE_CONTRATO"),
			new SecaoDraft("ATA_REGISTRO_PRECOS",
					"Redija a seção sobre a ata de registro de preços. Se o fato registroPrecos for falso, declare explicitamente que esta "
					+ "seção não se aplica a este certame.",
					"DA_ATA_DE_REGISTRO_DE_PRECOS"),
			new SecaoDraft("CADASTRO_RESERVA",
					"Redija a seção sobre a formação de cadastro de reserva. Se o fato registroPrecos for falso, declare explicitamente que "
					+ "esta seção não se aplica a este certame.",
					"DA_FORMACAO_DO_CADASTRO_DE_RESERVA"),
			new SecaoDraft("RECURSOS_ADMINISTRATIVOS",
					"Redija a seção sobre recursos administrativos, com base nos arts. 165 a 168 da Lei nº 14.133/2021, em termos gerais.",
					"DOS_RECURSOS"),
			new SecaoDraft("INFRACOES_SANCOES_EDITAL",
					"Redija as infrações administrativas e sanções aplicáveis a este certame, com base nos arts. 155 a 163 da Lei nº "
					+ "14.133/2021. Cite os percentuais de multa moratória e compensatória (percentualMultaMoratoria, "
					+ "percentualMultaCompensatoria) quando informados; quando não estiverem, refira-se à forma prevista no edital/contrato, "
					+ "sem inventar um valor.",
					"DAS_INFRACOES_ADMINISTRATIVAS_E_SANCOES"),
			new SecaoDraft("IMPUGNACAO_ESCLARECIMENTO",
					"Redija a seção sobre impugnação ao edital e pedidos de esclarecimento, com base no art. 164 da Lei nº 14.133/2021, em "
					+ "termos gerais. Cite o meio eletrônico pelo qual a impugnação/esclarecimento deve ser enviado "
					+ "(meioImpugnacaoEsclarecimento) quando informado; caso contrário, marque como [A SER PREENCHIDO PELO ÓRGÃO].",
					"DA_IMPUGNACAO_AO_EDITAL_E_DO_PEDIDO_DE_ESCLARECIMENTO"),
			new SecaoDraft("DISPOSICOES_GERAIS_EDITAL",
					"Redija as disposições gerais do edital, em termos gerais e concisos.",
					"DAS_DISPOSICOES_GERAIS"));

	// ── API pública ─────────────────────────────────────────────────────────

	public List<ArtefatoSecaoLog> redigirEtp(XWPFDocument doc, ProcessoContratacao processo, ArtefatoGerado artefato) {
		return redigirSecoes(doc, processo, artefato, SECOES_ETP, null);
	}

	public List<ArtefatoSecaoLog> redigirTermoReferencia(XWPFDocument doc, ProcessoContratacao processo, ArtefatoGerado artefato) {
		return redigirSecoes(doc, processo, artefato, SECOES_TR, referenciaTR::referenciaDe);
	}

	public List<ArtefatoSecaoLog> redigirEdital(XWPFDocument doc, ProcessoContratacao processo, ArtefatoGerado artefato) {
		return redigirSecoes(doc, processo, artefato, SECOES_EDITAL, referenciaEdital::referenciaDe);
	}

	private List<ArtefatoSecaoLog> redigirSecoes(XWPFDocument doc, ProcessoContratacao processo, ArtefatoGerado artefato,
			List<SecaoDraft> secoes, java.util.function.Function<String, String> resolvedorReferencia) {
		String fatosJson = escreverJson(fatosCompletos(processo));

		List<ArtefatoSecaoLog> logs = new ArrayList<>();
		for (SecaoDraft secao : secoes) {
			String referencia = secao.chaveReferencia == null || resolvedorReferencia == null
					? ""
					: resolvedorReferencia.apply(secao.chaveReferencia);
			logs.add(redigir(doc, artefato, secao.chave, fatosJson, secao.instrucao, referencia));
		}
		return logs;
	}

	private ArtefatoSecaoLog redigir(XWPFDocument doc, ArtefatoGerado artefato, String chave, String fatosJson, String instrucao,
			String referencia) {
		StringBuilder userPrompt = new StringBuilder();
		userPrompt.append("Fatos do processo (use APENAS estes fatos; não presuma nada além deles):\n").append(fatosJson);
		if (referencia != null && !referencia.isBlank()) {
			userPrompt.append("\n\nTrecho de referência do modelo oficial (só para terminologia/estrutura, não copie literalmente):\n")
					.append(referencia);
		}
		userPrompt.append("\n\nTarefa: ").append(instrucao);

		String textoRedigido = llmClientService.completar(SYSTEM_PROMPT, userPrompt.toString(), 0.2, false);

		Map<String, String> substituicao = Map.of("{{DRAFT:" + chave + "}}", textoRedigido.trim());
		engine.substituirEmDocumento(doc.getParagraphs(), doc.getTables(), substituicao);

		ArtefatoSecaoLog log = new ArtefatoSecaoLog();
		log.setArtefatoGerado(artefato);
		log.setSecaoChave(chave);
		log.setOrigem(OrigemEnum.LLM_REDACAO_LIVRE);
		log.setFactsEnviados(fatosJson);
		log.setRespostaBruta(textoRedigido);
		return log;
	}

	// ── Fatos completos do processo (superset usado por ETP, TR e Edital) ─────

	private Map<String, Object> fatosCompletos(ProcessoContratacao processo) {
		Map<String, Object> fatos = new LinkedHashMap<>();
		fatos.put("objeto", processo.getObjeto());
		fatos.put("justificativaNecessidade", processo.getJustificativaNecessidade());
		fatos.put("modalidadePretendida", nomeEnum(processo.getModalidadePretendida()));
		fatos.put("criterioJulgamento", nomeEnum(processo.getCriterioJulgamento()));
		fatos.put("regimeExecucao", nomeEnum(processo.getRegimeExecucao()));
		fatos.put("prazoVigenciaMeses", processo.getPrazoVigenciaMeses());
		fatos.put("prazoVigenciaFundamentoLegal", nomeEnum(processo.getPrazoVigenciaFundamentoLegal()));
		fatos.put("tipoObjetoContinuo", processo.getTipoObjetoContinuo());
		fatos.put("orcamentoSigiloso", processo.getOrcamentoSigiloso());
		fatos.put("registroPrecos", processo.getRegistroPrecos());
		fatos.put("tratamentoFavorecidoMeEpp", processo.getTratamentoFavorecidoMeEpp());
		fatos.put("dotacaoGestaoUnidade", processo.getDotacaoGestaoUnidade());
		fatos.put("dotacaoFonteRecursos", processo.getDotacaoFonteRecursos());
		fatos.put("dotacaoProgramaTrabalho", processo.getDotacaoProgramaTrabalho());
		fatos.put("dotacaoElementoDespesa", processo.getDotacaoElementoDespesa());
		fatos.put("dotacaoPlanoInterno", processo.getDotacaoPlanoInterno());
		fatos.put("dotacaoPostergada", processo.getDotacaoPostergada());
		fatos.put("orgaoNome", processo.getOrgaoNome());
		fatos.put("orgaoCnpj", processo.getOrgaoCnpj());
		fatos.put("orgaoEndereco", processo.getOrgaoEndereco());
		fatos.put("orgaoEsfera", processo.getOrgaoEsfera());
		fatos.put("orgaoUasg", processo.getOrgaoUasg());
		fatos.put("orgaoTelefone", processo.getOrgaoTelefone());

		fatos.put("localExecucaoServicos", processo.getLocalExecucaoServicos());
		fatos.put("horarioExecucaoServicos", processo.getHorarioExecucaoServicos());
		fatos.put("prazoInicioExecucaoDias", processo.getPrazoInicioExecucaoDias());
		fatos.put("marcoInicioExecucao", nomeEnum(processo.getMarcoInicioExecucao()));
		fatos.put("prazoRecebimentoProvisorioDias", processo.getPrazoRecebimentoProvisorioDias());
		fatos.put("prazoRecebimentoDefinitivoDias", processo.getPrazoRecebimentoDefinitivoDias());
		fatos.put("prazoPagamentoDias", processo.getPrazoPagamentoDias());
		fatos.put("exigeGarantiaContratual", processo.getExigeGarantiaContratual());
		fatos.put("percentualGarantiaContratual", processo.getPercentualGarantiaContratual());
		fatos.put("garantiaServicoDescricao", processo.getGarantiaServicoDescricao());
		fatos.put("permiteSubcontratacao", processo.getPermiteSubcontratacao());
		fatos.put("percentualMaximoSubcontratacao", processo.getPercentualMaximoSubcontratacao());
		fatos.put("exigeUniforme", processo.getExigeUniforme());
		fatos.put("especificacaoUniforme", processo.getEspecificacaoUniforme());
		fatos.put("indiceReajuste", processo.getIndiceReajuste());
		fatos.put("periodicidadeReajusteMeses", processo.getPeriodicidadeReajusteMeses());
		fatos.put("percentualMultaMoratoria", processo.getPercentualMultaMoratoria());
		fatos.put("percentualMultaCompensatoria", processo.getPercentualMultaCompensatoria());
		fatos.put("prazoAssinaturaContratoDiasUteis", processo.getPrazoAssinaturaContratoDiasUteis());
		fatos.put("prazoValidadePropostaDias", processo.getPrazoValidadePropostaDias());
		fatos.put("intervaloMinimoLances", processo.getIntervaloMinimoLances());
		fatos.put("meioImpugnacaoEsclarecimento", processo.getMeioImpugnacaoEsclarecimento());

		BigDecimal valorTotal = processo.getItens().stream()
				.map(ItemProcessoContratacao::getValorTotal)
				.filter(v -> v != null)
				.reduce(BigDecimal.ZERO, BigDecimal::add);
		fatos.put("valorTotalEstimado", MOEDA_BR.format(valorTotal));
		fatos.put("quantidadeDeItensDistintos", processo.getItens().size());
		fatos.put("itens", processo.getItens().stream()
				.map(i -> i.getDescricao() + " (qtd: " + i.getQuantidade() + ")")
				.collect(Collectors.toList()));

		return fatos;
	}

	private String nomeEnum(Enum<?> valor) {
		return valor == null ? null : valor.name();
	}

	private String escreverJson(Map<String, Object> fatos) {
		try {
			return objectMapper.writeValueAsString(fatos);
		} catch (Exception e) {
			throw new ArchException("Falha ao serializar fatos para a IA: " + e.getMessage(), e);
		}
	}

}
