package br.com.tt.painelpreco.api.controller;

import java.util.List;
import java.util.UUID;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import java.io.IOException;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import br.com.tt.painelpreco.api.dto.ArtefatoGeradoDTO;
import br.com.tt.painelpreco.api.dto.ArtefatoSecaoLogDTO;
import br.com.tt.painelpreco.api.dto.ProcessoContratacaoDTO;
import br.com.tt.painelpreco.api.dto.form.ProcessoContratacaoForm;
import br.com.tt.painelpreco.arch.api.controller.AbstractController;
import br.com.tt.painelpreco.arch.exception.ArchException;
import br.com.tt.painelpreco.arch.infra.auth.Usuario;
import br.com.tt.painelpreco.domain.model.ArtefatoGerado;
import br.com.tt.painelpreco.domain.model.ArtefatoGerado.TipoEnum;
import br.com.tt.painelpreco.domain.model.ProcessoContratacao;
import br.com.tt.painelpreco.domain.service.ArtefatoGeradoService;
import br.com.tt.painelpreco.domain.service.ProcessoContratacaoService;
import br.com.tt.painelpreco.domain.service.UsuarioService;
import br.com.tt.painelpreco.util.ApiVersion;

@RestController
@RequestMapping(ApiVersion.LATEST + "/processos-contratacao")
public class ProcessoContratacaoController extends AbstractController {

	@Autowired
	private ProcessoContratacaoService processoContratacaoService;

	@Autowired
	private ArtefatoGeradoService artefatoGeradoService;

	@Autowired
	private UsuarioService usuarioService;

	private Usuario getUsuarioLogado() {
		String login = super.getUsuario().getLogin();
		Usuario usuario = usuarioService.findByLogin(login);
		if (usuario == null)
			throw new ArchException("Usuário '" + login + "' não encontrado.");

		return usuario;
	}

	private TipoEnum parseTipo(String tipo) {
		try {
			return TipoEnum.valueOf(tipo.toUpperCase());
		} catch (IllegalArgumentException e) {
			throw new ArchException("Tipo de artefato inválido: " + tipo + " (use etp, tr ou edital)");
		}
	}

	@PostMapping
	public ResponseEntity<ProcessoContratacaoDTO> criar(@Valid @RequestBody ProcessoContratacaoForm form) {
		ProcessoContratacao processo = processoContratacaoService.criar(form, getUsuarioLogado());
		return ResponseEntity.status(HttpStatus.CREATED).body(processoContratacaoService.toDTO(processo));
	}

	@GetMapping("/{uuid}")
	public ProcessoContratacaoDTO buscar(@PathVariable UUID uuid) {
		return processoContratacaoService.toDTO(processoContratacaoService.buscarPorUuid(uuid));
	}

	/** Usado pela tela de intake para redirecionar direto ao processo já existente, em vez de recriar um novo. */
	@GetMapping("/por-cotacao/{cotacaoUuid}")
	public ResponseEntity<ProcessoContratacaoDTO> buscarPorCotacao(@PathVariable UUID cotacaoUuid) {
		ProcessoContratacao processo = processoContratacaoService.buscarPorCotacaoUuid(cotacaoUuid);
		if (processo == null) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(processoContratacaoService.toDTO(processo));
	}

	@PutMapping("/{uuid}")
	public ProcessoContratacaoDTO atualizar(@PathVariable UUID uuid, @Valid @RequestBody ProcessoContratacaoForm form) {
		ProcessoContratacao processo = processoContratacaoService.atualizar(uuid, form);
		return processoContratacaoService.toDTO(processo);
	}

	/**
	 * Gera uma NOVA versão do artefato (nunca sobrescreve uma anterior).
	 * tipo = etp | tr | edital.
	 */
	@PostMapping("/{uuid}/artefatos/{tipo}/gerar")
	public ArtefatoGeradoDTO gerar(@PathVariable UUID uuid, @PathVariable String tipo) {
		ProcessoContratacao processo = processoContratacaoService.buscarPorUuid(uuid);
		ArtefatoGerado artefato = artefatoGeradoService.gerar(parseTipo(tipo), processo, getUsuarioLogado());
		return toArtefatoDTO(artefato);
	}

