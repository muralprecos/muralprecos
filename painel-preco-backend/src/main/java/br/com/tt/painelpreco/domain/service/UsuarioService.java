package br.com.tt.painelpreco.domain.service;

import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.tt.painelpreco.api.dto.form.CadastroForm;
import br.com.tt.painelpreco.arch.exception.ArchException;
import br.com.tt.painelpreco.arch.infra.auth.Organizacao;
import br.com.tt.painelpreco.arch.infra.auth.Usuario;
import br.com.tt.painelpreco.domain.repository.OrganizacaoRepository;
import br.com.tt.painelpreco.domain.repository.UsuarioRepository;
import br.com.tt.painelpreco.security.keycloak.KeycloakAdminService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class UsuarioService {

	@Autowired
	private UsuarioRepository usuarioRepository;

	@Autowired
	private OrganizacaoRepository organizacaoRepository;

	@Autowired
	private KeycloakAdminService keycloakAdminService;

	public Usuario findByLogin(String login) {
		return usuarioRepository.findByLogin(login);
	}

	public Usuario findByEmail(String email) {
		return usuarioRepository.findByEmail(email);
	}

	public Usuario findByUuid(UUID uuid) {
		return usuarioRepository.findByUuid(uuid);
	}

	public boolean emailExiste(String email) {
		return findByEmail(email) != null;
	}

	public boolean loginExiste(String login) {
		return findByLogin(login) != null;
	}

	@Transactional
	public Usuario criarUsuario(CadastroForm form) {
		log.info("Iniciando cadastro de usuário: {}", form.getUsername());

		// Validações
		validarDadosCadastro(form);

		// Buscar organização (aceita UUID ou ID sequencial)
		Organizacao organizacao = buscarOrganizacao(form.getOrganizacaoId());
		if (organizacao == null) {
			throw new ArchException("Organização não encontrada com identificador: " + form.getOrganizacaoId());
		}

		// Criar usuário no Keycloak
		String keycloakUserId;
		try {
			keycloakUserId = keycloakAdminService.criarUsuario(
					form.getUsername(),
					form.getEmail(),
					form.getFirstName(),
					form.getLastName(),
					form.getPassword(),
					true,
					false);

			log.info("Usuário criado no Keycloak com ID: {}", keycloakUserId);
		} catch (Exception e) {
			log.error("Erro ao criar usuário no Keycloak: {}", e.getMessage());
			throw new ArchException("Falha ao criar usuário no Keycloak: " + e.getMessage(), e);
		}

		try {
			String groupId = organizacao.getUuid().toString();
			keycloakAdminService.adicionarUsuarioAoGroup(keycloakUserId, groupId);
			log.info("Usuário adicionado ao group {} no Keycloak", groupId);
		} catch (Exception e) {
			log.error("Erro ao adicionar usuário ao group no Keycloak: {}", e.getMessage());
			log.warn("Usuário criado no Keycloak mas não foi associado ao group. ID: {}", keycloakUserId);
		}

		Usuario usuario = new Usuario();
		usuario.setUuid(UUID.fromString(keycloakUserId));
		usuario.setLogin(form.getUsername());
		usuario.setNome(form.getFirstName() + " " + form.getLastName());
		usuario.setEmail(form.getEmail());
		usuario.setOrganizacao(organizacao);

		try {
			usuario = usuarioRepository.save(usuario);
			log.info("Usuário criado no banco de dados com ID: {}", usuario.getId());
			return usuario;
		} catch (Exception e) {
			log.error("Erro ao salvar usuário no banco de dados: {}", e.getMessage());
			throw new ArchException("Falha ao salvar usuário no banco de dados: " + e.getMessage(), e);
		}
	}

	private Organizacao buscarOrganizacao(String organizacaoId) {
		if (organizacaoId == null || organizacaoId.trim().isEmpty()) {
			log.warn("Identificador de organização é null ou vazio");
			return null;
		}

		// Tenta primeiro como UUID
		try {
			UUID uuid = UUID.fromString(organizacaoId);
			Organizacao org = organizacaoRepository.findByUuid(uuid);
			if (org != null) {
				return org;
			}
		} catch (IllegalArgumentException e) {
			// Não é um UUID válido, tenta como ID sequencial
			log.debug("Identificador '{}' não é um UUID válido, tentando como ID sequencial", organizacaoId);
		}

		// Tenta como ID sequencial
		try {
			Integer id = Integer.parseInt(organizacaoId);
			return organizacaoRepository.findById(id).orElse(null);
		} catch (NumberFormatException e) {
			log.warn("Identificador '{}' não é nem UUID nem ID sequencial válido", organizacaoId);
			return null;
		}
	}

	private void validarDadosCadastro(CadastroForm form) {
		if (emailExiste(form.getEmail())) {
			throw new ArchException("Email já cadastrado: " + form.getEmail());
		}

		if (keycloakAdminService.emailExiste(form.getEmail())) {
			throw new ArchException("Email já cadastrado no sistema: " + form.getEmail());
		}

		if (loginExiste(form.getUsername())) {
			throw new ArchException("Login já cadastrado: " + form.getUsername());
		}

		if (keycloakAdminService.usernameExiste(form.getUsername())) {
			throw new ArchException("Login já cadastrado no sistema: " + form.getUsername());
		}
	}

}
