package br.com.tt.painelpreco.domain.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import br.com.tt.painelpreco.domain.model.ItemLicitacao;
import br.com.tt.painelpreco.domain.repository.ItemLicitacaoRepository;

@Service
public class ItemLicitacaoService {
	
	@Autowired
	private ItemLicitacaoRepository itemLicitacaomaterialRepository;

	public ItemLicitacao findByUuid(UUID uuid) {
		return itemLicitacaomaterialRepository.findByUuid(uuid);
	}
	
	public List<ItemLicitacao> findAllByUuid(List<UUID> uuids) {
		return itemLicitacaomaterialRepository.findAllByUuidIn(uuids);
	}
	
	public Page<ItemLicitacao> listaByFilter(Specification<ItemLicitacao> filtro, Pageable pageable) {
		return itemLicitacaomaterialRepository.findAll(filtro, pageable);
	}

}
