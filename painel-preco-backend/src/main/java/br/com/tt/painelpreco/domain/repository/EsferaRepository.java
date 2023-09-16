package br.com.tt.painelpreco.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.tt.painelpreco.domain.model.Esfera;

public interface EsferaRepository extends JpaRepository<Esfera, Integer> {
	
}
