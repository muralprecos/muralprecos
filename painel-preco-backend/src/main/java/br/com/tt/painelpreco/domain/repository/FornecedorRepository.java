package br.com.tt.painelpreco.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import br.com.tt.painelpreco.domain.model.Fornecedor;

public interface FornecedorRepository extends JpaRepository<Fornecedor, Integer>, JpaSpecificationExecutor<Fornecedor> {

	boolean existsByDocumento(String documento);

	Fornecedor findFirstByDocumento(String documento);

}
