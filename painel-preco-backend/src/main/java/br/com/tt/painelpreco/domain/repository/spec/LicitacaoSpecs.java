package br.com.tt.painelpreco.domain.repository.spec;

import java.util.ArrayList;

import javax.persistence.criteria.Predicate;

import org.springframework.data.jpa.domain.Specification;

import br.com.tt.painelpreco.api.dto.form.filter.LicitacaoFilter;
import br.com.tt.painelpreco.domain.model.Licitacao;
import br.com.tt.painelpreco.util.DateUtil;
import br.com.tt.painelpreco.util.JPAUtil;
import br.com.tt.painelpreco.util.StringUtil;

public class LicitacaoSpecs {
	
	public static Specification<Licitacao> filtroGeral(LicitacaoFilter filtro) {
		return (root, query, builder) -> {
			var predicates = new ArrayList<>();
			
			if (filtro.getAno() != null)
				predicates.add(builder.between(root.get("dataResultadoCompra"), DateUtil.getDateFirtDayYear(filtro.getAno()), DateUtil.getDateLastDayYear(filtro.getAno())));
			
			if (!StringUtil.isEmpty(filtro.getObjeto()))
				predicates.add(builder.like(root.get("objeto"), JPAUtil.likeExpression(filtro.getObjeto())));
			
			if (filtro.getOrgaoSuperiorId() != null)
				predicates.add(builder.equal(root.get("orgaoSuperior").get("uuid"), filtro.getOrgaoSuperiorId()));
			
			if (filtro.getOrgaoId() != null)
				predicates.add(builder.equal(root.get("orgao").get("uuid"), filtro.getOrgaoId()));
			
			if (filtro.getUgId() != null)
				predicates.add(builder.equal(root.get("unidadeGestora").get("uuid"), filtro.getUgId()));
			
			if (filtro.getModalidadeId() != null)
				predicates.add(builder.equal(root.get("modalidadeCompra").get("uuid"), filtro.getModalidadeId()));
			
			Integer periodoCompraId = filtro.getPeriodoCompraId();
			if (filtro.getPeriodoCompraId() != null) {
				if (periodoCompraId < 181)
					predicates.add(builder.greaterThanOrEqualTo(root.get("dataResultadoCompra"), filtro.getPeriodoCompra().getDataCompra()));
				else
					predicates.add(builder.lessThanOrEqualTo(root.get("dataResultadoCompra"), filtro.getPeriodoCompra().getDataCompra()));
			}

			if (filtro.getFormaCompraId() != null)
				predicates.add(builder.equal(root.get("formaCompra").get("uuid"), filtro.getFormaCompraId()));
			
			if (filtro.getEsferaId() != null)
				predicates.add(builder.equal(root.get("esfera").get("uuid"), filtro.getEsferaId()));
			
			if (!StringUtil.isEmpty(filtro.getDescricao()))
				predicates.add(builder.like(root.join("itens").get("descricao"), JPAUtil.likeExpression(filtro.getDescricao())));
			
			if (!StringUtil.isEmpty(filtro.getDescricaoComplementar()))
				predicates.add(builder.like(root.join("itens").get("descricaoComplementar"), JPAUtil.likeExpression(filtro.getDescricaoComplementar())));
			
			if (filtro.getMaterialId() != null)
				predicates.add(builder.equal(root.join("itens").get("material").get("uuid"), filtro.getMaterialId()));
			
			if (filtro.getPorteFornecedorId() != null)
				predicates.add(builder.equal(root.join("itens").get("fornecedor.porte.id"), filtro.getPorteFornecedorId()));
			
			if (filtro.getFornecedorId() != null)
				predicates.add(builder.equal(root.join("itens").get("fornecedor").get("uuid"), filtro.getFornecedorId()));
			
			return builder.and(predicates.toArray(new Predicate[0]));
		};
	}

}
