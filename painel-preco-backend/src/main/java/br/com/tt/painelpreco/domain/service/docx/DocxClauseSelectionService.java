package br.com.tt.painelpreco.domain.service.docx;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.tt.painelpreco.arch.exception.ArchException;
import br.com.tt.painelpreco.domain.model.ArtefatoGerado;
import br.com.tt.painelpreco.domain.model.ArtefatoSecaoLog;
import br.com.tt.painelpreco.domain.model.ArtefatoSecaoLog.OrigemEnum;
import br.com.tt.painelpreco.domain.model.ProcessoContratacao;
import br.com.tt.painelpreco.llm.domain.service.LlmClientService;

/**
 * Passo B da geração do Termo de Referência: para cada trecho do modelo AGU
 * com alternativas "OU" (marcado no template como {@code {{CLAUSE:CHAVE}}}),
 * pergunta à IA qual das opções pré-aprovadas se aplica ao processo — a IA
 * SÓ CLASSIFICA (responde o id de uma opção em JSON), nunca redige texto
 * novo. O texto inserido no documento é sempre o literal do catálogo
 * correspondente ao id retornado.
 *
 * Roda ANTES do Passo A ({@link DocxDeterministicFillService}): o texto de
 * uma cláusula pode ele próprio conter tokens {{FACTS:*}} (ex.: dotação
 * orçamentária), que só são resolvidos na passada de fatos seguinte.
 */
@Service
public class DocxClauseSelectionService {

	private static final String SYSTEM_PROMPT =
			"Você é um assistente jurídico especializado em licitações públicas (Lei nº 14.133/2021). "
			+ "Sua única tarefa é escolher, entre as opções de cláusula fornecidas, qual se aplica ao caso "
			+ "descrito nos fatos. As opções já foram redigidas e aprovadas previamente — você NUNCA cria "
			+ "ou reescreve texto, apenas classifica. Baseie-se exclusivamente nos fatos fornecidos, nunca "
			+ "presuma informação que não foi dada. Responda SOMENTE em JSON no formato "
			+ "{\"opcao\": \"ID_DA_OPCAO\"}, usando exatamente um dos ids de opção listados.";

	@Autowired
	private LlmClientService llmClientService;

	@Autowired
	private ClausulaCatalogoTR catalogoTR;

	@Autowired
	private ClausulaCatalogoEdital catalogoEdital;

	@Autowired
	private DocxTemplateEngine engine;

	@Autowired
	private ObjectMapper objectMapper;

	/** Resolve, no documento já aberto, todas as cláusulas {{CLAUSE:*}} do Termo de Referência. */
	public List<ArtefatoSecaoLog> preencherClausulasTR(XWPFDocument doc, ProcessoContratacao processo, ArtefatoGerado artefato) {
		List<ArtefatoSecaoLog> logs = new ArrayList<>();

		logs.add(selecionarClausula(doc, artefato, "CONTINUIDADE", catalogoTR.opcoesDe("CONTINUIDADE"), fatosContinuidade(processo)));
		logs.add(selecionarClausula(doc, artefato, "VIGENCIA", catalogoTR.opcoesDe("VIGENCIA"), fatosVigencia(processo)));
		logs.add(selecionarClausula(doc, artefato, "ORCAMENTO_SIGILO", catalogoTR.opcoesDe("ORCAMENTO_SIGILO"), fatosOrcamentoSigilo(processo)));
		logs.add(selecionarClausula(doc, artefato, "DOTACAO", catalogoTR.opcoesDe("DOTACAO"), fatosDotacao(processo)));

		return logs;
	}

	/** Resolve, no documento já aberto, todas as cláusulas {{CLAUSE:*}} do Edital. */
	public List<ArtefatoSecaoLog> preencherClausulasEdital(XWPFDocument doc, ProcessoContratacao processo, ArtefatoGerado artefato) {
		List<ArtefatoSecaoLog> logs = new ArrayList<>();

		logs.add(selecionarClausula(doc, artefato, "DIVISAO_ITENS", catalogoEdital.opcoesDe("DIVISAO_ITENS"), fatosDivisaoItens(processo)));
		logs.add(selecionarClausula(doc, artefato, "TRATAMENTO_ME_EPP", catalogoEdital.opcoesDe("TRATAMENTO_ME_EPP"), fatosTratamentoMeEpp(processo)));
		logs.add(selecionarClausula(doc, artefato, "ORCAMENTO_SIGILO", catalogoEdital.opcoesDe("ORCAMENTO_SIGILO"), fatosOrcamentoSigilo(processo)));

		return logs;
	}

