package br.com.tt.painelpreco.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import br.com.tt.painelpreco.domain.model.UnidadeFornecimento;

public interface UnidadeFornecimentoRepository extends JpaRepository<UnidadeFornecimento, Integer>, JpaSpecificationExecutor<UnidadeFornecimento> {

	boolean existsByNome(String nome);

	UnidadeFornecimento findFirstByNome(String nome);
	
}
