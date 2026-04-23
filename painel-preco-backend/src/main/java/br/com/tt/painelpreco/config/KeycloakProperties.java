package br.com.tt.painelpreco.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.Getter;

/**
 * Centraliza as propriedades compartilhadas de configuração do Keycloak,
 * evitando duplicidade de @Value entre AuthController e KeycloakAdminService.
 */
@Getter
@Component
public class KeycloakProperties {

	@Value("${keycloak.auth-server-url}")
	private String authServerUrl;

	@Value("${keycloak.realm}")
	private String realm;

	@Value("${keycloak.resource}")
	private String clientId;

	@Value("${keycloak.credentials.secret}")
	private String clientSecret;

}
