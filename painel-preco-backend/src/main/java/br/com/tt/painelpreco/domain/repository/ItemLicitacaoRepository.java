package br.com.tt.painelpreco.domain.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import br.com.tt.painelpreco.domain.model.ItemLicitacao;

public interface ItemLicitacaoRepository extends JpaRepository<ItemLicitacao, Integer>, JpaSpecificationExecutor<ItemLicitacao> {
	
	ItemLicitacao findByUuid(UUID uuid);
	
	List<ItemLicitacao> findAllByUuidIn(List<UUID> uuids);
	
	@EntityGraph(attributePaths = {"unidadeFornecimento"})
	Page<ItemLicitacao> findAll(Specification<ItemLicitacao> spec, Pageable pageable);

	@Query("SELECT DISTINCT new ItemLicitacao(il.descricao) FROM ItemLicitacao il WHERE UPPER(il.descricao) LIKE UPPER(:descricao) ORDER BY il.descricao")
	Page<ItemLicitacao> findAllByDescricao(String descricao, Pageable pageable);
	
	@Query("SELECT DISTINCT new ItemLicitacao(il.descricaoComplementar) FROM ItemLicitacao il WHERE UPPER(il.descricaoComplementar) LIKE UPPER(:descricaoComplementar) ORDER BY il.descricaoComplementar")
	Page<ItemLicitacao> findAllByDescricaoComplementar(String descricaoComplementar, Pageable pageable);
	
}
