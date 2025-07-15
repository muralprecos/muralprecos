package br.com.tt.painelpreco.api.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import br.com.tt.painelpreco.arch.api.controller.AbstractController;
import br.com.tt.painelpreco.domain.repository.OrganizacaoRepository;
import br.com.tt.painelpreco.util.ApiVersion;

@RestController
@RequestMapping(ApiVersion.LATEST + "/logo")
public class LogoController extends AbstractController {
	
	@Autowired
	private OrganizacaoRepository organizacaoRepository;
	
	@PostMapping
	public ResponseEntity<?> imprimir(@RequestParam("idOrganizacao") Integer idOrganizacao, @RequestParam("logo") MultipartFile logo, @RequestParam("nome") String nome) throws IOException {
		organizacaoRepository.updateLogo(idOrganizacao, logo.getBytes(), nome);
		return ResponseEntity.ok().build();
	}

}
