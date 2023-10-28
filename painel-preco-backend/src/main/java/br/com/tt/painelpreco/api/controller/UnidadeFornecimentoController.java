package br.com.tt.painelpreco.api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.tt.painelpreco.api.dto.UnidadeFornecimentoDTO;
import br.com.tt.painelpreco.api.dto.form.filter.UnidadeFornecimentoFilter;
import br.com.tt.painelpreco.domain.model.UnidadeFornecimento;
import br.com.tt.painelpreco.domain.repository.spec.UnidadeFornecimentoSpecs;
import br.com.tt.painelpreco.domain.service.UnidadeFornecimentoService;
import br.com.tt.painelpreco.util.ApiVersion;
import br.com.tt.painelpreco.util.ModelConverter;

@RestController
@RequestMapping(ApiVersion.LATEST + "/unidades-fornecimento")
public class UnidadeFornecimentoController {
	
	@Autowired
	private UnidadeFornecimentoService unidadeFornecimentoService;
	
	@Autowired
	private ModelConverter converter;
	
//	@GetMapping
//	public Page<UnidadeFornecimentoDTO> listar(Pageable pageable) {
//		Page<UnidadeFornecimento> unidades = unidadeFornecimentoService.listaTodos(pageable);
//		List<UnidadeFornecimentoDTO> unidadesDTO = converter.toDTOCollection(unidades.getContent(), UnidadeFornecimentoDTO.class);
//		return new PageImpl<>(unidadesDTO, pageable, unidades.getTotalElements());
//	}
	
	@GetMapping
	public Page<UnidadeFornecimentoDTO> pesquisar(Pageable pageable, UnidadeFornecimentoFilter filter) {
		Page<UnidadeFornecimento> unidades = unidadeFornecimentoService.listaByFilter(UnidadeFornecimentoSpecs.filtroGeral(filter), pageable);
		List<UnidadeFornecimentoDTO> unidadesDTO = converter.toDTOCollection(unidades.getContent(), UnidadeFornecimentoDTO.class);
		return new PageImpl<>(unidadesDTO, pageable, unidades.getTotalElements());
	}

}
