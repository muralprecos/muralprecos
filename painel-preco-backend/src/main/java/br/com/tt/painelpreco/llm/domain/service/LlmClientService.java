package br.com.tt.painelpreco.llm.domain.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import br.com.tt.painelpreco.arch.exception.ArchException;
import br.com.tt.painelpreco.llm.api.LlmClient;
import br.com.tt.painelpreco.llm.api.dto.ChatCompletionRequest;
import br.com.tt.painelpreco.llm.api.dto.ChatCompletionResponse;
import br.com.tt.painelpreco.llm.api.dto.ChatMessage;
import br.com.tt.painelpreco.llm.api.dto.ResponseFormat;

/**
 * Ponto único de acesso ao provedor de LLM configurado (OpenAI, DeepSeek ou
 * qualquer outro compatível com o formato de Chat Completions — ver
 * {@code llm.api.*} em application.properties). Nenhuma chamada à IA no
 * restante do backend deve montar a requisição HTTP diretamente; sempre
 * passar por aqui.
 */
@Service
public class LlmClientService {

	@Value("${llm.api.key}")
	private String apiKey;

	@Value("${llm.api.model}")
	private String model;

	@Autowired
	private LlmClient llmClient;

	/**
	 * @param systemPrompt instrução de sistema (papel/regras do assistente); pode ser null.
	 * @param userPrompt   conteúdo da mensagem do usuário — deve conter APENAS os fatos
	 *                     relevantes para a tarefa (nunca dados de outro processo/organização).
	 * @param temperature  0.0–1.0; use valores baixos (ex.: 0.0–0.2) para seleção de
	 *                     cláusula (tarefa de classificação, não de criatividade).
	 * @param modoJson     true para pedir resposta estruturada em JSON (usado na seleção de cláusulas).
	 * @return o texto da resposta do modelo.
	 */
	public String completar(String systemPrompt, String userPrompt, double temperature, boolean modoJson) {
		List<ChatMessage> messages = new ArrayList<>();
		if (systemPrompt != null && !systemPrompt.isBlank()) {
			messages.add(new ChatMessage("system", systemPrompt));
		}
		messages.add(new ChatMessage("user", userPrompt));

		ChatCompletionRequest request = new ChatCompletionRequest(
				model, messages, temperature, modoJson ? ResponseFormat.jsonObject() : null);

		ChatCompletionResponse response = llmClient.createChatCompletion("Bearer " + apiKey, request);
		String conteudo = response.getPrimeiroConteudo();
		if (conteudo == null || conteudo.isBlank()) {
			throw new ArchException("Resposta vazia do provedor de LLM.");
		}
		return conteudo;
	}

}
