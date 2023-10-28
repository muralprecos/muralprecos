package br.com.tt.painelpreco.domain.service;

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

	public Page<ItemLicitacao> listaTodos(Pageable pageable) {
		return itemLicitacaomaterialRepository.findAll(pageable);
	}
	
	public Page<ItemLicitacao> listaByFilter(Specification<ItemLicitacao> filtro, Pageable pageable) {
		return itemLicitacaomaterialRepository.findAll(filtro, pageable);
	}

}
