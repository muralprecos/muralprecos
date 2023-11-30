package br.com.tt.painelpreco.api.controller;

import java.math.BigDecimal;
import java.util.LinkedList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.tt.painelpreco.api.dto.AnoCompraDTO;
import br.com.tt.painelpreco.api.dto.form.filter.AnoCompraFilter;
import br.com.tt.painelpreco.domain.service.LicitacaoService;
import br.com.tt.painelpreco.util.ApiVersion;

@RestController
@RequestMapping(ApiVersion.LATEST + "/anos-compra")
public class AnoCompraController {
	
	@Autowired
	private LicitacaoService licitacaoService;
	
//	@GetMapping
//	public List<AnoCompraDTO> listar() {
//		List<AnoCompraDTO> anos = new LinkedList<>();
//		licitacaoService.listaAllAnos().forEach(a -> {
//			anos.add(new AnoCompraDTO(a));
//		});
//		return anos;
//	}
	
	@GetMapping
	public Page<AnoCompraDTO> pesquisar(Pageable pageable, AnoCompraFilter filter) {
		Page<BigDecimal> anosCompras = licitacaoService.listaAllAnos(filter.getAno(), pageable);
		
		List<AnoCompraDTO> anosComprasDTO = new LinkedList<>();
		anosCompras.forEach(a -> {
			anosComprasDTO.add(new AnoCompraDTO(a.intValue()));
		});
		return new PageImpl<>(anosComprasDTO, pageable, anosCompras.getTotalElements());
	}


}
