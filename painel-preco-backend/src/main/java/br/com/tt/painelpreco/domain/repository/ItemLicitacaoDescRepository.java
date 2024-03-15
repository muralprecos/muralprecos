package br.com.tt.painelpreco.domain.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import br.com.tt.painelpreco.domain.model.ItemLicitacao;

public interface ItemLicitacaoDescRepository extends JpaRepository<ItemLicitacao, Integer>, JpaSpecificationExecutor<ItemLicitacao> {

	@Query("SELECT new ItemLicitacaoDesc(il.descricao) FROM ItemLicitacaoDesc il WHERE UPPER(il.descricao) LIKE UPPER(:descricao) ORDER BY il.descricao")
	Page<ItemLicitacao> findAllByDescricao(String descricao, Pageable pageable);
	
}
