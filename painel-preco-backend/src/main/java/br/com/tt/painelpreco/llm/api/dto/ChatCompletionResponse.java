package br.com.tt.painelpreco.llm.api.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ChatCompletionResponse {

	private String model;
	private List<ChatCompletionChoice> choices;

	public String getModel() {
		return model;
	}

	public void setModel(String model) {
		this.model = model;
	}

	public List<ChatCompletionChoice> getChoices() {
		return choices;
	}

	public void setChoices(List<ChatCompletionChoice> choices) {
		this.choices = choices;
	}

	/** Conveniência: conteúdo textual da primeira resposta, ou null se não houver nenhuma. */
	public String getPrimeiroConteudo() {
		if (choices == null || choices.isEmpty() || choices.get(0).getMessage() == null) {
			return null;
		}
		return choices.get(0).getMessage().getContent();
	}

}
