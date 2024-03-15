package br.com.tt.painelpreco.domain.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import br.com.tt.painelpreco.domain.model.ItemLicitacao;

public interface ItemLicitacaoDescCompRepository extends JpaRepository<ItemLicitacao, Integer>, JpaSpecificationExecutor<ItemLicitacao> {

	@Query("SELECT new ItemLicitacaoDescComp(il.descricaoComplementar) FROM ItemLicitacaoDescComp il WHERE UPPER(il.descricaoComplementar) LIKE UPPER(:descricaoComplementar) ORDER BY il.descricaoComplementar")
	Page<ItemLicitacao> findAllByDescricaoComplementar(String descricaoComplementar, Pageable pageable);
	
}
