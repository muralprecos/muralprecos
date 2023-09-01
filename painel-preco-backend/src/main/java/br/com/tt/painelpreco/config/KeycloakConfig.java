package br.com.tt.painelpreco.config;

import org.keycloak.adapters.springboot.KeycloakSpringBootConfigResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KeycloakConfig {
	
	 @Bean
	    protected KeycloakSpringBootConfigResolver keycloakConfigResolver() {
	        return new KeycloakSpringBootConfigResolver();
	    }

}
