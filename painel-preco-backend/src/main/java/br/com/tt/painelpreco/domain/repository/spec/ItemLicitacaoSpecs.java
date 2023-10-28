package br.com.tt.painelpreco.domain.repository.spec;

import java.util.ArrayList;

import javax.persistence.criteria.Predicate;

import org.springframework.data.jpa.domain.Specification;

import br.com.tt.painelpreco.api.dto.form.filter.ItemLicitacaoFilter;
import br.com.tt.painelpreco.domain.model.ItemLicitacao;
import br.com.tt.painelpreco.util.JPAUtil;
import br.com.tt.painelpreco.util.StringUtil;

public class ItemLicitacaoSpecs {
	
	public static Specification<ItemLicitacao> filtroGeral(ItemLicitacaoFilter filtro) {
		return (root, query, builder) -> {
			var predicates = new ArrayList<>();
			
			if (filtro.getUuid() != null)
				predicates.add(builder.equal(root.get("uuid"), filtro.getUuid()));
			
			if (!StringUtil.isEmpty(filtro.getDescricao()))
				predicates.add(builder.like(builder.upper(root.get("descricao")), JPAUtil.likeExpression(filtro.getDescricao())));
			
			if (!StringUtil.isEmpty(filtro.getDescricaoComplementar()))
				predicates.add(builder.like(builder.upper(root.get("descricaoComplementar")), JPAUtil.likeExpression(filtro.getDescricaoComplementar())));
			
			return builder.and(predicates.toArray(new Predicate[0]));
		};
	}

}
