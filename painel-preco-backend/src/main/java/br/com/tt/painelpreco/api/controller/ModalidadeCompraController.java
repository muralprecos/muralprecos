package br.com.tt.painelpreco.api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.tt.painelpreco.api.dto.ModalidadeCompraDTO;
import br.com.tt.painelpreco.domain.service.ModalidadeCompraService;
import br.com.tt.painelpreco.util.ApiVersion;
import br.com.tt.painelpreco.util.ModelConverter;

@RestController
@RequestMapping(ApiVersion.LATEST + "/modalidades-compra")
public class ModalidadeCompraController {
	
	@Autowired
	private ModalidadeCompraService modalidadeCompraService;
	
	@Autowired
	private ModelConverter converter;
	
	@GetMapping
	public List<ModalidadeCompraDTO> listar() {
		return converter.toDTOCollection(modalidadeCompraService.listaTodas(), ModalidadeCompraDTO.class);
	}

}