	@GetMapping("/{uuid}/artefatos/{tipo}/versoes/{versao}/download")
	public ResponseEntity<byte[]> download(@PathVariable UUID uuid, @PathVariable String tipo, @PathVariable Integer versao) {
		ProcessoContratacao processo = processoContratacaoService.buscarPorUuid(uuid);
		ArtefatoGerado artefato = artefatoGeradoService.buscarVersao(processo, parseTipo(tipo), versao);

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.wordprocessingml.document"));
		headers.setContentDispositionFormData("attachment", artefato.getNomeArquivo());
		headers.setContentLength(artefato.getDocx().length);
		return ResponseEntity.ok().headers(headers).body(artefato.getDocx());
	}

	/** Anexa a versão final do artefato (ex.: editada manualmente pelo usuário) — mantida lado a lado com o docx gerado. */
	@PostMapping("/{uuid}/artefatos/{tipo}/versoes/{versao}/arquivo-final")
	public ArtefatoGeradoDTO enviarArquivoFinal(@PathVariable UUID uuid, @PathVariable String tipo, @PathVariable Integer versao,
			@RequestParam("arquivo") MultipartFile arquivo) throws IOException {
		ProcessoContratacao processo = processoContratacaoService.buscarPorUuid(uuid);
		ArtefatoGerado artefato = artefatoGeradoService.buscarVersao(processo, parseTipo(tipo), versao);
		artefato = artefatoGeradoService.enviarArquivoFinal(artefato, arquivo.getBytes(), arquivo.getOriginalFilename(), getUsuarioLogado());
		return toArtefatoDTO(artefato);
	}

	@GetMapping("/{uuid}/artefatos/{tipo}/versoes/{versao}/arquivo-final/download")
	public ResponseEntity<byte[]> downloadArquivoFinal(@PathVariable UUID uuid, @PathVariable String tipo, @PathVariable Integer versao) {
		ProcessoContratacao processo = processoContratacaoService.buscarPorUuid(uuid);
		ArtefatoGerado artefato = artefatoGeradoService.buscarVersao(processo, parseTipo(tipo), versao);
		if (artefato.getDocxFinal() == null) {
			throw new ArchException("Este artefato ainda não possui uma versão final enviada.");
		}

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.wordprocessingml.document"));
		headers.setContentDispositionFormData("attachment", artefato.getNomeArquivoFinal());
		headers.setContentLength(artefato.getDocxFinal().length);
		return ResponseEntity.ok().headers(headers).body(artefato.getDocxFinal());
	}

	@PostMapping("/{uuid}/artefatos/{tipo}/versoes/{versao}/revisar")
	public ArtefatoGeradoDTO revisar(@PathVariable UUID uuid, @PathVariable String tipo, @PathVariable Integer versao) {
		ProcessoContratacao processo = processoContratacaoService.buscarPorUuid(uuid);
		ArtefatoGerado artefato = artefatoGeradoService.buscarVersao(processo, parseTipo(tipo), versao);
		artefato = artefatoGeradoService.marcarRevisado(artefato, getUsuarioLogado());
		return toArtefatoDTO(artefato);
	}

	@GetMapping("/{uuid}/artefatos/{tipo}/versoes/{versao}/log-secoes")
	public List<ArtefatoSecaoLogDTO> logSecoes(@PathVariable UUID uuid, @PathVariable String tipo, @PathVariable Integer versao) {
		ProcessoContratacao processo = processoContratacaoService.buscarPorUuid(uuid);
		ArtefatoGerado artefato = artefatoGeradoService.buscarVersao(processo, parseTipo(tipo), versao);
		return artefatoGeradoService.logSecoes(artefato);
	}

	private ArtefatoGeradoDTO toArtefatoDTO(ArtefatoGerado artefato) {
		ArtefatoGeradoDTO dto = new ArtefatoGeradoDTO();
		dto.setUuid(artefato.getUuid());
		dto.setTipo(artefato.getTipo());
		dto.setVersao(artefato.getVersao());
		dto.setStatus(artefato.getStatus());
		dto.setNomeArquivo(artefato.getNomeArquivo());
		dto.setGeradoEm(artefato.getGeradoEm());
		dto.setRevisadoEm(artefato.getRevisadoEm());
		dto.setNomeArquivoFinal(artefato.getNomeArquivoFinal());
		dto.setFinalEnviadoEm(artefato.getFinalEnviadoEm());
		return dto;
	}

}
