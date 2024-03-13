package br.com.tt.painelpreco.api.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.tt.painelpreco.api.dto.CotacaoDTO;
import br.com.tt.painelpreco.api.dto.form.CotacaoForm;
import br.com.tt.painelpreco.api.dto.form.CotacaoValidacaoForm;
import br.com.tt.painelpreco.arch.api.controller.AbstractController;
import br.com.tt.painelpreco.domain.model.Cotacao;
import br.com.tt.painelpreco.domain.service.CotacaoService;
import br.com.tt.painelpreco.util.ApiVersion;
import br.com.tt.painelpreco.util.DateUtil;
import br.com.tt.painelpreco.util.MessageDigestUtil;
import br.com.tt.painelpreco.util.ModelConverter;

@RestController
@RequestMapping(ApiVersion.LATEST + "/cotacoes")
public class CotacaoController extends AbstractController {
	
	private static final String LINK_VALIDACAO_COTACAO = ApiVersion.LATEST + "/cotacoes/%s/validar";

	private static final Object DATA_SOURCE = "https://paineldeprecos.planejamento.gov.br/";

	@Autowired
	private CotacaoService cotacaoService;
	
	@Autowired
	private ModelConverter converter;
	
	@PostMapping
	public ResponseEntity<?> imprimir(@RequestBody CotacaoForm cotacaoForm, HttpServletResponse response) {
		UUID[] itens = cotacaoForm.getItens();
		String usuario = super.getUsuario().getLogin();
		String ip = super.getRemoteAddress();
		String stringBusca = cotacaoService.findStringBuscaByItens(itens);
		Date agora = new Date();
		String agoraStr = DateUtil.format(agora, "dd/MM/yyyy");
		String nome = usuario + " - " + stringBusca + " - " + agoraStr;
		String nomeArquivo = String.format("Cotacao-%s.pdf", DateUtil.format(new Date(), "dd-MM-yyyy"));
		
		Cotacao cotacao = new Cotacao();
		cotacao.setCriadoPor(usuario);
		cotacao.setIp(ip);
		cotacao.setStringBusca(stringBusca);
		cotacao.setCriadoEm(agora);
		cotacao.setNome(nome);
		cotacao.setNomeArquivo(nomeArquivo);
		
		
		String hashValidacao = MessageDigestUtil.getHashMD5(cotacao.toString().getBytes());
		cotacao.setHashValidacao(hashValidacao);
		
		Map<String, Object> params = new HashMap<>();
		params.put("itens", itens);
		params.put("queryString", stringBusca);
		params.put("nome", nome);
		params.put("cabecalho", "TT Soluções & Consultoria - Unidade de Compras e Licitações");
		params.put("dataPesquisa", agoraStr);
		params.put("dataGeracao", agoraStr);
		params.put("ip", ip);
		params.put("hashValidacao", hashValidacao);
		params.put("linkValidacao", super.getAppDomain() + String.format(LINK_VALIDACAO_COTACAO, hashValidacao));
		params.put("fonte", DATA_SOURCE);
		params.put("subreportCotacaoDetalhe", super.getReport("cotacao_detalhes"));
		
		byte[] pdf = super.reportExportPDF("cotacao", params);
		cotacao.setArquivo(pdf);
		
		cotacaoService.save(cotacao);
		
		super.downloadPDF(pdf, response, nomeArquivo);
		return ResponseEntity.ok().build(); 
	}
	
	@GetMapping("{hash}/validar")
	public ResponseEntity<?> validar(@PathVariable String hash, HttpServletResponse response) {
		Cotacao cotacao = cotacaoService.findByHashValidacao(hash);
		
		if (cotacao == null || cotacao.getArquivo() == null)
			return ResponseEntity.notFound().build();
		
		super.downloadPDF(cotacao.getArquivo(), response, cotacao.getNomeArquivo());
		return ResponseEntity.ok().build(); 
	}
	
	@PostMapping("/validacao")
	public ResponseEntity<CotacaoDTO> validarPost(@RequestBody CotacaoValidacaoForm form, HttpServletResponse response) {
		Cotacao cotacao = cotacaoService.findByHashValidacao(form.getHash());
		
		if (cotacao == null || cotacao.getArquivo() == null)
			return ResponseEntity.notFound().build();
		
		CotacaoDTO cotacaoDTO = converter.toDTO(cotacao, CotacaoDTO.class);
		return ResponseEntity.ok(cotacaoDTO);
	}
	
	@GetMapping
	public Page<CotacaoDTO> listar(@PageableDefault(size = 10) Pageable pageable) {
		Page<Cotacao> cotacoes = cotacaoService.findAllSemArquivo(pageable);
		
		List<CotacaoDTO> cotacoesDTO = converter.toDTOCollection(cotacoes.getContent(), CotacaoDTO.class);
		
		return new PageImpl<>(cotacoesDTO, pageable, cotacoes.getTotalElements());
	}
	
	@GetMapping("/{uuid}")
	public CotacaoDTO buscar(@PathVariable UUID uuid) {
		Cotacao cotacao = cotacaoService.findByUuid(uuid);
		
		return converter.toDTO(cotacao, CotacaoDTO.class);
	}

}
