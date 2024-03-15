package br.com.tt.painelpreco.api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.tt.painelpreco.api.dto.LicitacaoDTO;
import br.com.tt.painelpreco.api.dto.ObjetoLicitacaoDTO;
import br.com.tt.painelpreco.api.dto.form.filter.LicitacaoFilter;
import br.com.tt.painelpreco.domain.repository.spec.LicitacaoSpecs;
import br.com.tt.painelpreco.domain.service.LicitacaoObjService;
import br.com.tt.painelpreco.domain.service.LicitacaoService;
import br.com.tt.painelpreco.util.ApiVersion;
import br.com.tt.painelpreco.util.ModelConverter;

@RestController
@RequestMapping(ApiVersion.LATEST + "/licitacoes")
public class LicitacaoController {
	
	@Autowired
	private LicitacaoService licitacoesService;
	
	@Autowired
	private LicitacaoObjService licitacoesObjService;
	
	@Autowired
	private ModelConverter converter;
	
	@GetMapping
	public Page<?> pesquisar(Pageable pageable, LicitacaoFilter filter) {
		Page<?> licitacoes = null;
		if (filter.isOnly()) {
			if (filter.isObjetoOnly())
				licitacoes = licitacoesObjService.listaByObjeto(filter.getObjeto(), pageable);
		} else {			
			licitacoes = licitacoesService.listaByFilter(LicitacaoSpecs.filtroGeral(filter), pageable);
		}
		
		return new PageImpl<>(getCollectionDTO(licitacoes, filter), pageable, licitacoes.getTotalElements());
	}

	private List<?> getCollectionDTO(Page<?> licitacoes, LicitacaoFilter filter) {
		List<LicitacaoDTO> result = converter.toDTOCollection(licitacoes.getContent(), LicitacaoDTO.class);
		if (!filter.isOnly())
			return result;
		
		if (filter.isObjetoOnly())
			return converter.toDTOCollection(licitacoes.getContent(), ObjetoLicitacaoDTO.class);
		
		return result;
	}

}
