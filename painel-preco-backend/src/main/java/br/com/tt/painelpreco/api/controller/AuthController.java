package br.com.tt.painelpreco.api.controller;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.tt.painelpreco.api.dto.AuthDTO;
import br.com.tt.painelpreco.api.dto.form.AuthForm;
import br.com.tt.painelpreco.arch.api.controller.HttpClientController;
import br.com.tt.painelpreco.arch.exception.ArchException;
import br.com.tt.painelpreco.arch.view.http.Body;
import br.com.tt.painelpreco.arch.view.http.ContentType;
import br.com.tt.painelpreco.arch.view.http.GrantType;
import br.com.tt.painelpreco.arch.view.http.Header;
import br.com.tt.painelpreco.arch.view.http.HttpResponse;
import br.com.tt.painelpreco.arch.view.http.QueryParam;
import br.com.tt.painelpreco.arch.view.http.exception.HttpException;
import br.com.tt.painelpreco.util.ApiVersion;

@RestController
@RequestMapping(ApiVersion.LATEST + "/auth")
public class AuthController extends HttpClientController {
	
public static final String KEYCLOAK_AUTHETICATE_URL = "%s/realms/%s/protocol/openid-connect/token";
	
	@Value("${keycloak.resource}")
	private String clientId;
	
	@Value("${keycloak.credentials.secret}")
	private String clientSecret;
	
	@Value("${keycloak.auth-server-url}")
	private String authServerUrl;
	
	@Value("${keycloak.realm}")
	private String realm;
	
	private String authenticationUrl;
	
	@PostConstruct
	public void init() {
		this.authenticationUrl = String.format(AuthController.KEYCLOAK_AUTHETICATE_URL, authServerUrl, realm);
	}

	@PostMapping(value = "/logon", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
	public ResponseEntity<AuthDTO> auth(AuthForm authForm) {
		String errorMsg = "Autenticação falhou. %s";
		try {
			return ResponseEntity.ok(authenticate(authForm));
		} catch (HttpException e) {
			if (e.isAcessoNegado())
				throw new HttpException("Autenticação falhou. Usuário ou senha inválidos.");
			
			throw new ArchException(String.format(errorMsg, e.getMessage()));
		} catch (Exception e) {
			throw new ArchException(String.format(errorMsg, e.getMessage()));
		}
	}

	private AuthDTO authenticate(AuthForm authForm) {
		Header header = new Header();
		header.setContentType(ContentType.APPLICATION_FORM_URLENCODED);
		
		Body body = new Body();
		body.add(Body.CLIENT_ID_KEY, clientId)
			.add(Body.CLIENT_SECRET, clientSecret)
			.add(Body.GRANT_TYPE_KEY, GrantType.PASSWORD.getName())
			.add(Body.USERNAME_KEY, authForm.getUsername())
			.add(Body.PASSWORD_KEY, authForm.getPassword());
		
		HttpResponse response = super.requestPost(header, body, QueryParam.NONE, authenticationUrl); 
		AuthDTO authDTO = response.toDTO(AuthDTO.class);
		return authDTO;
	}

}
