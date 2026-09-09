package br.com.tt.painelpreco.pncp.domain.service;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.tt.painelpreco.domain.model.ItemLicitacao;
import br.com.tt.painelpreco.domain.model.Licitacao;
import br.com.tt.painelpreco.domain.model.UnidadeFornecimento;
import br.com.tt.painelpreco.domain.repository.ItemLicitacaoRepository;
import br.com.tt.painelpreco.domain.repository.LicitacaoRepository;
import br.com.tt.painelpreco.domain.service.UnidadeFornecimentoService;
import br.com.tt.painelpreco.pncp.domain.model.IngestaoDadosPncp;
import br.com.tt.painelpreco.pncp.domain.model.LogErro;
import br.com.tt.painelpreco.pncp.domain.repository.IngestaoDadosPncpRepository;
import br.com.tt.painelpreco.pncp.domain.repository.LogErroRepository;
import br.com.tt.painelpreco.util.IOUtil;

@Service
public class IngestaoItemLicitacaoService {

	@Autowired
	private LicitacaoRepository licitacaoRepository;

	@Autowired
	private ItemLicitacaoRepository itemLicitacaoRepository;

	@Autowired
	private UnidadeFornecimentoService unidadeFornecimentoService;

	@Autowired
	private IngestaoDadosPncpRepository pncpRepository;

	@Autowired
	private LogErroRepository logErroRepository;

	@PersistenceContext
	private EntityManager entityManager;

	private final TransactionTemplate transactionTemplate;

	@Value("${pncp.api.output.dir}")
	private String jsonDir;

	// Nº de licitações processadas por transação. Cada bloco é persistido, "flushado" e a
	// sessão é limpa (flush + clear) antes do próximo, para que nem o cache de 1º nível do
	// Hibernate nem o indexing plan do Hibernate Search (ItemLicitacao é @Indexed) cresçam
	// sem limite e estourem o heap — foi o que travava a coleta da madrugada.
	@Value("${pncp.coleta.itens.bloco-licitacoes:150}")
	private int blocoLicitacoes;

	@Autowired
	public IngestaoItemLicitacaoService(PlatformTransactionManager transactionManager) {
		this.transactionTemplate = new TransactionTemplate(transactionManager);
	}

	// Sem @Transactional: a transação é aberta por bloco (processaBloco), nunca para a coleta inteira.
	public void carregaItensLicitacaoBaixadosNoBanco() {
		long inicio = System.currentTimeMillis();

		List<Long> idsPendentes = licitacaoRepository.findIdsPendentesImportacaoItens();
		int totalPendentes = idsPendentes.size();
		int totalBlocos = (totalPendentes + blocoLicitacoes - 1) / blocoLicitacoes;
		System.out.printf("INFO: %d licitações pendentes de importação de itens (%d blocos de até %d).%n",
				totalPendentes, totalBlocos, blocoLicitacoes);

		int totalItens = 0;

		for (int i = 0; i < totalPendentes; i += blocoLicitacoes) {
			List<Long> bloco = idsPendentes.subList(i, Math.min(i + blocoLicitacoes, totalPendentes));
			int numBloco = (i / blocoLicitacoes) + 1;
			try {
				int itensBloco = processaBloco(bloco);
				totalItens += itensBloco;
				System.out.printf("INFO: Bloco %d/%d — %d licitações, %d itens (acumulado: %d) em %.1fs%n",
						numBloco, totalBlocos, bloco.size(), itensBloco, totalItens,
						(System.currentTimeMillis() - inicio) / 1000.0);
			} catch (Exception e) {
				// fail-open: um bloco que falha não impede os demais; os já commitados permanecem.
				System.err.printf("ERROR: Falha no bloco %d/%d: %s%n", numBloco, totalBlocos, e.getMessage());
				logErroRepository.save(new LogErro(new Date(), "DatabaseItemIngestor",
						"Falha no bloco " + numBloco + "/" + totalBlocos + ": " + e.getMessage()));
			}
		}

		atualizaRegistroIngestao(totalPendentes, totalItens);

		//limpa diretorio
		//FileSystemUtils.deleteRecursively(new File(jsonDir));
		try {
			IOUtil.zipDirectory(jsonDir, getFileZipName());
		} catch (IOException e) {
			e.printStackTrace();
		}

		double tempoTotal = (System.currentTimeMillis() - inicio) / 1000.0;
		System.out.println(String.format("Tempo de processamento: %.6f segundos", tempoTotal));
	}

