package br.com.tt.painelpreco.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.tt.painelpreco.domain.model.Fornecedor;

public interface FornecedorRepository extends JpaRepository<Fornecedor, Integer> {
	
}
