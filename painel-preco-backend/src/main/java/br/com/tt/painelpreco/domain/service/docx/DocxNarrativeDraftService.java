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
 * Passo C, exclusivo do ETP: redação restrita por IA para as seções que
 * genuinamente precisam de síntese textual (não se reduzem a uma escolha
 * entre alternativas pré-escritas, como no {@link DocxClauseSelectionService}
 * do TR). A IA REDIGE, mas só com base nos fatos fornecidos explicitamente —
 * nunca deve inventar número, prazo ou circunstância não informada; quando
 * faltar dado necessário, o próprio texto deve indicar
 * "[A SER PREENCHIDO PELO ÓRGÃO]" em vez de presumir algo plausível.
 */
@Service
public class DocxNarrativeDraftService {

	private static final String SYSTEM_PROMPT =
			"Você é um assistente técnico especializado em elaboração de Estudos Técnicos Preliminares (ETP) "
			+ "para licitações públicas, sob a Lei nº 14.133/2021. Redija de forma objetiva, em linguagem técnica "
			+ "formal, o trecho solicitado. REGRA ABSOLUTA: baseie-se exclusivamente nos fatos fornecidos abaixo — "
			+ "nunca invente número, prazo, fornecedor, justificativa técnica ou qualquer circunstância que não "
			+ "tenha sido informada. Se um dado necessário para completar o texto não foi fornecido, escreva "
			+ "literalmente '[A SER PREENCHIDO PELO ÓRGÃO]' no lugar dele, em vez de presumir algo plausível. "
			+ "Responda APENAS com o texto final do trecho (sem repetir o título da seção, sem comentários).";

	private static final NumberFormat MOEDA_BR = NumberFormat.getCurrencyInstance(new Locale("pt", "BR"));

	@Autowired
	private LlmClientService llmClientService;

	@Autowired
	private DocxTemplateEngine engine;

	@Autowired
	private ObjectMapper objectMapper;

	public List<ArtefatoSecaoLog> preencherRedacaoLivreEtp(XWPFDocument doc, ProcessoContratacao processo, ArtefatoGerado artefato) {
		String fatosJson = escreverJson(fatosComuns(processo));

		List<ArtefatoSecaoLog> logs = new ArrayList<>();
		logs.add(redigir(doc, artefato, "NECESSIDADE", fatosJson,
				"Redija a descrição da necessidade da contratação (por que ela é necessária), com base no objeto e na justificativa informados."));
		logs.add(redigir(doc, artefato, "LEVANTAMENTO_MERCADO", fatosJson,
				"Redija o levantamento de mercado e a justificativa da escolha do tipo de solução, com base no objeto e nos itens pesquisados."));
		logs.add(redigir(doc, artefato, "DESCRICAO_SOLUCAO", fatosJson,
				"Redija a descrição da solução como um todo, considerando o ciclo de vida do objeto, com base no objeto e nos itens pesquisados."));
		logs.add(redigir(doc, artefato, "PARCELAMENTO", fatosJson,
				"Redija a justificativa para o parcelamento ou não da contratação, com base na quantidade e natureza dos itens pesquisados."));
		logs.add(redigir(doc, artefato, "RESULTADOS_PRETENDIDOS", fatosJson,
				"Redija os resultados pretendidos com a contratação, com base no objeto informado."));
		logs.add(redigir(doc, artefato, "POSICIONAMENTO_CONCLUSIVO", fatosJson,
				"Redija um posicionamento conclusivo sobre a viabilidade da contratação, encerrando com a recomendação de que o "
				+ "prosseguimento do processo está sujeito à revisão técnica e jurídica da equipe responsável do órgão."));

		return logs;
	}

	private ArtefatoSecaoLog redigir(XWPFDocument doc, ArtefatoGerado artefato, String chave, String fatosJson, String instrucao) {
		String userPrompt = "Fatos do processo (use APENAS estes fatos; não presuma nada além deles):\n" + fatosJson
				+ "\n\nTarefa: " + instrucao;

		String textoRedigido = llmClientService.completar(SYSTEM_PROMPT, userPrompt, 0.2, false);

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

	private Map<String, Object> fatosComuns(ProcessoContratacao processo) {
		Map<String, Object> fatos = new LinkedHashMap<>();
		fatos.put("objeto", processo.getObjeto());
		fatos.put("justificativaNecessidade", processo.getJustificativaNecessidade());

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

	private String escreverJson(Map<String, Object> fatos) {
		try {
			return objectMapper.writeValueAsString(fatos);
		} catch (Exception e) {
			throw new ArchException("Falha ao serializar fatos para a IA: " + e.getMessage(), e);
		}
	}

}
