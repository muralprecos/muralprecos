package br.com.tt.painelpreco.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.tt.painelpreco.domain.model.PorteFornecedor;

public interface PorteFornecedorRepository extends JpaRepository<PorteFornecedor, Integer> {

	boolean existsByNome(String nome);

	PorteFornecedor findFirstByNome(String nome);

}
