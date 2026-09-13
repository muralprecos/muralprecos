package br.com.tt.painelpreco.domain.service.docx;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFTable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.tt.painelpreco.domain.model.ItemProcessoContratacao;
import br.com.tt.painelpreco.domain.model.ProcessoContratacao;
import br.com.tt.painelpreco.util.NumeroPorExtensoUtil;

/**
 * Passo A da geração de artefatos: preenche exclusivamente os tokens
 * {@code {{FACTS:*}}} de um documento já aberto, a partir de dados reais do
 * processo de contratação — sem nenhuma chamada à IA. Cada valor inserido
 * aqui é rastreável (vem direto de uma coluna do banco), nunca inventado.
 *
 * Roda DEPOIS do Passo B ({@link DocxClauseSelectionService}), porque o texto
 * de uma cláusula escolhida pode ele próprio conter novos tokens
 * {@code {{FACTS:*}}} (ex.: a cláusula de dotação orçamentária) — uma única
 * passada de preenchimento de fatos no final resolve tudo de uma vez.
 */
@Service
public class DocxDeterministicFillService {

	private static final String MARCADOR_LINHA_ITEM = "{{FACTS:ITEM_NUMERO}}";

	private static final NumberFormat MOEDA_BR = NumberFormat.getCurrencyInstance(new Locale("pt", "BR"));

	// Data de geração por extenso (ex.: "12 de setembro de 2026") — preenche o bloco de
	// assinatura ("[Local], {{FACTS:DATA_GERACAO_EXTENSO}}.") automaticamente, já que é um
	// fato que o sistema sempre conhece (o momento da geração), sem motivo para ficar
	// pendente. "[Local]" continua em aberto — o sistema não sabe a cidade de assinatura.
	private static final DateTimeFormatter DATA_EXTENSO_BR = DateTimeFormatter.ofPattern("d 'de' MMMM 'de' yyyy", new Locale("pt", "BR"));

	@Autowired
	private DocxTemplateEngine engine;

	/** Preenche, no documento já aberto, todos os tokens {{FACTS:*}} a partir do processo. */
	public void preencherFatos(XWPFDocument doc, ProcessoContratacao processo) {
		Map<String, String> facts = construirFactsGerais(processo);
		engine.substituirEmDocumento(doc.getParagraphs(), doc.getTables(), facts);

		List<Map<String, String>> linhasItens = construirFactsItens(processo.getItens());
		for (XWPFTable tabela : doc.getTables()) {
			engine.preencherTabelaRepetida(tabela, MARCADOR_LINHA_ITEM, linhasItens);
		}
	}

	private Map<String, String> construirFactsGerais(ProcessoContratacao processo) {
		Map<String, String> facts = new LinkedHashMap<>();
		facts.put("{{FACTS:OBJETO}}", vazioSeNulo(processo.getObjeto()));
		facts.put("{{FACTS:DATA_GERACAO_EXTENSO}}", DATA_EXTENSO_BR.format(LocalDate.now()));

		BigDecimal valorTotalEstimado = processo.getItens().stream()
				.map(ItemProcessoContratacao::getValorTotal)
				.filter(v -> v != null)
				.reduce(BigDecimal.ZERO, BigDecimal::add);

		facts.put("{{FACTS:VALOR_TOTAL_ESTIMADO}}", MOEDA_BR.format(valorTotalEstimado));
		facts.put("{{FACTS:VALOR_POR_EXTENSO}}", NumeroPorExtensoUtil.porExtensoReais(valorTotalEstimado));

		facts.put("{{FACTS:PRAZO_VIGENCIA_MESES}}",
				processo.getPrazoVigenciaMeses() == null ? "[indicar o prazo]" : processo.getPrazoVigenciaMeses().toString());

		facts.put("{{FACTS:DOTACAO_GESTAO_UNIDADE}}", vazioSeNaoInformado(processo.getDotacaoGestaoUnidade()));
		facts.put("{{FACTS:DOTACAO_FONTE_RECURSOS}}", vazioSeNaoInformado(processo.getDotacaoFonteRecursos()));
		facts.put("{{FACTS:DOTACAO_PROGRAMA_TRABALHO}}", vazioSeNaoInformado(processo.getDotacaoProgramaTrabalho()));
		facts.put("{{FACTS:DOTACAO_ELEMENTO_DESPESA}}", vazioSeNaoInformado(processo.getDotacaoElementoDespesa()));
		facts.put("{{FACTS:DOTACAO_PLANO_INTERNO}}", vazioSeNaoInformado(processo.getDotacaoPlanoInterno()));

		facts.put("{{FACTS:ORGAO_NOME}}", vazioSeNaoInformado(processo.getOrgaoNome()));
		facts.put("{{FACTS:ORGAO_CNPJ}}", vazioSeNaoInformado(processo.getOrgaoCnpj()));
		facts.put("{{FACTS:ORGAO_ENDERECO}}", vazioSeNaoInformado(processo.getOrgaoEndereco()));
		facts.put("{{FACTS:ORGAO_ESFERA}}", vazioSeNaoInformado(processo.getOrgaoEsfera()));
		facts.put("{{FACTS:ORGAO_UASG}}", vazioSeNaoInformado(processo.getOrgaoUasg()));
		facts.put("{{FACTS:ORGAO_TELEFONE}}", vazioSeNaoInformado(processo.getOrgaoTelefone()));

		facts.put("{{FACTS:MODALIDADE_NOME}}", nomeModalidade(processo));
		facts.put("{{FACTS:CRITERIO_JULGAMENTO_NOME}}", nomeCriterioJulgamento(processo));
		facts.put("{{FACTS:TRATAMENTO_ME_EPP_SIM_NAO}}",
				Boolean.TRUE.equals(processo.getTratamentoFavorecidoMeEpp()) ? "SIM" : "NÃO");

		return facts;
	}