	/** Processa um bloco de licitações em transação própria. Retorna o nº de itens persistidos. */
	private int processaBloco(List<Long> idsLicitacao) {
		Integer itensPersistidos = transactionTemplate.execute(status -> {
			ObjectMapper mapper = new ObjectMapper();

			List<Licitacao> licitacoes = licitacaoRepository.findAllByIdIn(idsLicitacao);

			Set<UnidadeFornecimento> unidadesFornecimento = new HashSet<>();
			Set<ItemLicitacao> itens = new HashSet<>();

			for (Licitacao licitacao : licitacoes) {
				String numeroPncp = licitacao.getNumeroPncp();

				// O nome base substitui "/" por "-" conforme o original
				String nomeBaseArquivo = "itens-" + numeroPncp.replace("/", "-");

				for (int pagina = 1; pagina < 10000; pagina++) {
					String caminhoArquivo = String.format(jsonDir + "itens/%s-%d.json", nomeBaseArquivo, pagina);
					File arqJson = new File(caminhoArquivo);

					if (!arqJson.exists()) {
						break;
					}

					try {
						JsonNode rootNode = mapper.readTree(arqJson);

						// O código Python itera direto no 'dados' (espera um Array no JSON)
						if (rootNode.isArray()) {
							for (JsonNode dado : rootNode) {
								// Unidade de Fornecimento
								String unidadeMedida = dado.get("unidadeMedida").asText();
								UnidadeFornecimento unidadeFornecimento = new UnidadeFornecimento(unidadeMedida);
								unidadesFornecimento.add(unidadeFornecimento);

								// Mapeamento do Item
								ItemLicitacao item = new ItemLicitacao();
								item.setNumeroPncp(numeroPncp);
								item.setNumeroItem(dado.get("numeroItem").asInt());
								item.setDescricao(dado.get("descricao").asText());
								item.setQuantidade(dado.get("quantidade").asInt());
								item.setValor(dado.get("valorTotal").asDouble());
								item.setCodigo(dado.get("catalogoCodigoItem") != null ? dado.get("catalogoCodigoItem").asText() : null);
								item.setDescricaoComplementar(dado.get("informacaoComplementar") != null ? dado.get("informacaoComplementar").asText() : "");
								item.setUnidadeFornecimento(unidadeFornecimento);
								item.setLicitacao(licitacao);

								itens.add(item);
							}
						}
					} catch (Exception e) {
						System.err.println("Erro ao processar arquivo: " + caminhoArquivo + " - " + e.getMessage());
						logErroRepository.save(new LogErro(new Date(), "DatabaseItemIngestor", "Erro ao processar arquivo: " + caminhoArquivo + " - " + e.getMessage()));
					}
				}
			}

			// Persistência do bloco
			unidadeFornecimentoService.saveAll(unidadesFornecimento);

			Map<String, UnidadeFornecimento> unidadesFornecimentoMap = new HashMap<>();
			unidadeFornecimentoService.findAll().forEach(unidade -> {
				unidadesFornecimentoMap.put(unidade.getNome(), unidade);
			});

			itens.forEach(item -> {
				item.setUnidadeFornecimento(unidadesFornecimentoMap.get(item.getUnidadeFornecimento().getNome()));
			});

			itemLicitacaoRepository.saveAll(itens);

			// Descarrega os itens deste bloco (SQL + índice Lucene) e desanexa tudo da sessão,
			// para o próximo bloco começar com o contexto de persistência vazio.
			entityManager.flush();
			entityManager.clear();

			return itens.size();
		});

		return itensPersistidos == null ? 0 : itensPersistidos;
	}

	/** Atualiza o registro de ingestão em transação curta e isolada. */
	private void atualizaRegistroIngestao(int totalLicitacoes, int totalItens) {
		transactionTemplate.execute(status -> {
			IngestaoDadosPncp ingestaoDadosPncp = pncpRepository.findAtualIngestaoData();
			if (ingestaoDadosPncp == null) {
				System.err.println("WARN: Nenhum registro de ingestão em aberto para atualizar.");
				return null;
			}
			ingestaoDadosPncp.setDataFim(LocalDateTime.now());
			ingestaoDadosPncp.setStatus(1);
			ingestaoDadosPncp.setTotalLicitacao(totalLicitacoes);
			ingestaoDadosPncp.setTotalItensLicitacao(totalItens);
			pncpRepository.save(ingestaoDadosPncp);
			return null;
		});
	}

	private String getFileZipName() {
		// 1. Defina o padrão (ex: 2023-10-27_14-30-05)
		DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss");

		// 2. Obtenha a data/hora atual e formate
		String timestamp = dtf.format(LocalDateTime.now());

		// 3. Monte o nome do arquivo
		return "backup_" + timestamp + ".zip";
	}

}
