package br.com.tt.painelpreco.domain.service;

import java.util.UUID;

import javax.transaction.Transactional;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import br.com.tt.painelpreco.api.dto.UsuarioDTO;
import br.com.tt.painelpreco.api.dto.form.CadastroForm;
import br.com.tt.painelpreco.api.dto.form.UsuarioForm;
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
		usuario.setAtivo(true);

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

	public Page<Usuario> listarUsuarios(Pageable pageable) {
		log.debug("Listando usuários - página: {}, tamanho: {}", pageable.getPageNumber(), pageable.getPageSize());
		return usuarioRepository.findAll(pageable);
	}

	public Usuario buscarUsuario(String usuarioId) {
		if (usuarioId == null || usuarioId.trim().isEmpty()) {
			log.warn("Identificador de usuário é null ou vazio");
			return null;
		}

		// Tenta primeiro como UUID
		try {
			UUID uuid = UUID.fromString(usuarioId);
			Usuario usuario = usuarioRepository.findByUuid(uuid);
			if (usuario != null) {
				log.debug("Usuário encontrado por UUID: {}", uuid);
				return usuario;
			}
		} catch (IllegalArgumentException e) {
			// Não é um UUID válido, tenta como ID sequencial
			log.debug("Identificador '{}' não é um UUID válido, tentando como ID sequencial", usuarioId);
		}

		// Tenta como ID sequencial
		try {
			Integer id = Integer.parseInt(usuarioId);
			return usuarioRepository.findById(id).orElse(null);
		} catch (NumberFormatException e) {
			log.warn("Identificador '{}' não é nem UUID nem ID sequencial válido", usuarioId);
			return null;
		}
	}

	@Transactional
	public Usuario atualizarUsuario(String usuarioId, UsuarioForm form) {
		log.info("Iniciando atualização de usuário: {}", usuarioId);

		Usuario usuario = buscarUsuario(usuarioId);
		if (usuario == null) {
			throw new ArchException("Usuário não encontrado com identificador: " + usuarioId);
		}

		validarDadosAtualizacao(form, usuario);

		// Preparar dados para atualização no Keycloak
		String email = form.getEmail() != null ? form.getEmail() : usuario.getEmail();
		String firstName = null;
		String lastName = null;
		Boolean enabled = form.getEnabled();

		if (form.getFirstName() != null || form.getLastName() != null) {
			// Buscar dados atuais do Keycloak para obter firstName e lastName
			try {
				JSONObject keycloakUser = keycloakAdminService.buscarUsuarioPorId(usuario.getUuid().toString());
				if (keycloakUser != null) {
					firstName = form.getFirstName() != null ? form.getFirstName() : keycloakUser.optString("firstName", "");
					lastName = form.getLastName() != null ? form.getLastName() : keycloakUser.optString("lastName", "");
				}
			} catch (Exception e) {
				log.warn("Erro ao buscar dados do Keycloak, usando dados do banco: {}", e.getMessage());
				// Se não conseguir buscar do Keycloak, tenta dividir o nome do banco
				String[] nomeParts = usuario.getNome().split(" ", 2);
				firstName = form.getFirstName() != null ? form.getFirstName() : (nomeParts.length > 0 ? nomeParts[0] : "");
				lastName = form.getLastName() != null ? form.getLastName() : (nomeParts.length > 1 ? nomeParts[1] : "");
			}
		}

		// Atualizar usuário no Keycloak
		try {
			keycloakAdminService.atualizarUsuario(usuario.getUuid().toString(), email, firstName, lastName, enabled);
			log.info("Usuário atualizado no Keycloak: {}", usuario.getUuid());
		} catch (Exception e) {
			log.error("Erro ao atualizar usuário no Keycloak: {}", e.getMessage());
			throw new ArchException("Falha ao atualizar usuário no Keycloak: " + e.getMessage(), e);
		}

		// Atualizar senha se fornecida
		if (form.getPassword() != null && !form.getPassword().trim().isEmpty()) {
			try {
				keycloakAdminService.atualizarSenhaUsuario(usuario.getUuid().toString(), form.getPassword());
				log.info("Senha do usuário atualizada no Keycloak");
			} catch (Exception e) {
				log.error("Erro ao atualizar senha no Keycloak: {}", e.getMessage());
				throw new ArchException("Falha ao atualizar senha no Keycloak: " + e.getMessage(), e);
			}
		}

		// Verificar se organização mudou
		Organizacao organizacaoAntiga = usuario.getOrganizacao();
		Organizacao organizacaoNova = null;
		if (form.getOrganizacaoId() != null && !form.getOrganizacaoId().trim().isEmpty()) {
			organizacaoNova = buscarOrganizacao(form.getOrganizacaoId());
			if (organizacaoNova == null) {
				throw new ArchException("Organização não encontrada com identificador: " + form.getOrganizacaoId());
			}
		}

		// Se organização mudou, atualizar no Keycloak
		if (organizacaoNova != null && (organizacaoAntiga == null
				|| !organizacaoAntiga.getUuid().equals(organizacaoNova.getUuid()))) {
			try {
				// Remover do group antigo
				if (organizacaoAntiga != null) {
					keycloakAdminService.removerUsuarioDoGroup(usuario.getUuid().toString(),
							organizacaoAntiga.getUuid().toString());
					log.info("Usuário removido do group antigo: {}", organizacaoAntiga.getUuid());
				}
				// Adicionar ao group novo
				keycloakAdminService.adicionarUsuarioAoGroup(usuario.getUuid().toString(),
						organizacaoNova.getUuid().toString());
				log.info("Usuário adicionado ao group novo: {}", organizacaoNova.getUuid());
			} catch (Exception e) {
				log.error("Erro ao atualizar group do usuário no Keycloak: {}", e.getMessage());
				log.warn("Usuário atualizado no Keycloak mas group não foi atualizado");
			}
		}

		// Atualizar no banco local
		if (email != null && !email.equals(usuario.getEmail())) {
			usuario.setEmail(email);
		}
		if (firstName != null && lastName != null) {
			usuario.setNome(firstName + " " + lastName);
		}
		if (organizacaoNova != null) {
			usuario.setOrganizacao(organizacaoNova);
		}

		try {
			usuario = usuarioRepository.save(usuario);
			log.info("Usuário atualizado no banco de dados com ID: {}", usuario.getId());
			return usuario;
		} catch (Exception e) {
			log.error("Erro ao atualizar usuário no banco de dados: {}", e.getMessage());
			throw new ArchException("Falha ao atualizar usuário no banco de dados: " + e.getMessage(), e);
		}
	}

	@Transactional
	public Usuario desativarUsuario(String usuarioId) {
		log.info("Iniciando desativação de usuário: {}", usuarioId);

		Usuario usuario = buscarUsuario(usuarioId);
		if (usuario == null) {
			throw new ArchException("Usuário não encontrado com identificador: " + usuarioId);
		}

		usuario.setAtivo(false);
		usuario = usuarioRepository.save(usuario);
		log.info("Usuário desativado no banco de dados com ID: {}", usuario.getId());

		try {
			keycloakAdminService.desativarUsuario(usuario.getUuid().toString());
			log.info("Usuário desativado no Keycloak: {}", usuario.getUuid());
		} catch (Exception e) {
			log.warn("Erro ao desativar usuário no Keycloak (banco já atualizado): {}", e.getMessage());
		}

		return usuario;
	}

	@Transactional
	public Usuario reativarUsuario(String usuarioId) {
		log.info("Iniciando reativação de usuário: {}", usuarioId);

		Usuario usuario = buscarUsuario(usuarioId);
		if (usuario == null) {
			throw new ArchException("Usuário não encontrado com identificador: " + usuarioId);
		}

		if (Boolean.TRUE.equals(usuario.getAtivo())) {
			throw new ArchException("Usuário já está ativo: " + usuarioId);
		}

		usuario.setAtivo(true);
		usuario = usuarioRepository.save(usuario);
		log.info("Usuário reativado no banco de dados com ID: {}", usuario.getId());

		try {
			keycloakAdminService.ativarUsuario(usuario.getUuid().toString());
			log.info("Usuário reativado no Keycloak: {}", usuario.getUuid());
		} catch (Exception e) {
			log.warn("Erro ao reativar usuário no Keycloak (banco já atualizado): {}", e.getMessage());
		}

		return usuario;
	}

	public UsuarioDTO buscarDetalhesUsuario(String usuarioId) {
		log.debug("Buscando detalhes de usuário: {}", usuarioId);

		Usuario usuario = buscarUsuario(usuarioId);
		if (usuario == null) {
			return null;
		}

		UsuarioDTO dto = new UsuarioDTO();
		dto.setId(usuario.getId());
		dto.setUuid(usuario.getUuid());
		dto.setLogin(usuario.getLogin());
		dto.setNome(usuario.getNome());
		dto.setEmail(usuario.getEmail());
		dto.setAtivo(usuario.getAtivo());
		dto.setDataCriacao(usuario.getDataCriacao());
		if (usuario.getOrganizacao() != null) {
			dto.setOrganizacaoId(usuario.getOrganizacao().getId());
			dto.setOrganizacaoNome(usuario.getOrganizacao().getNome());
		}

		// Verificar presença no Keycloak
		try {
			JSONObject keycloakUser = keycloakAdminService.buscarUsuarioPorId(usuario.getUuid().toString());
			if (keycloakUser != null) {
				dto.setKeycloakNaoEncontrado(false);
			} else {
				log.warn("Usuário do Keycloak não encontrado para o UUID: {}", usuario.getUuid());
				dto.setKeycloakNaoEncontrado(true);
			}
		} catch (Exception e) {
			log.warn("Erro ao buscar usuário no Keycloak: {}", e.getMessage());
			dto.setKeycloakNaoEncontrado(true);
		}

		return dto;
	}

	private void validarDadosAtualizacao(UsuarioForm form, Usuario usuarioExistente) {
		// Validar email único (exceto o próprio usuário)
		if (form.getEmail() != null && !form.getEmail().equalsIgnoreCase(usuarioExistente.getEmail())) {
			if (emailExiste(form.getEmail())) {
				throw new ArchException("Email já cadastrado: " + form.getEmail());
			}

			if (keycloakAdminService.emailExiste(form.getEmail())) {
				throw new ArchException("Email já cadastrado no sistema: " + form.getEmail());
			}
		}

		// Validar username único (exceto o próprio usuário)
		if (form.getUsername() != null && !form.getUsername().equals(usuarioExistente.getLogin())) {
			if (loginExiste(form.getUsername())) {
				throw new ArchException("Login já cadastrado: " + form.getUsername());
			}

			if (keycloakAdminService.usernameExiste(form.getUsername())) {
				throw new ArchException("Login já cadastrado no sistema: " + form.getUsername());
			}
		}

		// Validar organização existe (se fornecida)
		if (form.getOrganizacaoId() != null && !form.getOrganizacaoId().trim().isEmpty()) {
			Organizacao org = buscarOrganizacao(form.getOrganizacaoId());
			if (org == null) {
				throw new ArchException("Organização não encontrada com identificador: " + form.getOrganizacaoId());
			}
		}
	}

}
