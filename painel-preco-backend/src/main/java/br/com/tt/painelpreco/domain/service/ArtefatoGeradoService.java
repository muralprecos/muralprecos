package br.com.tt.painelpreco.domain.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.transaction.Transactional;

import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import br.com.tt.painelpreco.api.dto.ArtefatoSecaoLogDTO;
import br.com.tt.painelpreco.arch.exception.ArchException;
import br.com.tt.painelpreco.arch.infra.auth.Usuario;
import br.com.tt.painelpreco.domain.model.ArtefatoGerado;
import br.com.tt.painelpreco.domain.model.ArtefatoGerado.StatusEnum;
import br.com.tt.painelpreco.domain.model.ArtefatoGerado.TipoEnum;
import br.com.tt.painelpreco.domain.model.ArtefatoSecaoLog;
import br.com.tt.painelpreco.domain.model.ProcessoContratacao;
import br.com.tt.painelpreco.domain.repository.ArtefatoGeradoRepository;
import br.com.tt.painelpreco.domain.repository.ArtefatoSecaoLogRepository;
import br.com.tt.painelpreco.domain.repository.ProcessoContratacaoRepository;
import br.com.tt.painelpreco.domain.service.docx.DocxClauseSelectionService;
import br.com.tt.painelpreco.domain.service.docx.DocxDeterministicFillService;
import br.com.tt.painelpreco.domain.service.docx.DocxSecaoDraftService;
import br.com.tt.painelpreco.domain.service.docx.DocxTemplateEngine;

/**
 * Orquestra a geração de um artefato (ETP, TR ou Edital): abre o template,
 * roda os passos de IA (seleção de cláusula para TR/Edital, redação restrita
 * para o ETP) e depois o preenchimento determinístico de fatos, persiste uma
 * NOVA versão (append-only) e o log de auditoria por seção.
 */
@Service
public class ArtefatoGeradoService {

	private static final String TEMPLATE_TR = "templates/tr-clean-base.docx";
	private static final String TEMPLATE_ETP = "templates/etp/etp-base.docx";
	private static final String TEMPLATE_EDITAL = "templates/edital-clean-base.docx";

	@Autowired
	private ArtefatoGeradoRepository artefatoGeradoRepository;

	@Autowired
	private ArtefatoSecaoLogRepository artefatoSecaoLogRepository;

	@Autowired
	private ProcessoContratacaoRepository processoContratacaoRepository;

	@Autowired
	private DocxClauseSelectionService clauseSelectionService;

	@Autowired
	private DocxSecaoDraftService secaoDraftService;

	@Autowired
	private DocxDeterministicFillService deterministicFillService;

	@Autowired
	private DocxTemplateEngine templateEngine;

	@Value("${llm.api.model}")
	private String modeloLlm;

	public ArtefatoGerado gerar(TipoEnum tipo, ProcessoContratacao processo, Usuario usuarioLogado) {
		switch (tipo) {
			case TR:
				return gerarTermoReferencia(processo, usuarioLogado);
			case ETP:
				return gerarEtp(processo, usuarioLogado);
			case EDITAL:
				return gerarEdital(processo, usuarioLogado);
			default:
				throw new ArchException("Tipo de artefato desconhecido: " + tipo);
		}
	}

	@Transactional
	public ArtefatoGerado gerarTermoReferencia(ProcessoContratacao processo, Usuario usuarioLogado) {
		try (InputStream template = new ClassPathResource(TEMPLATE_TR).getInputStream();
				XWPFDocument doc = new XWPFDocument(template)) {

			ArtefatoGerado artefato = criarEsqueleto(processo, TipoEnum.TR, TEMPLATE_TR, usuarioLogado);

			// Passo B (cláusulas binárias pré-catalogadas) e Passo C (redação por seção via IA)
			// antes do Passo A: o texto de uma cláusula pode conter {{FACTS:*}} (ex.: dotação
			// orçamentária), resolvido só no Passo A a seguir.
			List<ArtefatoSecaoLog> logs = new ArrayList<>(clauseSelectionService.preencherClausulasTR(doc, processo, artefato));
			logs.addAll(secaoDraftService.redigirTermoReferencia(doc, processo, artefato));
			deterministicFillService.preencherFatos(doc, processo);

			return finalizar(doc, artefato, logs, processo);
		} catch (IOException e) {
			throw new ArchException("Falha ao gerar o Termo de Referência: " + e.getMessage(), e);
		}
	}

