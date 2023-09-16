package br.com.tt.painelpreco.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.tt.painelpreco.domain.model.FormaCompra;

public interface FormaCompraRepository extends JpaRepository<FormaCompra, Integer> {
	
}
