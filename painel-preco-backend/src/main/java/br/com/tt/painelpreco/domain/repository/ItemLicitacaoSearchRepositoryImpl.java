package br.com.tt.painelpreco.domain.repository;

import java.util.List;

import javax.persistence.EntityManager;

import org.hibernate.search.mapper.orm.Search;
import org.springframework.stereotype.Repository;

import br.com.tt.painelpreco.domain.model.ItemLicitacao;

@Repository
public class ItemLicitacaoSearchRepositoryImpl implements ItemLicitacaoSearchRepository {
	
	private final EntityManager em;

	public ItemLicitacaoSearchRepositoryImpl(EntityManager em) {
		this.em = em;
	}

	@Override
	public List<Long> searchByDescricao(String descricao) {
		List<Long> ids = Search.session(em)
			.search(ItemLicitacao.class)
			.select(f -> f.id(Long.class))
			.where(f -> f.match().field("descricao").matching(descricao))
			.fetchAllHits();
		
		if (ids.isEmpty()) {
			return List.of();
		}
		
		return ids;
	}

}
