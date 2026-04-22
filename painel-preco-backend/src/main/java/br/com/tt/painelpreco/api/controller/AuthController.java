package br.com.tt.painelpreco.api.controller;

import javax.annotation.PostConstruct;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.tt.painelpreco.api.dto.AuthDTO;
import br.com.tt.painelpreco.api.dto.CadastroDTO;
import br.com.tt.painelpreco.api.dto.form.AuthForm;
import br.com.tt.painelpreco.api.dto.form.CadastroForm;
import br.com.tt.painelpreco.api.dto.form.LogoutForm;
import br.com.tt.painelpreco.api.dto.form.RefreshForm;
import br.com.tt.painelpreco.arch.api.controller.HttpClientController;
import br.com.tt.painelpreco.arch.exception.ArchException;
import br.com.tt.painelpreco.arch.infra.auth.Usuario;
import br.com.tt.painelpreco.arch.view.http.Body;
import br.com.tt.painelpreco.arch.view.http.ContentType;
import br.com.tt.painelpreco.arch.view.http.GrantType;
import br.com.tt.painelpreco.arch.view.http.Header;
import br.com.tt.painelpreco.arch.view.http.HttpResponse;
import br.com.tt.painelpreco.arch.view.http.QueryParam;
import br.com.tt.painelpreco.arch.view.http.exception.HttpException;
import br.com.tt.painelpreco.config.KeycloakProperties;
import br.com.tt.painelpreco.domain.service.UsuarioService;
import br.com.tt.painelpreco.util.ApiVersion;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping(ApiVersion.LATEST + "/auth")
public class AuthController extends HttpClientController {

	public static final String KEYCLOAK_AUTHETICATE_URL = "%s/realms/%s/protocol/openid-connect/token";
	public static final String KEYCLOAK_REVOKE_URL = "%s/realms/%s/protocol/openid-connect/revoke";

	@Autowired
	private KeycloakProperties keycloakProperties;

	@Autowired
	private UsuarioService usuarioService;

	private String authenticationUrl;
	private String revokeUrl;

	@PostConstruct
	public void init() {
		this.authenticationUrl = String.format(AuthController.KEYCLOAK_AUTHETICATE_URL, keycloakProperties.getAuthServerUrl(), keycloakProperties.getRealm());
		this.revokeUrl = String.format(AuthController.KEYCLOAK_REVOKE_URL, keycloakProperties.getAuthServerUrl(), keycloakProperties.getRealm());
	}

