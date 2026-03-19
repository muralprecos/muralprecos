package br.com.tt.painelpreco.domain.repository;

import java.util.Date;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.persistence.EntityManager;

import org.hibernate.search.mapper.orm.Search;
import org.hibernate.search.mapper.orm.session.SearchSession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import br.com.tt.painelpreco.api.dto.form.filter.ItemLicitacaoFilter;
import br.com.tt.painelpreco.domain.model.ItemLicitacao;
import br.com.tt.painelpreco.util.DateUtil;
import br.com.tt.painelpreco.util.StringUtil;

@Repository
public class ItemLicitacaoSearchRepositoryImpl implements ItemLicitacaoSearchRepository {

	private final EntityManager em;

	public ItemLicitacaoSearchRepositoryImpl(EntityManager em) {
		this.em = em;
	}

	@Override
	public Page<ItemLicitacao> searchByDescricao(ItemLicitacaoFilter filtro, Pageable pageable) {
		SearchSession searchSession = Search.session(em);
		String descricao = parseQuery(filtro.getDescricao());
		List<ItemLicitacao> hits = searchSession.search(ItemLicitacao.class)
				.where(f -> f.simpleQueryString().field("descricao").matching(descricao))
				// .sort(f -> f.field("numeroPncp").desc()
				// .then().field("numeroItem").asc())
				.fetch((int) pageable.getOffset(), pageable.getPageSize())
				.hits();

		long totalHits = searchSession.search(ItemLicitacao.class)
				.where(f -> f.simpleQueryString().field("descricao").matching(descricao))
				.fetchTotalHitCount();

		return new PageImpl<>(hits, pageable, totalHits);
	}

	@Override
	public Page<ItemLicitacao> searchByFilter(ItemLicitacaoFilter filtro, Pageable pageable) {
		SearchSession searchSession = Search.session(em);

		var searchQuery = searchSession.search(ItemLicitacao.class)
				.where(f -> {
					var bool = f.bool();

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

					if (filtro.getUfId() != null) {
						Integer[] idsUFsRegiao = br.com.tt.painelpreco.domain.model.UnidadeFederativa.getUFsRegiao(filtro.getUfId());
						if (idsUFsRegiao != null && idsUFsRegiao.length > 0) {
							bool.must(f.terms().field("licitacao.municipio.uf.id").matchingAny(idsUFsRegiao));
						} else {
							bool.must(f.match().field("licitacao.municipio.uf.uuid").matching(filtro.getUfId()));
						}
					}

					// Filtros do ItemLicitacao
					if (!StringUtil.isEmpty(filtro.getDescricao())) {
						bool.must(f.simpleQueryString().field("descricao")
								.matching(parseQuery(filtro.getDescricao())));
					}

					// Boost para itens recentes considerando data de abertura
					bool.should(f.range().field("licitacao.dataAbertura").atLeast(DateUtil.decrementaDeHoje(30)).boost(5.0f));
					bool.should(f.range().field("licitacao.dataAbertura").atLeast(DateUtil.decrementaDeHoje(90)).boost(3.0f));
					bool.should(f.range().field("licitacao.dataAbertura").atLeast(DateUtil.decrementaDeHoje(365)).boost(1.5f));

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
				.sort(f -> f.score().desc().then().field("licitacao.dataAbertura").desc()
						.then().field("licitacao.dataResultadoCompra").desc()
						.then().field("licitacao.numeroPncp").desc()
						.then().field("numeroItem").desc())
				.fetch((int) pageable.getOffset(), pageable.getPageSize());

		List<ItemLicitacao> hits = searchQuery.hits();
		long totalHits = searchQuery.total().hitCount();

		return new PageImpl<>(hits, pageable, totalHits);
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
				// Caso contrário, é um conector fora de aspas; substituímos pelo símbolo correspondente
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
