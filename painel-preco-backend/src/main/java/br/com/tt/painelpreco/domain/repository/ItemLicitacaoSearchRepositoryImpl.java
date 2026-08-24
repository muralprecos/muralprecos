package br.com.tt.painelpreco.domain.repository;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.persistence.EntityManager;

import org.hibernate.search.engine.search.predicate.SearchPredicate;
import org.hibernate.search.engine.search.predicate.dsl.BooleanPredicateClausesStep;
import org.hibernate.search.engine.search.predicate.dsl.SearchPredicateFactory;
import org.hibernate.search.engine.search.sort.dsl.SortOrder;
import org.hibernate.search.engine.search.sort.dsl.CompositeSortComponentsStep;
import org.hibernate.search.engine.search.sort.dsl.SearchSortFactory;
import org.hibernate.search.engine.search.sort.dsl.SortFinalStep;
import org.hibernate.graph.GraphSemantic;
import org.hibernate.search.mapper.orm.Search;
import org.hibernate.search.mapper.orm.session.SearchSession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import br.com.tt.painelpreco.api.dto.form.filter.ItemLicitacaoFilter;
import br.com.tt.painelpreco.api.dto.form.filter.TipoBusca;
import br.com.tt.painelpreco.domain.model.ItemLicitacao;
import br.com.tt.painelpreco.util.DateUtil;
import br.com.tt.painelpreco.util.StringUtil;
import java.util.Arrays;

@Repository
public class ItemLicitacaoSearchRepositoryImpl implements ItemLicitacaoSearchRepository {

	private final EntityManager em;

	public ItemLicitacaoSearchRepositoryImpl(EntityManager em) {
		this.em = em;
	}

	@Override
	public ItemLicitacao searchByUuid(UUID uuid) {
		SearchSession searchSession = Search.session(em);
		List<ItemLicitacao> hits = searchSession.search(ItemLicitacao.class)
				.where(f -> f.match().field("uuid").matching(uuid))
				.loading(o -> o.graph("itemLicitacao.withDetails", GraphSemantic.FETCH))
				.fetchHits(1);
		return hits.isEmpty() ? null : hits.get(0);
	}

	@Override
	public Page<ItemLicitacao> searchByDescricao(ItemLicitacaoFilter filtro, Pageable pageable) {
		SearchSession searchSession = Search.session(em);
		String descricao = parseQuery(filtro.getDescricao());
		Date hoje = new Date();

		List<ItemLicitacao> hits = searchSession.search(ItemLicitacao.class)
				.where(f -> {
					var bool = f.bool();
					applyDescricaoFilter(bool, f, filtro);
					bool.must(filtrosBase(f, hoje));
					return bool;
				})
				.sort(f -> itemSort(f, pageable))
				.fetch((int) pageable.getOffset(), pageable.getPageSize())
				.hits();

		long totalHits = searchSession.search(ItemLicitacao.class)
				.where(f -> {
					var bool = f.bool();
					applyDescricaoFilter(bool, f, filtro);
					bool.must(filtrosBase(f, hoje));
					return bool;
				})
				.fetchTotalHitCount();

		return new PageImpl<>(hits, pageable, totalHits);
	}

