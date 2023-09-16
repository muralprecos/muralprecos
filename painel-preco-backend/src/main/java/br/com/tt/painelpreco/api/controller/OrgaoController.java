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

import br.com.tt.painelpreco.api.dto.OrgaoDTO;
import br.com.tt.painelpreco.domain.model.Orgao;
import br.com.tt.painelpreco.domain.service.OrgaoService;
import br.com.tt.painelpreco.util.ApiVersion;
import br.com.tt.painelpreco.util.ModelConverter;

@RestController
@RequestMapping(ApiVersion.LATEST + "/orgaos")
public class OrgaoController {
	
	@Autowired
	private OrgaoService orgaoService;
	
	@Autowired
	private ModelConverter converter;
	
	@GetMapping
	public Page<OrgaoDTO> listar(Pageable pageable) {
		Page<Orgao> orgaos = orgaoService.listaTodos(pageable);
		List<OrgaoDTO> orgaosDTO = converter.toDTOCollection(orgaos.getContent(), OrgaoDTO.class);
		return new PageImpl<>(orgaosDTO, pageable, orgaos.getTotalElements());
	}
	
	@GetMapping("{uuid}/suborgaos")
	public Page<OrgaoDTO> listarSubOrgaos(@PathVariable UUID uuid, Pageable pageable) {
		Page<Orgao> orgaos = orgaoService.listaTodosSubOrgaos(uuid, pageable);
		List<OrgaoDTO> orgaosDTO = converter.toDTOCollection(orgaos.getContent(), OrgaoDTO.class);
		return new PageImpl<>(orgaosDTO, pageable, orgaos.getTotalElements());
	}

}
