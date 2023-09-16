package br.com.tt.painelpreco.api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.tt.painelpreco.api.dto.EsferaDTO;
import br.com.tt.painelpreco.domain.service.EsferaService;
import br.com.tt.painelpreco.util.ApiVersion;
import br.com.tt.painelpreco.util.ModelConverter;

@RestController
@RequestMapping(ApiVersion.LATEST + "/esferas")
public class EsferaController {
	
	@Autowired
	private EsferaService esferaService;
	
	@Autowired
	private ModelConverter converter;
	
	@GetMapping
	public List<EsferaDTO> listar() {
		return converter.toDTOCollection(esferaService.listaTodas(), EsferaDTO.class);
	}

}
