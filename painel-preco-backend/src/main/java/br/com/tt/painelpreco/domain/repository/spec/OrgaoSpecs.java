package br.com.tt.painelpreco.domain.repository.spec;

import java.util.ArrayList;

import javax.persistence.criteria.Predicate;

import org.springframework.data.jpa.domain.Specification;

import br.com.tt.painelpreco.api.dto.form.filter.OrgaoFilter;
import br.com.tt.painelpreco.domain.model.Orgao;
import br.com.tt.painelpreco.util.JPAUtil;
import br.com.tt.painelpreco.util.StringUtil;

public class OrgaoSpecs {
	
	public static Specification<Orgao> filtroGeral(OrgaoFilter filtro) {
		return (root, query, builder) -> {
			var predicates = new ArrayList<>();
			
			if (filtro.getUuid() != null)
				predicates.add(builder.equal(root.get("uuid"), filtro.getUuid()));
			
			if (filtro.getEhSuperior() != null) {
				Predicate predicate = null;
				if (filtro.getEhSuperior())
					predicate = root.get("superior").isNull();
				else
					predicate = root.get("superior").isNotNull();
				
				predicates.add(predicate);
			}
			
			if (!StringUtil.isEmpty(filtro.getCodigo()))
				predicates.add(builder.like(builder.upper(root.get("codigo").as(String.class)), JPAUtil.likeExpression(filtro.getCodigo())));
			
			if (!StringUtil.isEmpty(filtro.getNome())) {
				Predicate codigo = builder.like(builder.upper(root.get("codigo").as(String.class)), JPAUtil.likeExpression(filtro.getNome()));
				Predicate nome = builder.like(builder.upper(root.get("nome")), JPAUtil.likeExpression(filtro.getNome()));
				predicates.add(builder.or(codigo, nome));
			}
			
			return builder.and(predicates.toArray(new Predicate[0]));
		};
	}

}
