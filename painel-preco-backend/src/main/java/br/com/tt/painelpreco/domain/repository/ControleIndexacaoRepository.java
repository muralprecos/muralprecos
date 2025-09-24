package br.com.tt.painelpreco.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import br.com.tt.painelpreco.domain.model.ControleIndexacao;
import br.com.tt.painelpreco.domain.model.ItemLicitacao;

public interface ControleIndexacaoRepository extends JpaRepository<ControleIndexacao, Long>, JpaSpecificationExecutor<ItemLicitacao> {
	
	ControleIndexacao findByEntidade(String entidade);
	
}
