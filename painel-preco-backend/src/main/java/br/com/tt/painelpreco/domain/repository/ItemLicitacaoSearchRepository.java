package br.com.tt.painelpreco.domain.repository;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import br.com.tt.painelpreco.api.dto.form.filter.ItemLicitacaoFilter;
import br.com.tt.painelpreco.domain.model.ItemLicitacao;

public interface ItemLicitacaoSearchRepository {
	
	Page<ItemLicitacao> searchByDescricao(ItemLicitacaoFilter filtro, Pageable pageable);
	
	Page<ItemLicitacao> searchByFilter(ItemLicitacaoFilter filtro, Pageable pageable);

	ItemLicitacao searchByUuid(UUID uuid);

}
