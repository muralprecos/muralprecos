package br.com.tt.painelpreco.api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.tt.painelpreco.api.dto.FornecedorDTO;
import br.com.tt.painelpreco.api.dto.form.filter.FornecedorFilter;
import br.com.tt.painelpreco.domain.model.Fornecedor;
import br.com.tt.painelpreco.domain.repository.spec.FornecedorSpecs;
import br.com.tt.painelpreco.domain.service.FornecedorService;
import br.com.tt.painelpreco.util.ApiVersion;
import br.com.tt.painelpreco.util.ModelConverter;

@RestController
@RequestMapping(ApiVersion.LATEST + "/fornecedores")
public class FornecedorController {
	
	@Autowired
	private FornecedorService fornecedorService;
	
	@Autowired
	private ModelConverter converter;
	
	@GetMapping
	public Page<FornecedorDTO> pesquisar(Pageable pageable, FornecedorFilter filter) {
		Page<Fornecedor> fornecedores = fornecedorService.listaByFilter(FornecedorSpecs.filtroGeral(filter), pageable);
		List<FornecedorDTO> fornecedoresDTO = converter.toDTOCollection(fornecedores.getContent(), FornecedorDTO.class);
		return new PageImpl<>(fornecedoresDTO, pageable, fornecedores.getTotalElements());
	}

}
