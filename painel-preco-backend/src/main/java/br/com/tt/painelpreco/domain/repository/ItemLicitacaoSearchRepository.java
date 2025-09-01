package br.com.tt.painelpreco.domain.repository;

import java.util.List;

public interface ItemLicitacaoSearchRepository {
	
	List<Long> searchByDescricao(String descricao);

}
