package br.com.tt.painelpreco.llm.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/** {"type": "json_object"} — pedido de resposta em modo JSON, usado na seleção de cláusulas. */
@JsonIgnoreProperties(ignoreUnknown = true)
public class ResponseFormat {

	private String type;

	public ResponseFormat() {
	}

	public ResponseFormat(String type) {
		this.type = type;
	}

	public static ResponseFormat jsonObject() {
		return new ResponseFormat("json_object");
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

}
