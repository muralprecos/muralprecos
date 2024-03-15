package br.com.tt.painelpreco.domain.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import br.com.tt.painelpreco.domain.model.ItemLicitacao;
import br.com.tt.painelpreco.domain.repository.ItemLicitacaoDescCompRepository;
import br.com.tt.painelpreco.util.JPAUtil;

@Service
public class ItemLicitacaoDescCompService {
	
	@Autowired
	private ItemLicitacaoDescCompRepository itemLicitacaoDescCompRepository;

	public Page<ItemLicitacao> listaByDescricaoComplementar(String descricaoComplementar, Pageable pageable) {
		return itemLicitacaoDescCompRepository.findAllByDescricaoComplementar(JPAUtil.likeExpression(descricaoComplementar), pageable);
	}

}