	private String nomeModalidade(ProcessoContratacao processo) {
		if (processo.getModalidadePretendida() == null) {
			return "[A SER PREENCHIDO PELO ÓRGÃO]";
		}
		switch (processo.getModalidadePretendida()) {
			case CONCORRENCIA:
				return "CONCORRÊNCIA";
			case PREGAO:
				return "PREGÃO ELETRÔNICO";
			default:
				return "[A SER PREENCHIDO PELO ÓRGÃO]";
		}
	}

	private String nomeCriterioJulgamento(ProcessoContratacao processo) {
		if (processo.getCriterioJulgamento() == null) {
			return "[A SER PREENCHIDO PELO ÓRGÃO]";
		}
		String base;
		switch (processo.getCriterioJulgamento()) {
			case MENOR_PRECO:
				base = "menor preço";
				break;
			case MAIOR_DESCONTO:
				base = "maior desconto";
				break;
			case TECNICA_E_PRECO:
				base = "técnica e preço";
				break;
			default:
				base = "[A SER PREENCHIDO PELO ÓRGÃO]";
		}
		return processo.getItens().size() > 1 ? base + " por item" : base;
	}

	private List<Map<String, String>> construirFactsItens(List<ItemProcessoContratacao> itens) {
		List<Map<String, String>> linhas = new ArrayList<>();
		for (ItemProcessoContratacao item : itens) {
			Map<String, String> linha = new LinkedHashMap<>();
			linha.put("{{FACTS:ITEM_NUMERO}}", vazioSeNulo(item.getNumeroItem()));
			linha.put("{{FACTS:ITEM_DESCRICAO}}", vazioSeNulo(item.getDescricao()));
			linha.put("{{FACTS:ITEM_UNIDADE}}", vazioSeNulo(item.getUnidadeFornecimento()));
			linha.put("{{FACTS:ITEM_QUANTIDADE}}", item.getQuantidade() == null ? "" : item.getQuantidade().toString());
			linha.put("{{FACTS:ITEM_VALOR_UNITARIO}}", item.getValorUnitario() == null ? "" : MOEDA_BR.format(item.getValorUnitario()));
			linha.put("{{FACTS:ITEM_VALOR_TOTAL}}", item.getValorTotal() == null ? "" : MOEDA_BR.format(item.getValorTotal()));
			linhas.add(linha);
		}
		return linhas;
	}

	private String vazioSeNulo(String valor) {
		return valor == null ? "" : valor;
	}

	private String vazioSeNaoInformado(String valor) {
		// Trata string em branco ("") como não informado, não só null — o intake grava alguns
		// campos opcionais como "" em vez de deixar a coluna nula, e "Fonte de recursos: ;"
		// no documento final é exatamente o tipo de resíduo de template que o usuário reclamou.
		return valor == null || valor.isBlank() ? "[A SER PREENCHIDO PELO ÓRGÃO]" : valor;
	}

}
