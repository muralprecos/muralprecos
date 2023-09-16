package br.com.tt.painelpreco.api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.tt.painelpreco.api.dto.MaterialDTO;
import br.com.tt.painelpreco.domain.model.Material;
import br.com.tt.painelpreco.domain.service.MaterialService;
import br.com.tt.painelpreco.util.ApiVersion;
import br.com.tt.painelpreco.util.ModelConverter;

@RestController
@RequestMapping(ApiVersion.LATEST + "/materiais")
public class FornecedorController {
	
	@Autowired
	private MaterialService materialService;
	
	@Autowired
	private ModelConverter converter;
	
	@GetMapping
	public Page<MaterialDTO> listar(Pageable pageable) {
		Page<Material> materiais = materialService.listaTodos(pageable);
		List<MaterialDTO> materiaisDTO = converter.toDTOCollection(materiais.getContent(), MaterialDTO.class);
		return new PageImpl<>(materiaisDTO, pageable, materiais.getTotalElements());
	}

}
