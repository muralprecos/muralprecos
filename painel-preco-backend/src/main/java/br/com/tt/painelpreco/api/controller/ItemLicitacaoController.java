package br.com.tt.painelpreco.api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.tt.painelpreco.api.dto.ItemLicitacaoDTO;
import br.com.tt.painelpreco.api.dto.form.filter.ItemLicitacaoFilter;
import br.com.tt.painelpreco.domain.model.ItemLicitacao;
import br.com.tt.painelpreco.domain.repository.spec.ItemLicitacaoSpecs;
import br.com.tt.painelpreco.domain.service.ItemLicitacaoService;
import br.com.tt.painelpreco.util.ApiVersion;
import br.com.tt.painelpreco.util.ModelConverter;

@RestController
@RequestMapping(ApiVersion.LATEST + "/itens-licitacao")
public class ItemLicitacaoController {
	
	@Autowired
	private ItemLicitacaoService itemLicitacaoService;
	
	@Autowired
	private ModelConverter converter;
	
//	@GetMapping
//	public Page<ItemLicitacaoDTO> listar(Pageable pageable) {
//		Page<ItemLicitacao> itens = itemLicitacaoService.listaTodos(pageable);
//		List<ItemLicitacaoDTO> itensDTO = converter.toDTOCollection(itens.getContent(), ItemLicitacaoDTO.class);
//		return new PageImpl<>(itensDTO, pageable, itens.getTotalElements());
//	}
	
	@GetMapping
	public Page<ItemLicitacaoDTO> pesquisar(Pageable pageable, ItemLicitacaoFilter filter) {
		Page<ItemLicitacao> itens = itemLicitacaoService.listaByFilter(ItemLicitacaoSpecs.filtroGeral(filter), pageable);
		List<ItemLicitacaoDTO> itensDTO = converter.toDTOCollection(itens.getContent(), ItemLicitacaoDTO.class);
		return new PageImpl<>(itensDTO, pageable, itens.getTotalElements());
	}

}
