package br.com.tt.painelpreco.domain.repository;

import java.util.List;
import java.util.UUID;

import javax.persistence.EntityManager;

import org.hibernate.search.engine.search.query.SearchResult;
import org.hibernate.search.mapper.orm.Search;
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
	public Page<ItemLicitacao> searchByDescricao(ItemLicitacaoFilter filter, Pageable pageable) {
//		SearchSession searchSession = Search.session(em);
//		String descricao = filtro.getDescricao();
//		List<ItemLicitacao> hits = searchSession.search(ItemLicitacao.class)
//			.where(f -> f.match().field("descricao").matching(descricao))
////			.sort(f -> f.field("numeroPncp").desc()
////					.then().field("numeroItem").asc())
//            .fetch((int) pageable.getOffset(), pageable.getPageSize())
//            .hits();
//
//	    long totalHits = searchSession.search(ItemLicitacao.class)
//	    		.where(f -> f.match().field("descricao").matching(descricao))
//	            .fetchTotalHitCount();
//	
//	    return new PageImpl<>(hits, pageable, totalHits);
	    
		String descricao = filter.getDescricao();
		UUID ufId = filter.getUfId();
		UUID municipioId = filter.getMunicipioId();
		Integer periodoCompraId = filter.getPeriodoCompraId();
		SearchResult<ItemLicitacao> itens = Search.session(em)
			.search(ItemLicitacao.class)
			.where(f -> {
                var booleanClause = f.bool();

                if (descricao != null && !descricao.isEmpty()) {
                    booleanClause.must(f.match().field("descricao").matching(descricao));
                }
                if (ufId != null) {
                    booleanClause.must(f.match().field("licitacao.municipio.uf.uuid").matching(ufId));
                }
                if (municipioId != null) {
                    booleanClause.must(f.match().field("licitacao.municipio.uuid").matching(municipioId));
                }
                
    			if (filter.getPeriodoCompraId() != null) {
    				if (periodoCompraId < 181)
    					booleanClause.must(f.range().field("licitacao.dataResultadoCompra").atLeast(filter.getPeriodoCompra().getDataCompra()));
    				else
    					booleanClause.must(f.range().field("licitacao.dataResultadoCompra").atMost(filter.getPeriodoCompra().getDataCompra()));
                }

                return booleanClause;
            }).fetch(pageable.getPageSize(), (int) pageable.getOffset());

		List<ItemLicitacao> hits = itens.hits();
		long totalResultados = itens.total().hitCount();

		return new PageImpl<>(hits, pageable, totalResultados);
	}

}