	@PostMapping(value = "/logon", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
	public ResponseEntity<AuthDTO> auth(AuthForm authForm) {
		String errorMsg = "Autenticação falhou. %s";
		try {
			AuthDTO authDTO = authenticate(authForm);

			// Verificar status do usuário e da organização no banco local
			br.com.tt.painelpreco.arch.infra.auth.Usuario usuario = usuarioService.findByLogin(authForm.getUsername());
			if (usuario != null) {
				if (Boolean.FALSE.equals(usuario.getAtivo())) {
					throw new ArchException("Usuário desativado. Contate o administrador.");
				}
				if (usuario.getOrganizacao() != null && Boolean.FALSE.equals(usuario.getOrganizacao().getAtivo())) {
					throw new ArchException("Organização desativada. Contate o administrador.");
				}
			}

			return ResponseEntity.ok(authDTO);
		} catch (HttpException e) {
			if (e.isAcessoNegado())
				throw new HttpException("Autenticação falhou. Usuário ou senha inválidos.");

			throw new ArchException(String.format(errorMsg, e.getMessage()));
		} catch (Exception e) {
			throw new ArchException(String.format(errorMsg, e.getMessage()));
		}
	}

	@PostMapping(value = "/cadastro", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<CadastroDTO> cadastro(@Valid @RequestBody CadastroForm form) {
		try {
			// Validação adicional: verifica se organizacaoId foi informado
			if (form.getOrganizacaoId() == null || form.getOrganizacaoId().trim().isEmpty()) {
				throw new ArchException("Campo 'organizacaoId' é obrigatório. Use 'organizacaoId' (não 'organizacaoUuid')");
			}

			Usuario usuario = usuarioService.criarUsuario(form);

			CadastroDTO dto = new CadastroDTO();
			dto.setUuid(usuario.getUuid().toString());
			dto.setUsername(usuario.getLogin());
			dto.setEmail(usuario.getEmail());
			dto.setNome(usuario.getNome());
			dto.setOrganizacaoNome(usuario.getOrganizacao() != null ? usuario.getOrganizacao().getNome() : null);
			dto.setMessage("Usuário cadastrado com sucesso");

			return ResponseEntity.status(HttpStatus.CREATED).body(dto);
		} catch (ArchException e) {
			// Re-lança exceções de negócio (validações, etc)
			throw e;
		} catch (Exception e) {
			throw new ArchException(
					"Erro ao cadastrar usuário: " + (e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName()), e);
		}
	}

	private AuthDTO authenticate(AuthForm authForm) {
		Header header = new Header();
		header.setContentType(ContentType.APPLICATION_FORM_URLENCODED);

		Body body = new Body();
		body.add(Body.CLIENT_ID_KEY, keycloakProperties.getClientId())
				.add(Body.CLIENT_SECRET, keycloakProperties.getClientSecret())
				.add(Body.GRANT_TYPE_KEY, GrantType.PASSWORD.getName())
				.add(Body.USERNAME_KEY, authForm.getUsername())
				.add(Body.PASSWORD_KEY, authForm.getPassword());

		HttpResponse response = super.requestPost(header, body, QueryParam.NONE, authenticationUrl);
		AuthDTO authDTO = response.toDTO(AuthDTO.class);
		return authDTO;
	}

	@PostMapping(value = "/refresh", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
	public ResponseEntity<AuthDTO> refresh(RefreshForm refreshForm) {
		log.debug("Renovando token via refresh_token");
		try {
			Header header = new Header();
			header.setContentType(ContentType.APPLICATION_FORM_URLENCODED);

			Body body = new Body();
			body.add(Body.GRANT_TYPE_KEY, "refresh_token")
				.add("refresh_token", refreshForm.getRefresh_token())
				.add(Body.CLIENT_ID_KEY, keycloakProperties.getClientId())
				.add(Body.CLIENT_SECRET, keycloakProperties.getClientSecret());

			HttpResponse response = super.requestPost(header, body, QueryParam.NONE, authenticationUrl);
			AuthDTO authDTO = response.toDTO(AuthDTO.class);
			return ResponseEntity.ok(authDTO);
		} catch (HttpException e) {
			log.warn("Refresh token inválido ou expirado: {}", e.getMessage());
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		} catch (Exception e) {
			throw new ArchException("Falha ao renovar token: " + e.getMessage(), e);
		}
	}

	@PostMapping(value = "/logout", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
	public ResponseEntity<Void> logout(LogoutForm logoutForm) {
		log.debug("Revogando refresh_token no Keycloak");
		try {
			Header header = new Header();
			header.setContentType(ContentType.APPLICATION_FORM_URLENCODED);

			Body body = new Body();
			body.add("token", logoutForm.getRefresh_token())
					.add("token_type_hint", "refresh_token")
					.add(Body.CLIENT_ID_KEY, keycloakProperties.getClientId())
					.add(Body.CLIENT_SECRET, keycloakProperties.getClientSecret());

			try {
				super.requestPost(header, body, QueryParam.NONE, revokeUrl);
			} catch (Exception e) {
				// Keycloak retorna 200 com body vazio para revogação bem-sucedida;
				// o parser pode lançar exceção ao tentar processar body vazio — ignoramos.
				log.debug("Revogação concluída (resposta pode estar vazia): {}", e.getMessage());
			}
		} catch (Exception e) {
			log.warn("Erro ao revogar token no Keycloak: {}", e.getMessage());
		}
		return ResponseEntity.ok().build();
	}

}

