package br.com.tt.painelpreco.pncp.domain.service;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

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
import br.com.tt.painelpreco.domain.repository.UnidadeFornecimentoRepository;
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
	private UnidadeFornecimentoRepository unidadeFornecimentoRepository;

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

	// Tentativas por bloco antes de desistir dele nesta execução. Um bloco que falha em todas
	// NÃO é pulado: suas licitações continuam sem itens e voltam no findIdsPendentes... da
	// próxima execução (retentativa automática entre execuções). A execução atual é marcada
	// como concluída-com-falhas (status 2) e sinaliza erro na etapa.
	@Value("${pncp.coleta.itens.max-tentativas:3}")
	private int maxTentativas;

	// Espera base entre tentativas (multiplicada pelo nº da tentativa: 5s, 10s, ...).
	@Value("${pncp.coleta.itens.retry-espera-ms:5000}")
	private long retryEsperaMs;

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

		// Cache de unidades de fornecimento carregado UMA vez e reusado entre os blocos
		// (tabela com dezenas de milhares de linhas — recarregar por bloco seria O(n²)).
		// Entradas novas criadas durante a ingestão são adicionadas aqui.
		Map<String, UnidadeFornecimento> unidadeCache = new HashMap<>();
		unidadeFornecimentoRepository.findAll().forEach(u -> unidadeCache.put(u.getNome(), u));
		System.out.printf("INFO: Cache de unidades de fornecimento: %d entradas.%n", unidadeCache.size());

		int totalItens = 0;
		int blocosComFalha = 0;
		List<Long> licitacoesNaoIngeridas = new ArrayList<>();

		for (int i = 0; i < totalPendentes; i += blocoLicitacoes) {
			List<Long> bloco = new ArrayList<>(idsPendentes.subList(i, Math.min(i + blocoLicitacoes, totalPendentes)));
			int numBloco = (i / blocoLicitacoes) + 1;

			Integer itensBloco = processaBlocoComRetry(bloco, unidadeCache, numBloco, totalBlocos);

			if (itensBloco == null) {
				// Falhou em todas as tentativas. Nada foi commitado para este bloco (rollback),
				// então as licitações seguem pendentes e serão reprocessadas na próxima execução.
				blocosComFalha++;
				licitacoesNaoIngeridas.addAll(bloco);
				System.err.printf("ERROR: Bloco %d/%d desistido após %d tentativas — %d licitações ficam para a próxima execução.%n",
						numBloco, totalBlocos, maxTentativas, bloco.size());
			} else {
				totalItens += itensBloco;
				if (itensBloco > 0 || numBloco % 50 == 0) {
					System.out.printf("INFO: Bloco %d/%d — %d licitações, %d itens (acumulado: %d) em %.1fs%n",
							numBloco, totalBlocos, bloco.size(), itensBloco, totalItens,
							(System.currentTimeMillis() - inicio) / 1000.0);
				}
			}
		}

		atualizaRegistroIngestao(totalPendentes, totalItens, blocosComFalha, licitacoesNaoIngeridas);

		//limpa diretorio
		//FileSystemUtils.deleteRecursively(new File(jsonDir));
		try {
			IOUtil.zipDirectory(jsonDir, getFileZipName());
		} catch (IOException e) {
			e.printStackTrace();
		}

		double tempoTotal = (System.currentTimeMillis() - inicio) / 1000.0;
		System.out.println(String.format("Tempo de processamento: %.6f segundos", tempoTotal));

		if (blocosComFalha > 0) {
			// Sinaliza a etapa como falha (ColetaDadosPncpService.executarEtapa registra em LogErro
			// e segue para as próximas etapas). As licitações não ingeridas serão reprocessadas.
			throw new IllegalStateException(String.format(
					"Ingestão de itens concluída parcialmente: %d de %d blocos falharam após %d tentativas; "
							+ "%d licitações não ingeridas serão reprocessadas na próxima execução.",
					blocosComFalha, totalBlocos, maxTentativas, licitacoesNaoIngeridas.size()));
		}
	}

	/**
	 * Processa um bloco repetindo em caso de falha (falhas transitórias: deadlock, conexão,
	 * pressão de memória). Retorna o nº de itens persistidos, ou {@code null} se falhou em
	 * todas as tentativas.
	 */
	private Integer processaBlocoComRetry(List<Long> idsLicitacao, Map<String, UnidadeFornecimento> unidadeCache,
			int numBloco, int totalBlocos) {
		for (int tentativa = 1; tentativa <= maxTentativas; tentativa++) {
			// Unidades novas criadas nesta tentativa. Só são promovidas ao cache compartilhado
			// se a transação do bloco commitar — se der rollback, a linha some do banco e não
			// pode ficar no cache (senão a retentativa referenciaria um FK inexistente).
			Map<String, UnidadeFornecimento> novasUnidades = new HashMap<>();
			try {
				int n = processaBloco(idsLicitacao, unidadeCache, novasUnidades);
				unidadeCache.putAll(novasUnidades);
				return n;
			} catch (Exception e) {
				String msg = String.format("Bloco %d/%d falhou (tentativa %d/%d): %s",
						numBloco, totalBlocos, tentativa, maxTentativas, e.getMessage());
				System.err.println("ERROR: " + msg);
				logErroRepository.save(new LogErro(new Date(), "DatabaseItemIngestor", msg));
				if (tentativa < maxTentativas) {
					dormir(retryEsperaMs * tentativa);
				}
			}
		}

		// Todas as tentativas lançaram exceção — mas TransactionTemplate.execute() também lança
		// quando a falha ocorre DEPOIS do commit (ex.: na indexação Lucene pós-commit), caso em
		// que os dados da última tentativa já estão corretos no banco. Reconcilia com a realidade
		// do banco antes de desistir, pra não reportar como "vai reprocessar" algo que já foi
		// gravado com sucesso (e não gerar reprocessamento infinito nas próximas execuções).
		if (itemLicitacaoRepository.existsByLicitacaoIdIn(idsLicitacao)) {
			long n = itemLicitacaoRepository.countByLicitacaoIdIn(idsLicitacao);
			System.out.printf("INFO: Bloco %d/%d — dados já commitados na última tentativa (só a "
					+ "indexação/pós-commit falhou); %d itens. Índice de busca pode estar "
					+ "temporariamente desatualizado para este bloco.%n", numBloco, totalBlocos, n);
			return (int) n;
		}

		return null;
	}

	/** Processa um bloco de licitações em transação própria. Retorna o nº de itens persistidos. */
	private int processaBloco(List<Long> idsLicitacao, Map<String, UnidadeFornecimento> unidadeCache,
			Map<String, UnidadeFornecimento> novasUnidades) {
		Integer itensPersistidos = transactionTemplate.execute(status -> {
			ObjectMapper mapper = new ObjectMapper();

			// Idempotência: se uma tentativa anterior deste bloco commitou no banco e só falhou
			// depois (ex.: indexação Lucene pós-commit do Hibernate Search), os itens dela ainda
			// estão aqui. Como estas licitações estavam pendentes (zero itens) no início do run,
			// qualquer item presente agora é resíduo desta mesma execução — seguro apagar e
			// reconstruir do zero a cada tentativa, em vez de duplicar.
			itemLicitacaoRepository.deleteByLicitacaoIdIn(idsLicitacao);

			List<Licitacao> licitacoes = licitacaoRepository.findAllByIdIn(idsLicitacao);

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
								// Unidade de Fornecimento (resolvida/criada via cache compartilhado)
								String unidadeMedida = dado.get("unidadeMedida").asText();
								UnidadeFornecimento unidadeFornecimento = resolveUnidade(unidadeMedida, unidadeCache, novasUnidades);

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
						// Erro em um arquivo isolado: a licitação fica sem (parte dos) itens e volta
						// como pendente na próxima execução; não derruba o bloco inteiro.
						System.err.println("Erro ao processar arquivo: " + caminhoArquivo + " - " + e.getMessage());
						logErroRepository.save(new LogErro(new Date(), "DatabaseItemIngestor", "Erro ao processar arquivo: " + caminhoArquivo + " - " + e.getMessage()));
					}
				}
			}

			itemLicitacaoRepository.saveAll(itens);

			// Descarrega os itens deste bloco (SQL + índice Lucene) e desanexa tudo da sessão,
			// para o próximo bloco começar com o contexto de persistência vazio.
			entityManager.flush();
			entityManager.clear();

			return itens.size();
		});

		return itensPersistidos == null ? 0 : itensPersistidos;
	}

	/**
	 * Retorna a UnidadeFornecimento para o nome informado, criando-a (e adicionando ao cache)
	 * na primeira vez que aparece. O cache é compartilhado entre todos os blocos da execução.
	 */
	private UnidadeFornecimento resolveUnidade(String nome, Map<String, UnidadeFornecimento> unidadeCache,
			Map<String, UnidadeFornecimento> novasUnidades) {
		UnidadeFornecimento cached = unidadeCache.get(nome);
		if (cached != null) {
			return cached;
		}
		UnidadeFornecimento nova = novasUnidades.get(nome);
		if (nova != null) {
			return nova;
		}
		// Nome inédito nesta base: confirma no banco (pode ter sido criado fora daqui) e só então insere.
		UnidadeFornecimento existente = unidadeFornecimentoRepository.findFirstByNome(nome);
		UnidadeFornecimento unidade = existente != null
				? existente
				: unidadeFornecimentoRepository.save(new UnidadeFornecimento(nome));
		novasUnidades.put(nome, unidade);
		return unidade;
	}

	/** Atualiza o registro de ingestão em transação curta e isolada. */
	private void atualizaRegistroIngestao(int totalLicitacoes, int totalItens, int blocosComFalha,
			List<Long> licitacoesNaoIngeridas) {
		transactionTemplate.execute(status -> {
			IngestaoDadosPncp ingestaoDadosPncp = pncpRepository.findAtualIngestaoData();
			if (ingestaoDadosPncp == null) {
				System.err.println("WARN: Nenhum registro de ingestão em aberto para atualizar.");
				return null;
			}
			ingestaoDadosPncp.setDataFim(LocalDateTime.now());
			ingestaoDadosPncp.setTotalLicitacao(totalLicitacoes);
			ingestaoDadosPncp.setTotalItensLicitacao(totalItens);

			if (blocosComFalha == 0) {
				ingestaoDadosPncp.setStatus(1); // concluída OK
			} else {
				ingestaoDadosPncp.setStatus(2); // concluída com falhas — reprocessa na próxima execução
				String ids = licitacoesNaoIngeridas.stream().limit(50).map(String::valueOf)
						.collect(Collectors.joining(","));
				String sufixo = licitacoesNaoIngeridas.size() > 50
						? ",… (+" + (licitacoesNaoIngeridas.size() - 50) + ")" : "";
				ingestaoDadosPncp.setDetalhes(String.format(
						"Concluída com falhas: %d blocos falharam; %d licitações não ingeridas (serão "
								+ "reprocessadas na próxima execução). IDs: %s%s",
						blocosComFalha, licitacoesNaoIngeridas.size(), ids, sufixo));
			}
			pncpRepository.save(ingestaoDadosPncp);
			return null;
		});
	}

	private void dormir(long ms) {
		try {
			Thread.sleep(ms);
		} catch (InterruptedException ie) {
			Thread.currentThread().interrupt();
			throw new IllegalStateException("Ingestão de itens interrompida durante espera de retry", ie);
		}
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
