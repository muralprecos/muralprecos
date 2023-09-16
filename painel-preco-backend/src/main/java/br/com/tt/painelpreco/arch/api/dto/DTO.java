package br.com.tt.painelpreco.arch.api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public abstract class DTO {
	
	@JsonInclude(Include.NON_NULL)
	@JsonProperty("id")
	protected String uuid;

}
