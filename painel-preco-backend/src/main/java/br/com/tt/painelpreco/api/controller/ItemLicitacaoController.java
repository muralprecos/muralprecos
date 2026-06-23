package br.com.tt.painelpreco.api.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.tt.painelpreco.api.dto.DescricaoComplementarItemLicitacaoDTO;
import br.com.tt.painelpreco.api.dto.DescricaoItemLicitacaoDTO;
import br.com.tt.painelpreco.api.dto.ItemLicitacaoDTO;
import br.com.tt.painelpreco.api.dto.form.filter.ItemLicitacaoFilter;
import br.com.tt.painelpreco.domain.model.ItemLicitacao;
import br.com.tt.painelpreco.domain.service.ItemLicitacaoDescCompService;
import br.com.tt.painelpreco.domain.service.ItemLicitacaoDescService;
import br.com.tt.painelpreco.domain.service.ItemLicitacaoService;
import br.com.tt.painelpreco.domain.service.UnidadeFederativaService;
import br.com.tt.painelpreco.util.ApiVersion;
import br.com.tt.painelpreco.util.ModelConverter;

@RestController
//@CacheConfig(cacheNames = "item_licitacao", keyGenerator = "cacheCustomKeyGenerator")
@RequestMapping(ApiVersion.LATEST + "/itens-licitacao")
public class ItemLicitacaoController {
	
	@Autowired
	private ItemLicitacaoService itemLicitacaoService;
	
	@Autowired
	private ItemLicitacaoDescService itemLicitacaoDescService;
	
	@Autowired
	private ItemLicitacaoDescCompService itemLicitacaoDescCompService;
	
	@Autowired
	private UnidadeFederativaService unidadeFederativaService;
	
	@Autowired
	private ModelConverter converter;
	
	@GetMapping("{uuid}")
	public ResponseEntity<ItemLicitacaoDTO> exibir(@PathVariable UUID uuid) {
		ItemLicitacao item = itemLicitacaoService.findByUuid(uuid);
		if (item == null)
			return ResponseEntity.notFound().build();
		
		ItemLicitacaoDTO itemDTO = converter.toDTO(item, ItemLicitacaoDTO.class);
		return ResponseEntity.ok(itemDTO);
	}
	
	@GetMapping("unauth/{uuid}")
	public ResponseEntity<ItemLicitacaoDTO> exibirUnauth(@PathVariable UUID uuid) {
		ItemLicitacao item = itemLicitacaoService.findByUuid(uuid);
		if (item == null)
			return ResponseEntity.notFound().build();
		
		ItemLicitacaoDTO itemDTO = converter.toDTO(item, ItemLicitacaoDTO.class);
		return ResponseEntity.ok(itemDTO);
	}
	
	@GetMapping
	public Page<?> pesquisar(Pageable pageable, ItemLicitacaoFilter filter) {
		if (filter.getRegiao() != null) {
			filter.setIdsUFsRegiao(unidadeFederativaService.getIdsUFsPorRegiao(filter.getRegiao()));
		}

		Page<ItemLicitacao> itens = null;
		if (filter.isOnly()) {
			if (filter.isDescricaoOnly())
				itens = itemLicitacaoDescService.listaByDescricao(filter.getDescricao(), pageable);
			if (filter.isDescricaoComplmentarOnly())
//				itens = itemLicitacaoDescCompService.listaByDescricaoComplementar(filter.getDescricaoComplementar(), pageable);
				itens = itemLicitacaoDescService.listaByDescricao(filter.getDescricao(), pageable);
		} else {			
//			itens = itemLicitacaoService.listaByFilter(ItemLicitacaoSpecs.filtroGeral(filter), pageable);
			itens = itemLicitacaoService.listaByFilter(filter, pageable);
		}
		
		return new PageImpl<>(getCollectionDTO(itens, filter), pageable, itens.getTotalElements());
	}

	private List<?> getCollectionDTO(Page<ItemLicitacao> itens, ItemLicitacaoFilter filter) {
		if (filter.isOnly()) {
			if (filter.isDescricaoOnly())
				return converter.toDTOCollection(itens.getContent(), DescricaoItemLicitacaoDTO.class);
			
			if (filter.isDescricaoComplmentarOnly())
				return converter.toDTOCollection(itens.getContent(), DescricaoComplementarItemLicitacaoDTO.class);
		}
		
		return converter.toDTOCollection(itens.getContent(), ItemLicitacaoDTO.class);
	}

}
