package br.com.tt.painelpreco.api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.tt.painelpreco.api.dto.UnidadeGestoraDTO;
import br.com.tt.painelpreco.domain.model.UnidadeGestora;
import br.com.tt.painelpreco.domain.service.UnidadeGestoraService;
import br.com.tt.painelpreco.util.ApiVersion;
import br.com.tt.painelpreco.util.ModelConverter;

@RestController
@RequestMapping(ApiVersion.LATEST + "/unidades-gestoras")
public class UnidadeGestoraController {
	
	@Autowired
	private UnidadeGestoraService unidadeGestoraService;
	
	@Autowired
	private ModelConverter converter;
	
	@GetMapping
	public Page<UnidadeGestoraDTO> listar(Pageable pageable) {
		Page<UnidadeGestora> unidadesGestoras = unidadeGestoraService.listaTodas(pageable);
		List<UnidadeGestoraDTO> unidadesGestorasDTO = converter.toDTOCollection(unidadesGestoras.getContent(), UnidadeGestoraDTO.class);
		return new PageImpl<>(unidadesGestorasDTO, pageable, unidadesGestoras.getTotalElements());
	}

}