	@Override
	public Page<ItemLicitacao> searchByFilter(ItemLicitacaoFilter filtro, Pageable pageable) {
		SearchSession searchSession = Search.session(em);

		Date hoje = new Date();
		var searchQuery = searchSession.search(ItemLicitacao.class)
				.where(f -> {
					var bool = f.bool();

					// Filtros base: excluir datas futuras e quantidade/valor zerados
					bool.must(filtrosBase(f, hoje));

					// Filtro por UUID
					if (filtro.getUuid() != null) {
						bool.must(f.match().field("uuid").matching(filtro.getUuid()));
					}

					// Filtros da Licitacao
					if (filtro.getAno() != null) {
						Date dataInicio = DateUtil.getDateFirtDayYear(filtro.getAno());
						Date dataFim = DateUtil.getDateLastDayYear(filtro.getAno());
						bool.must(f.range().field("licitacao.dataResultadoCompra")
								.between(dataInicio, dataFim));
					}

					if (!StringUtil.isEmpty(filtro.getObjeto())) {
						bool.must(f.simpleQueryString().field("licitacao.objeto")
								.matching(parseQuery(filtro.getObjeto())));
					}

					if (filtro.getOrgaoSuperiorId() != null) {
						bool.must(f.match().field("licitacao.orgaoSuperior.uuid")
								.matching(filtro.getOrgaoSuperiorId()));
					}

					if (filtro.getOrgaoId() != null) {
						bool.must(f.match().field("licitacao.orgao.uuid")
								.matching(filtro.getOrgaoId()));
					}

					if (filtro.getUgId() != null) {
						bool.must(f.match().field("licitacao.unidadeGestora.uuid")
								.matching(filtro.getUgId()));
					}

					if (filtro.getModalidadeId() != null) {
						bool.must(f.match().field("licitacao.modalidadeCompra.uuid")
								.matching(filtro.getModalidadeId()));
					}

					if (filtro.getPeriodoCompraId() != null) {
						Integer periodoCompraId = filtro.getPeriodoCompraId();
						Date dataLimite = filtro.getPeriodoCompra().getDataCompra();
						if (periodoCompraId < 181) {
							bool.must(f.range().field("licitacao.dataResultadoCompra")
									.atLeast(dataLimite));
						} else {
							bool.must(f.range().field("licitacao.dataResultadoCompra")
									.atMost(dataLimite));
						}
					}

					if (filtro.getFormaCompraId() != null) {
						bool.must(f.match().field("licitacao.formaCompra.uuid")
								.matching(filtro.getFormaCompraId()));
					}

					if (filtro.getEsferaId() != null) {
						bool.must(f.match().field("licitacao.esfera.uuid")
								.matching(filtro.getEsferaId()));
					}

					if (filtro.getMunicipioId() != null) {
						bool.must(f.match().field("licitacao.municipio.uuid")
								.matching(filtro.getMunicipioId()));
					}

					if (filtro.getIdsUFsRegiao() != null && filtro.getIdsUFsRegiao().length > 0) {
						bool.must(f.terms().field("licitacao.municipio.uf.id")
								.matchingAny(Arrays.asList(filtro.getIdsUFsRegiao())));
					}

					if (filtro.getUfId() != null) {
						bool.must(f.match().field("licitacao.municipio.uf.uuid").matching(filtro.getUfId()));
					}

					// Filtros do ItemLicitacao
					applyDescricaoFilter(bool, f, filtro);

					// Boost para itens recentes considerando data de abertura
					bool.should(f.range().field("licitacao.dataAbertura").atLeast(DateUtil.decrementaDeHoje(30))
							.boost(5.0f));
					bool.should(f.range().field("licitacao.dataAbertura").atLeast(DateUtil.decrementaDeHoje(90))
							.boost(3.0f));
					bool.should(f.range().field("licitacao.dataAbertura").atLeast(DateUtil.decrementaDeHoje(365))
							.boost(1.5f));

					if (!StringUtil.isEmpty(filtro.getDescricaoComplementar())) {
						bool.must(f.simpleQueryString().field("descricaoComplementar")
								.matching(parseQuery(filtro.getDescricaoComplementar())));
					}

					if (filtro.getMaterialId() != null) {
						bool.must(f.match().field("material.uuid")
								.matching(filtro.getMaterialId()));
					}

					if (filtro.getFornecedorId() != null) {
						bool.must(f.match().field("fornecedor.uuid")
								.matching(filtro.getFornecedorId()));
					}

					if (filtro.getPorteFornecedorId() != null) {
						bool.must(f.match().field("fornecedor.porte.uuid")
								.matching(filtro.getPorteFornecedorId()));
					}

					if (filtro.getUnidadeFornecimentoId() != null) {
						bool.must(f.match().field("unidadeFornecimento.uuid")
								.matching(filtro.getUnidadeFornecimentoId()));
					}

					return bool;
				})

				.sort(f -> itemSort(f, pageable))

				// .sort(f -> f.score().desc().then().field("licitacao.dataAbertura").desc()
				// .then().field("licitacao.dataResultadoCompra").desc()
				// .then().field("licitacao.numeroPncp").desc()
				// .then().field("numeroItem").desc())

				.fetch((int) pageable.getOffset(), pageable.getPageSize());

		List<ItemLicitacao> hits = searchQuery.hits();
		long totalHits = searchQuery.total().hitCount();

		return new PageImpl<>(hits, pageable, totalHits);
	}

