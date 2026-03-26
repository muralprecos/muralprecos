package br.com.tt.painelpreco.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.tt.painelpreco.domain.model.Esfera;
import br.com.tt.painelpreco.domain.model.Esfera.EsferaEnum;

public interface EsferaRepository extends JpaRepository<Esfera, Integer> {

	boolean existsByCodigo(EsferaEnum codigo);

	Esfera findByCodigo(EsferaEnum codigo);
	
}
