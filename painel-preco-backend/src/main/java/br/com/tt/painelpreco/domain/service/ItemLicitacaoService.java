package br.com.tt.painelpreco.domain.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import br.com.tt.painelpreco.api.dto.form.filter.ItemLicitacaoFilter;
import br.com.tt.painelpreco.domain.model.ItemLicitacao;
import br.com.tt.painelpreco.domain.repository.ItemLicitacaoRepository;
import br.com.tt.painelpreco.domain.repository.ItemLicitacaoSearchRepository;
import br.com.tt.painelpreco.domain.repository.spec.ItemLicitacaoSpecs;
import br.com.tt.painelpreco.util.JPAUtil;

@Service
public class ItemLicitacaoService {
	
	@Autowired
	private ItemLicitacaoRepository itemLicitacaoRepository;
	
	@Autowired
	private ItemLicitacaoSearchRepository itemLicitacaoSearchRepository;

	public ItemLicitacao findByUuid(UUID uuid) {
		return itemLicitacaoRepository.findByUuid(uuid);
	}
	
	public List<ItemLicitacao> findAllByUuid(List<UUID> uuids) {
		return itemLicitacaoRepository.findAllByUuidIn(uuids);
	}
	
	public Page<ItemLicitacao> listaByFilter(Specification<ItemLicitacao> filtro, Pageable pageable) {
		return itemLicitacaoRepository.findAll(filtro, pageable);
	}
	
	public Page<ItemLicitacao> listaByFilter(ItemLicitacaoFilter filter, Pageable pageable) {
		List<Long> ids = itemLicitacaoSearchRepository.searchByDescricao(filter.getDescricao());
		Specification<ItemLicitacao> spec = ItemLicitacaoSpecs.filtroGeral(filter);
		spec.and((root, query, cb) -> root.in(ids));
		return itemLicitacaoRepository.findAll(spec, pageable);
	}

	public Page<ItemLicitacao> listaByDescricao(String descricao, Pageable pageable) {
		return itemLicitacaoRepository.findAllByDescricao(JPAUtil.likeExpression(descricao), pageable);
	}
	
	public Page<ItemLicitacao> listaByDescricaoComplementar(String descricaoComplementar, Pageable pageable) {
		return itemLicitacaoRepository.findAllByDescricaoComplementar(JPAUtil.likeExpression(descricaoComplementar), pageable);
	}

}
