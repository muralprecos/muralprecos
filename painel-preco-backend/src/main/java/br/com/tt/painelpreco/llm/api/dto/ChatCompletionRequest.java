package br.com.tt.painelpreco.llm.api.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Corpo de requisição do endpoint /chat/completions — formato compartilhado
 * pela OpenAI e pelo DeepSeek (e demais provedores compatíveis). Trocar de
 * provedor é só mudar a config (llm.api.base-url/model/key), nunca este DTO.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ChatCompletionRequest {

	private String model;
	private List<ChatMessage> messages;
	private Double temperature;

	@JsonProperty("response_format")
	private ResponseFormat responseFormat;

	public ChatCompletionRequest() {
	}

	public ChatCompletionRequest(String model, List<ChatMessage> messages, Double temperature, ResponseFormat responseFormat) {
		this.model = model;
		this.messages = messages;
		this.temperature = temperature;
		this.responseFormat = responseFormat;
	}

	public String getModel() {
		return model;
	}

	public void setModel(String model) {
		this.model = model;
	}

	public List<ChatMessage> getMessages() {
		return messages;
	}

	public void setMessages(List<ChatMessage> messages) {
		this.messages = messages;
	}

	public Double getTemperature() {
		return temperature;
	}

	public void setTemperature(Double temperature) {
		this.temperature = temperature;
	}

	public ResponseFormat getResponseFormat() {
		return responseFormat;
	}

	public void setResponseFormat(ResponseFormat responseFormat) {
		this.responseFormat = responseFormat;
	}

}
