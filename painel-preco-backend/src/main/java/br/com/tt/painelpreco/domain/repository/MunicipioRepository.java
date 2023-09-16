package br.com.tt.painelpreco.domain.repository;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import br.com.tt.painelpreco.domain.model.Municipio;

public interface MunicipioRepository extends JpaRepository<Municipio, Integer> {

	@Query("SELECT m FROM Municipio m WHERE m.uf.uuid = :uuid")
	Page<Municipio> findAllByUF(UUID uuid, Pageable pageable);
	
}
