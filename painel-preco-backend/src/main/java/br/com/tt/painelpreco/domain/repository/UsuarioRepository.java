package br.com.tt.painelpreco.domain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.tt.painelpreco.arch.infra.auth.Organizacao;
import br.com.tt.painelpreco.arch.infra.auth.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

	Usuario findByLogin(String login);

	Usuario findByEmail(String email);

	Usuario findByUuid(java.util.UUID uuid);

	long countByOrganizacao(Organizacao organizacao);

	List<Usuario> findByOrganizacaoAndAtivo(Organizacao organizacao, Boolean ativo);

}
