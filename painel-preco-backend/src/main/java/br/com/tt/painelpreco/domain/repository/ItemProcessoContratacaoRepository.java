package br.com.tt.painelpreco.domain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.tt.painelpreco.domain.model.ItemProcessoContratacao;
import br.com.tt.painelpreco.domain.model.ProcessoContratacao;

public interface ItemProcessoContratacaoRepository extends JpaRepository<ItemProcessoContratacao, Integer> {

	List<ItemProcessoContratacao> findByProcessoContratacao(ProcessoContratacao processoContratacao);

}
