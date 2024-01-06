package br.com.tt.painelpreco.api.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.tt.painelpreco.api.dto.form.CotacaoForm;
import br.com.tt.painelpreco.arch.api.controller.AbstractController;
import br.com.tt.painelpreco.domain.service.ItemLicitacaoService;
import br.com.tt.painelpreco.util.ApiVersion;
import br.com.tt.painelpreco.util.DateUtil;

@RestController
@RequestMapping(ApiVersion.LATEST + "/cotacoes")
public class CotacaoController extends AbstractController {
	
	@Autowired
	private ItemLicitacaoService itemLicitacaoService;
	
	@PostMapping
	public ResponseEntity<?> imprimir(@RequestBody CotacaoForm cotacaoForm, HttpServletResponse response) {
		List<Integer> catmats = new ArrayList<>();
		UUID[] uuids = cotacaoForm.getItens();
		
		itemLicitacaoService.findAllByUuid(Arrays.asList(uuids)).forEach((item) -> {
			catmats.add(item.getCatMat());
		});
		
		if (catmats == null || catmats.isEmpty())
			return ResponseEntity.notFound().build();
		
		Map<String, Object> params = new HashMap<>();
		params.put("catmats", catmats);
		
		super.reportExportPDF("cotacao", params, response, String.format("Cotacao-%s.pdf", DateUtil.format(new Date(), "dd-MM-yyyy")));
		return ResponseEntity.ok().build(); 
	}

}
