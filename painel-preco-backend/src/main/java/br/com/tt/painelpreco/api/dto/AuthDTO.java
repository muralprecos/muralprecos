package br.com.tt.painelpreco.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import br.com.tt.painelpreco.arch.api.dto.DTO;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthDTO extends DTO {
	
	@JsonProperty("access_token")
	private String accessToken;
	
	@JsonProperty("expires_in")
	private Integer expiresIn;
	
	@JsonProperty("refresh_expires_in")
	private Integer refreshExpiresIn;
	
	@JsonProperty("refresh_token")
	private String refreshToken;
	
	@JsonProperty("token_type")
	private String tokenType;
	
	@JsonProperty("not-before-policy")
	private Integer notBeforePolicy;
	
	@JsonProperty("session_state")
	private String sessionState;
	
	@JsonProperty("scope")
	private String scope;

}
