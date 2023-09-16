package br.com.tt.painelpreco.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import br.com.tt.painelpreco.util.ApiVersion;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.OAuthFlow;
import io.swagger.v3.oas.annotations.security.OAuthFlows;
import io.swagger.v3.oas.annotations.security.OAuthScope;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

@Configuration
@SecurityScheme(name = "security_auth",
	type = SecuritySchemeType.OAUTH2,
	flows = @OAuthFlows(password = @OAuthFlow(
			authorizationUrl = "http://localhost:8280",
			tokenUrl = "http://localhost:8280/realms/ttsolutions/protocol/openid-connect/token",
			scopes = {
					@OAuthScope(name = "READ", description = "read scope")
			}
	)))
public class SpringDocConfig {
	
	@Value("${keycloak.auth-server-url}")
	private static String ssoUrl;
	
	@Bean
	OpenAPI openAPI() {
		return new OpenAPI()
				.info(new Info()
						.title("Painel de Compras")
						.version(ApiVersion.LATEST)
						.description("API do Painel de Compras da TT Soluções PI")
				)
				.externalDocs(new ExternalDocumentation()
						.description("Instruções de execução da API")
						.url("https://github.com/TTSolutionsPI/painel-preco-backend"));
	}

}
