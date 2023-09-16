package br.com.tt.painelpreco.api.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.tt.painelpreco.api.dto.MunicipioDTO;
import br.com.tt.painelpreco.api.dto.UnidadeFederativaDTO;
import br.com.tt.painelpreco.domain.model.Municipio;
import br.com.tt.painelpreco.domain.service.MunicipioService;
import br.com.tt.painelpreco.domain.service.UnidadeFederativaService;
import br.com.tt.painelpreco.util.ApiVersion;
import br.com.tt.painelpreco.util.ModelConverter;

@RestController
@RequestMapping(ApiVersion.LATEST + "/unidades-federativas")
public class UnidadeFederativaController {
	
	@Autowired
	private UnidadeFederativaService unidadeFederativaService;
	
	@Autowired
	private MunicipioService municipioService;
	
	@Autowired
	private ModelConverter converter;
	
	@GetMapping
	public List<UnidadeFederativaDTO> listar() {
		return converter.toDTOCollection(unidadeFederativaService.listaTodas(), UnidadeFederativaDTO.class);
	}
	
	@GetMapping("{uuid}/municipios")
	public Page<MunicipioDTO> listarMunicipios(@PathVariable UUID uuid, Pageable pageable) {
		Page<Municipio> municipios = municipioService.listaTodosByUf(uuid, pageable);
		List<MunicipioDTO> municipiosDTO = converter.toDTOCollection(municipios.getContent(), MunicipioDTO.class);
		return new PageImpl<>(municipiosDTO, pageable, municipios.getTotalElements());
	}

}
