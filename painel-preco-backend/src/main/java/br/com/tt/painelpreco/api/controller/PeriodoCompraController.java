package br.com.tt.painelpreco.api.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.tt.painelpreco.api.dto.PeriodoCompraDTO;
import br.com.tt.painelpreco.domain.model.vo.PeriodoCompra;
import br.com.tt.painelpreco.util.ApiVersion;

@RestController
@RequestMapping(ApiVersion.LATEST + "/periodos-compra")
public class PeriodoCompraController {
	
	@GetMapping
	public List<PeriodoCompraDTO> listar() {
		Map<Integer,String> map = PeriodoCompra.getPeriodos();
		List<PeriodoCompraDTO> periodosDTO = new ArrayList<>();
		for (Integer key : map.keySet())
			periodosDTO.add(new PeriodoCompraDTO(key, map.get(key)));
		
		periodosDTO.sort((p, o) -> {
			return p.compareTo(o);
		});

		return periodosDTO;
	}

}