	private SearchPredicate filtrosBase(SearchPredicateFactory f, Date hoje) {
		return f.bool()
				.must(f.range().field("licitacao.dataAbertura").atMost(hoje))
				.must(f.range().field("licitacao.dataResultadoCompra").atMost(hoje))
				.must(f.range().field("quantidade").greaterThan(0))
				.must(f.range().field("valor").greaterThan(0.0))
				.toPredicate();
	}

	private void applyDescricaoFilter(BooleanPredicateClausesStep<?> bool, SearchPredicateFactory f,
			ItemLicitacaoFilter filtro) {
		if (!StringUtil.isEmpty(filtro.getDescricao())) {
			String desc = filtro.getDescricao().trim();
			TipoBusca tipoBusca = filtro.getTipoBuscaDescricao() != null ? filtro.getTipoBuscaDescricao()
					: TipoBusca.TODAS_PALAVRAS;

			if (tipoBusca == TipoBusca.FRASE_EXATA) {
				bool.must(f.phrase().field("descricao").matching(desc));
			} else if (tipoBusca == TipoBusca.TODAS_PALAVRAS) {
				bool.must(f.simpleQueryString().field("descricao").matching(desc)
						.defaultOperator(org.hibernate.search.engine.search.common.BooleanOperator.AND));
			} else {
				bool.must(f.match().field("descricao").matching(desc));
			}
		}
	}

	private SortFinalStep itemSort(SearchSortFactory f, Pageable pageable) {
		if (pageable.getSort() == null || !pageable.getSort().isSorted()) {
			return defaultItemSort(f);
		}
		CompositeSortComponentsStep<?> composite = f.composite();
		int added = 0;
		for (Sort.Order order : pageable.getSort()) {
			String path = mapSortField(order.getProperty());
			if (path == null) {
				continue;
			}
			SortOrder direction = order.isAscending() ? SortOrder.ASC : SortOrder.DESC;
			composite = composite.add(f.field(path).order(direction));
			added++;
		}
		if (added == 0) {
			return defaultItemSort(f);
		}
		return composite.add(f.field("id").order(SortOrder.ASC));
	}

	private SortFinalStep defaultItemSort(SearchSortFactory f) {
		return f.field("licitacao.dataResultadoCompra").desc()
				.then().field("licitacao.dataAbertura").desc()
				.then().field("licitacao.numeroPncp").desc()
				.then().field("numeroItem").desc()
				.then().field("id").asc();
	}

	private static String mapSortField(String property) {
		if (property == null) {
			return null;
		}
		switch (property) {
			case "descricao":
				return "descricao_sort";
			case "valorUnitario":
				return "valorUnitario";
			case "valor":
				return "valor";
			case "quantidade":
				return "quantidade";
			case "dataResultadoCompra":
			case "licitacao.dataResultadoCompra":
				return "licitacao.dataResultadoCompra";
			case "dataAbertura":
			case "licitacao.dataAbertura":
				return "licitacao.dataAbertura";
			case "data":
				return "licitacao.dataResultadoCompra";
			default:
				return null;
		}
	}

	private String parseQuery(String query) {
		if (StringUtil.isEmpty(query)) {
			return query;
		}

		// Regex que captura conteúdo entre aspas ou conector lógico AND
		Pattern pattern = Pattern.compile("\"[^\"]*\"|\\b(AND)\\b", Pattern.CASE_INSENSITIVE);
		Matcher matcher = pattern.matcher(query);
		StringBuilder sb = new StringBuilder();

		while (matcher.find()) {
			String match = matcher.group();
			if (match.startsWith("\"")) {
				// Se começa com aspas, mantemos o conteúdo literal como está
				matcher.appendReplacement(sb, Matcher.quoteReplacement(match));
			} else {
				// Caso contrário, é um conector fora de aspas; substituímos pelo símbolo
				// correspondente
				String upperMatch = match.toUpperCase();
				String replacement = "";
				if (upperMatch.equals("AND")) {
					replacement = "+";
				}
				matcher.appendReplacement(sb, replacement);
			}
		}
		matcher.appendTail(sb);
		return sb.toString();
	}

}