	@Transactional
	public ArtefatoGerado gerarEtp(ProcessoContratacao processo, Usuario usuarioLogado) {
		try (InputStream template = new ClassPathResource(TEMPLATE_ETP).getInputStream();
				XWPFDocument doc = new XWPFDocument(template)) {

			ArtefatoGerado artefato = criarEsqueleto(processo, TipoEnum.ETP, TEMPLATE_ETP, usuarioLogado);

			// Redação restrita (Passo C) primeiro, pelo mesmo motivo do TR: o
			// texto redigido não deve introduzir tokens novos, mas por
			// segurança a ordem é mantida consistente com o TR.
			List<ArtefatoSecaoLog> logs = secaoDraftService.redigirEtp(doc, processo, artefato);
			deterministicFillService.preencherFatos(doc, processo);

			return finalizar(doc, artefato, logs, processo);
		} catch (IOException e) {
			throw new ArchException("Falha ao gerar o Estudo Técnico Preliminar: " + e.getMessage(), e);
		}
	}

	@Transactional
	public ArtefatoGerado gerarEdital(ProcessoContratacao processo, Usuario usuarioLogado) {
		try (InputStream template = new ClassPathResource(TEMPLATE_EDITAL).getInputStream();
				XWPFDocument doc = new XWPFDocument(template)) {

			ArtefatoGerado artefato = criarEsqueleto(processo, TipoEnum.EDITAL, TEMPLATE_EDITAL, usuarioLogado);

			// Mesma engine e mesma ordem do TR: Passo B (seleção de cláusula, que pode
			// introduzir novos {{FACTS:*}}) e Passo C (redação por seção) antes do Passo A.
			List<ArtefatoSecaoLog> logs = new ArrayList<>(clauseSelectionService.preencherClausulasEdital(doc, processo, artefato));
			logs.addAll(secaoDraftService.redigirEdital(doc, processo, artefato));
			deterministicFillService.preencherFatos(doc, processo);

			return finalizar(doc, artefato, logs, processo);
		} catch (IOException e) {
			throw new ArchException("Falha ao gerar o Edital: " + e.getMessage(), e);
		}
	}

	private ArtefatoGerado criarEsqueleto(ProcessoContratacao processo, TipoEnum tipo, String template, Usuario usuarioLogado) {
		ArtefatoGerado artefato = new ArtefatoGerado();
		artefato.setUuid(UUID.randomUUID());
		artefato.setProcessoContratacao(processo);
		artefato.setTipo(tipo);
		artefato.setVersao(proximaVersao(processo, tipo));
		artefato.setStatus(StatusEnum.RASCUNHO);
		artefato.setModeloBase(template);
		artefato.setModeloLlm(modeloLlm);
		artefato.setGeradoPor(usuarioLogado);
		artefato.setGeradoEm(new Date());
		artefato.setNomeArquivo(tipo + "-" + processo.getUuid() + "-v" + artefato.getVersao() + ".docx");
		return artefato;
	}

