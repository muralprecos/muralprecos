package br.com.tt.painelpreco.domain.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import br.com.tt.painelpreco.domain.model.ItemLicitacao;
import br.com.tt.painelpreco.domain.repository.ItemLicitacaoDescRepository;
import br.com.tt.painelpreco.util.JPAUtil;

@Service
public class ItemLicitacaoDescService {
	
	@Autowired
	private ItemLicitacaoDescRepository itemLicitacaoDescRepository;

	public Page<ItemLicitacao> listaByDescricao(String descricao, Pageable pageable) {
		return itemLicitacaoDescRepository.findAllByDescricao(JPAUtil.likeExpression(descricao), pageable);
	}

}
