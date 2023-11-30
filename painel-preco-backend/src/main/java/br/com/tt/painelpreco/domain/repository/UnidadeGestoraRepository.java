package br.com.tt.painelpreco.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import br.com.tt.painelpreco.domain.model.UnidadeGestora;

public interface UnidadeGestoraRepository extends JpaRepository<UnidadeGestora, Integer>, JpaSpecificationExecutor<UnidadeGestora> {
	
}
