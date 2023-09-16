package br.com.tt.painelpreco.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.tt.painelpreco.domain.model.ModalidadeCompra;

public interface ModalidadeCompraRepository extends JpaRepository<ModalidadeCompra, Integer> {
	
}
