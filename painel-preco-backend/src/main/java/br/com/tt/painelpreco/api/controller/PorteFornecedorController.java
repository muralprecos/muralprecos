package br.com.tt.painelpreco.api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.tt.painelpreco.api.dto.PorteFornecedorDTO;
import br.com.tt.painelpreco.domain.service.PorteFornecedorService;
import br.com.tt.painelpreco.util.ApiVersion;
import br.com.tt.painelpreco.util.ModelConverter;

@RestController
@RequestMapping(ApiVersion.LATEST + "/portes-fornecedor")
public class PorteFornecedorController {
	
	@Autowired
	private PorteFornecedorService porteFornecedorService;
	
	@Autowired
	private ModelConverter converter;
	
	@GetMapping
	public List<PorteFornecedorDTO> listar() {
		return converter.toDTOCollection(porteFornecedorService.listaTodos(), PorteFornecedorDTO.class);
	}

}
