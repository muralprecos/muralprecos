package br.com.tt.painelpreco.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.tt.painelpreco.domain.model.SituacaoLicitacao;

public interface SituacaoLicitacaoRepository extends JpaRepository<SituacaoLicitacao, Integer> {
	
}
