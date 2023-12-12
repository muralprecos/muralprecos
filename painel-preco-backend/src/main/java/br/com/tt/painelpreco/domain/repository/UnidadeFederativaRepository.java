package br.com.tt.painelpreco.domain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.tt.painelpreco.domain.model.UnidadeFederativa;

public interface UnidadeFederativaRepository extends JpaRepository<UnidadeFederativa, Integer> {
	
	List<UnidadeFederativa> findAllByOrderByNome();
	
}
