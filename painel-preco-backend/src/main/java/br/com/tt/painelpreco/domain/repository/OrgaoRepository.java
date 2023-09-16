package br.com.tt.painelpreco.domain.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import br.com.tt.painelpreco.domain.model.Orgao;

public interface OrgaoRepository extends JpaRepository<Orgao, Integer> {
	
	@Query("SELECT o FROM Orgao o WHERE o.orgaoSuperior.uuid = :uuid")
	List<Orgao> findAllSubOrgaos(UUID uuid, Pageable pageable);
	
}
