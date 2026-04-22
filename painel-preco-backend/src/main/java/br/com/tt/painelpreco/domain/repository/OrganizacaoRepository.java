package br.com.tt.painelpreco.domain.repository;

import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.com.tt.painelpreco.arch.infra.auth.Organizacao;

public interface OrganizacaoRepository
		extends JpaRepository<Organizacao, Integer>, JpaSpecificationExecutor<Organizacao> {

	@Transactional
	@Modifying
	@Query(nativeQuery = true, value = "UPDATE mural.organizacao SET logo = :logo, nome = :nome WHERE id_organizacao = :idOrganizacao")
	void updateLogo(@Param("idOrganizacao") Integer idOrganizacao, @Param("logo") byte[] logo,
			@Param("nome") String nome);

	Organizacao findByUuid(UUID uuid);

	Organizacao findByNome(String nome);

}
