package br.com.tt.painelpreco.domain.repository;

import java.util.List;

import javax.persistence.EntityManager;

import org.hibernate.search.mapper.orm.Search;
import org.hibernate.search.mapper.orm.session.SearchSession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import br.com.tt.painelpreco.api.dto.form.filter.ItemLicitacaoFilter;
import br.com.tt.painelpreco.domain.model.ItemLicitacao;

@Repository
public class ItemLicitacaoSearchRepositoryImpl implements ItemLicitacaoSearchRepository {
	
	private final EntityManager em;

	public ItemLicitacaoSearchRepositoryImpl(EntityManager em) {
		this.em = em;
	}

	@Override
	public Page<ItemLicitacao> searchByDescricao(ItemLicitacaoFilter filtro, Pageable pageable) {
		SearchSession searchSession = Search.session(em);
		String descricao = filtro.getDescricao();
		List<ItemLicitacao> hits = searchSession.search(ItemLicitacao.class)
			.where(f -> f.match().field("descricao").matching(descricao))
//			.sort(f -> f.field("numeroPncp").desc()
//					.then().field("numeroItem").asc())
            .fetch(pageable.getPageSize(), (int) pageable.getOffset())
            .hits();

	    long totalHits = searchSession.search(ItemLicitacao.class)
	    		.where(f -> f.match().field("descricao").matching(descricao))
	            .fetchTotalHitCount();
	
	    return new PageImpl<>(hits, pageable, totalHits);
	}

}