	private ArtefatoGerado finalizar(XWPFDocument doc, ArtefatoGerado artefato, List<ArtefatoSecaoLog> logs, ProcessoContratacao processo) throws IOException {
		// Sinaliza (com "⚠") os pontos do modelo AGU que não foram resolvidos por nenhum
		// {{FACTS:*}}/{{CLAUSE:*}} — percentuais/prazos/índices que são decisão jurídica de
		// cada contratação, que o sistema não conhece e não deve adivinhar. Ver
		// DocxTemplateEngine.sinalizarLacunasPendentes.
		templateEngine.sinalizarLacunasPendentes(doc.getParagraphs(), doc.getTables());

		ByteArrayOutputStream saida = new ByteArrayOutputStream();
		doc.write(saida);
		// Remove os comentários de orientação do modelo AGU (o POI preserva essa parte do
		// .docx intacta ao reescrever) — sem isso, o documento entregue ao usuário ainda
		// carrega dezenas de comentários internos do modelo, dando a impressão de template
		// inacabado. Ver DocxTemplateEngine.removerComentarios.
		artefato.setDocx(templateEngine.removerComentarios(saida.toByteArray()));

		artefato = artefatoGeradoRepository.save(artefato);
		artefatoSecaoLogRepository.saveAll(logs);

		if (processo.getStatus() == ProcessoContratacao.StatusEnum.INTAKE) {
			processo.setStatus(ProcessoContratacao.StatusEnum.RASCUNHO_DISPONIVEL);
			processoContratacaoRepository.save(processo);
		}

		return artefato;
	}

	private int proximaVersao(ProcessoContratacao processo, TipoEnum tipo) {
		ArtefatoGerado ultimo = artefatoGeradoRepository.findFirstByProcessoContratacaoAndTipoOrderByVersaoDesc(processo, tipo);
		return ultimo == null ? 1 : ultimo.getVersao() + 1;
	}

	public ArtefatoGerado buscarVersao(ProcessoContratacao processo, TipoEnum tipo, Integer versao) {
		ArtefatoGerado artefato = artefatoGeradoRepository.findByProcessoContratacaoAndTipoAndVersao(processo, tipo, versao);
		if (artefato == null) {
			throw new ArchException(String.format("Artefato %s versão %d não encontrado para este processo.", tipo, versao));
		}
		return artefato;
	}

	@Transactional
	public ArtefatoGerado marcarRevisado(ArtefatoGerado artefato, Usuario usuarioLogado) {
		artefato.setStatus(StatusEnum.REVISADO);
		artefato.setRevisadoPor(usuarioLogado);
		artefato.setRevisadoEm(new Date());
		return artefatoGeradoRepository.save(artefato);
	}

	/**
	 * Anexa a versão final do artefato (ex.: o rascunho gerado, editado manualmente pelo
	 * usuário no Word) — mantida lado a lado com o docx gerado pelo sistema, nunca o
	 * substitui. O envio já marca o artefato como revisado, pois enviar a versão final é,
	 * em si, o ato de concluir a revisão.
	 */
	@Transactional
	public ArtefatoGerado enviarArquivoFinal(ArtefatoGerado artefato, byte[] conteudo, String nomeArquivo, Usuario usuarioLogado) {
		artefato.setDocxFinal(conteudo);
		artefato.setNomeArquivoFinal(nomeArquivo);
		artefato.setFinalEnviadoPor(usuarioLogado);
		artefato.setFinalEnviadoEm(new Date());
		artefato.setStatus(StatusEnum.REVISADO);
		artefato.setRevisadoPor(usuarioLogado);
		artefato.setRevisadoEm(new Date());
		return artefatoGeradoRepository.save(artefato);
	}

	public List<ArtefatoSecaoLogDTO> logSecoes(ArtefatoGerado artefato) {
		List<ArtefatoSecaoLogDTO> dtos = new ArrayList<>();
		for (ArtefatoSecaoLog log : artefatoSecaoLogRepository.findByArtefatoGeradoOrderByIdAsc(artefato)) {
			ArtefatoSecaoLogDTO dto = new ArtefatoSecaoLogDTO();
			dto.setSecaoChave(log.getSecaoChave());
			dto.setOrigem(log.getOrigem());
			dto.setClausulaSelecionada(log.getClausulaSelecionada());
			dto.setFactsEnviados(log.getFactsEnviados());
			dto.setRespostaBruta(log.getRespostaBruta());
			dtos.add(dto);
		}
		return dtos;
	}

}
