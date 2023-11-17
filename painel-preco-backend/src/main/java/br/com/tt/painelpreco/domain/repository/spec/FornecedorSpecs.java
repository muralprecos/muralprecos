package br.com.tt.painelpreco.domain.repository.spec;

import java.util.ArrayList;

import javax.persistence.criteria.Predicate;

import org.springframework.data.jpa.domain.Specification;

import br.com.tt.painelpreco.api.dto.form.filter.FornecedorFilter;
import br.com.tt.painelpreco.domain.model.Fornecedor;
import br.com.tt.painelpreco.util.JPAUtil;
import br.com.tt.painelpreco.util.StringUtil;

public class FornecedorSpecs {
	
	public static Specification<Fornecedor> filtroGeral(FornecedorFilter filtro) {
		return (root, query, builder) -> {
			var predicates = new ArrayList<>();
			
			if (filtro.getUuid() != null)
				predicates.add(builder.equal(root.get("uuid"), filtro.getUuid()));
			
			if (!StringUtil.isEmpty(filtro.getDocumento()))
				predicates.add(builder.like(builder.upper(root.get("documento")), JPAUtil.likeExpression(filtro.getDocumento())));
			
			if (!StringUtil.isEmpty(filtro.getNome())) {
				Predicate documento = builder.like(builder.upper(root.get("documento")), JPAUtil.likeExpression(filtro.getNome()));
				Predicate nome = builder.like(builder.upper(root.get("nome")), JPAUtil.likeExpression(filtro.getNome()));
				predicates.add(builder.or(documento, nome));
			}
			
			return builder.and(predicates.toArray(new Predicate[0]));
		};
	}

}
