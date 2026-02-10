package br.com.tt.painelpreco.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import br.com.tt.painelpreco.domain.model.Municipio;

public interface MunicipioRepository extends JpaRepository<Municipio, Integer>, JpaSpecificationExecutor<Municipio> {

	boolean existsByCodigoIbge(String codigoIbge);

	Municipio findByCodigoIbge(String codigoIbge);
}
