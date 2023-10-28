package br.com.tt.painelpreco.domain.repository.spec;

import java.util.ArrayList;

import javax.persistence.criteria.Predicate;

import org.springframework.data.jpa.domain.Specification;

import br.com.tt.painelpreco.api.dto.form.filter.MaterialFilter;
import br.com.tt.painelpreco.domain.model.Material;
import br.com.tt.painelpreco.util.JPAUtil;
import br.com.tt.painelpreco.util.StringUtil;

public class MaterialSpecs {
	
	public static Specification<Material> filtroGeral(MaterialFilter filtro) {
		return (root, query, builder) -> {
			var predicates = new ArrayList<>();
			
			if (filtro.getUuid() != null)
				predicates.add(builder.equal(root.get("uuid"), filtro.getUuid()));
			
			if (filtro.getCodigo() != null)
				predicates.add(builder.equal(root.get("codigo"), filtro.getCodigo()));
			
			if (!StringUtil.isEmpty(filtro.getNome()))
				predicates.add(builder.like(builder.upper(root.get("nome")), JPAUtil.likeExpression(filtro.getNome())));
			
			return builder.and(predicates.toArray(new Predicate[0]));
		};
	}

}