	private ArtefatoSecaoLog selecionarClausula(XWPFDocument doc, ArtefatoGerado artefato, String chave, Map<String, String> opcoes, Map<String, Object> fatos) {
		String fatosJson = escreverJson(fatos);
		String userPrompt = montarPrompt(opcoes, fatosJson);

		String respostaBruta = llmClientService.completar(SYSTEM_PROMPT, userPrompt, 0.0, true);
		String opcaoEscolhida = extrairOpcao(respostaBruta, opcoes.keySet());
		String textoClausula = opcoes.get(opcaoEscolhida);

		Map<String, String> substituicao = Map.of("{{CLAUSE:" + chave + "}}", textoClausula);
		engine.substituirEmDocumento(doc.getParagraphs(), doc.getTables(), substituicao);

		ArtefatoSecaoLog log = new ArtefatoSecaoLog();
		log.setArtefatoGerado(artefato);
		log.setSecaoChave(chave);
		log.setOrigem(OrigemEnum.LLM_SELECAO_CLAUSULA);
		log.setClausulaSelecionada(opcaoEscolhida);
		log.setFactsEnviados(fatosJson);
		log.setRespostaBruta(respostaBruta);
		return log;
	}

	private String montarPrompt(Map<String, String> opcoes, String fatosJson) {
		StringBuilder sb = new StringBuilder();
		sb.append("Fatos do processo (use APENAS estes fatos; não presuma nada além deles):\n");
		sb.append(fatosJson).append("\n\n");
		sb.append("Opções disponíveis:\n");
		for (Map.Entry<String, String> opcao : opcoes.entrySet()) {
			sb.append("- id \"").append(opcao.getKey()).append("\": ").append(opcao.getValue()).append("\n");
		}
		sb.append("\nResponda em JSON com o id da opção escolhida.");
		return sb.toString();
	}

	private String extrairOpcao(String respostaBruta, java.util.Set<String> idsValidos) {
		try {
			SelecaoClausulaResposta resposta = objectMapper.readValue(respostaBruta, SelecaoClausulaResposta.class);
			if (resposta.getOpcao() == null || !idsValidos.contains(resposta.getOpcao())) {
				throw new ArchException("A IA retornou uma opção inválida: " + resposta.getOpcao());
			}
			return resposta.getOpcao();
		} catch (Exception e) {
			throw new ArchException("Falha ao interpretar a resposta da IA para seleção de cláusula: " + e.getMessage(), e);
		}
	}

	private String escreverJson(Map<String, Object> fatos) {
		try {
			return objectMapper.writeValueAsString(fatos);
		} catch (Exception e) {
			throw new ArchException("Falha ao serializar fatos para a IA: " + e.getMessage(), e);
		}
	}

	// ── Fatos estreitos por cláusula: só os campos relevantes para aquela decisão ──

	private Map<String, Object> fatosContinuidade(ProcessoContratacao processo) {
		Map<String, Object> fatos = new LinkedHashMap<>();
		fatos.put("tipoObjetoContinuo", processo.getTipoObjetoContinuo());
		return fatos;
	}

	private Map<String, Object> fatosVigencia(ProcessoContratacao processo) {
		Map<String, Object> fatos = new LinkedHashMap<>();
		fatos.put("fundamentoLegalPretendido", processo.getPrazoVigenciaFundamentoLegal());
		fatos.put("prazoVigenciaMeses", processo.getPrazoVigenciaMeses());
		return fatos;
	}

	private Map<String, Object> fatosOrcamentoSigilo(ProcessoContratacao processo) {
		Map<String, Object> fatos = new LinkedHashMap<>();
		fatos.put("orcamentoSigiloso", processo.getOrcamentoSigiloso());
		return fatos;
	}

	private Map<String, Object> fatosDotacao(ProcessoContratacao processo) {
		Map<String, Object> fatos = new LinkedHashMap<>();
		fatos.put("dotacaoPostergada", processo.getDotacaoPostergada());
		return fatos;
	}

	private Map<String, Object> fatosDivisaoItens(ProcessoContratacao processo) {
		Map<String, Object> fatos = new LinkedHashMap<>();
		fatos.put("quantidadeDeItensDistintos", processo.getItens().size());
		return fatos;
	}

	private Map<String, Object> fatosTratamentoMeEpp(ProcessoContratacao processo) {
		Map<String, Object> fatos = new LinkedHashMap<>();
		fatos.put("tratamentoFavorecidoMeEpp", processo.getTratamentoFavorecidoMeEpp());
		return fatos;
	}

	@JsonIgnoreProperties(ignoreUnknown = true)
	static class SelecaoClausulaResposta {
		private String opcao;

		public String getOpcao() {
			return opcao;
		}

		public void setOpcao(String opcao) {
			this.opcao = opcao;
		}
	}

}
