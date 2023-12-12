package br.com.tt.painelpreco.domain.repository.spec;

import java.util.ArrayList;

import javax.persistence.criteria.Predicate;

import org.springframework.data.jpa.domain.Specification;

import br.com.tt.painelpreco.api.dto.form.filter.MunicipioFilter;
import br.com.tt.painelpreco.domain.model.Municipio;
import br.com.tt.painelpreco.util.JPAUtil;
import br.com.tt.painelpreco.util.StringUtil;

public class MunicipioSpecs {
	
	public static Specification<Municipio> filtroGeral(MunicipioFilter filtro) {
		return (root, query, builder) -> {
			var predicates = new ArrayList<>();
			
			if (filtro.getUf() != null)
				predicates.add(builder.equal(root.get("uf").get("uuid"), filtro.getUf()));
			
			if (!StringUtil.isEmpty(filtro.getNome()))
				predicates.add(builder.like(builder.upper(root.get("nome")), JPAUtil.likeExpression(filtro.getNome())));
			
			query.orderBy(builder.asc(root.get("nome")));
			
			return builder.and(predicates.toArray(new Predicate[0]));
		};
	}

}
