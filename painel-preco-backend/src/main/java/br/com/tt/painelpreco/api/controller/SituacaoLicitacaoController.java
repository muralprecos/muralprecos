package br.com.tt.painelpreco.api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.tt.painelpreco.api.dto.SituacaoLicitacaoDTO;
import br.com.tt.painelpreco.domain.service.SituacaoLicitacaoService;
import br.com.tt.painelpreco.util.ApiVersion;
import br.com.tt.painelpreco.util.ModelConverter;

@RestController
@RequestMapping(ApiVersion.LATEST + "/situacoes-licitacao")
public class SituacaoLicitacaoController {
	
	@Autowired
	private SituacaoLicitacaoService situacaoLicitacaoService;
	
	@Autowired
	private ModelConverter converter;
	
	@GetMapping
	public List<SituacaoLicitacaoDTO> listar() {
		return converter.toDTOCollection(situacaoLicitacaoService.listaTodas(), SituacaoLicitacaoDTO.class);
	}

}
