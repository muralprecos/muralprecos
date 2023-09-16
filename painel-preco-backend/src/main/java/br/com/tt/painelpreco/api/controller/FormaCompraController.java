package br.com.tt.painelpreco.api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.tt.painelpreco.api.dto.FormaCompraDTO;
import br.com.tt.painelpreco.domain.service.FormaCompraService;
import br.com.tt.painelpreco.util.ApiVersion;
import br.com.tt.painelpreco.util.ModelConverter;

@RestController
@RequestMapping(ApiVersion.LATEST + "/formas-compra")
public class FormaCompraController {
	
	@Autowired
	private FormaCompraService formaCompraService;
	
	@Autowired
	private ModelConverter converter;
	
	@GetMapping
	public List<FormaCompraDTO> listar() {
		return converter.toDTOCollection(formaCompraService.listaTodas(), FormaCompraDTO.class);
	}

}
