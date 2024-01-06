package br.com.tt.painelpreco.domain.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import br.com.tt.painelpreco.domain.model.ItemLicitacao;

public interface ItemLicitacaoRepository extends JpaRepository<ItemLicitacao, Integer>, JpaSpecificationExecutor<ItemLicitacao> {
	
	ItemLicitacao findByUuid(UUID uuid);
	
	List<ItemLicitacao> findAllByUuidIn(List<UUID> uuids);
	
}
