package br.com.tt.painelpreco.pncp.domain.service;

import java.io.File;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.tt.painelpreco.pncp.api.ItemClient;
import br.com.tt.painelpreco.pncp.api.PncpClient;
import br.com.tt.painelpreco.pncp.domain.model.IngestaoDadosPncp;
import br.com.tt.painelpreco.pncp.domain.model.LogErro;
import br.com.tt.painelpreco.pncp.domain.repository.LogErroRepository;
import br.com.tt.painelpreco.pncp.domain.repository.IngestaoDadosPncpRepository;
import feign.FeignException;

@Service
public class ColetaDadosPncpService {
	
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd");

    // Todas as modalidades de contratação do PNCP
    private static final int[] TODAS_MODALIDADES = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13};
    
    @Autowired
    private PncpClient pncpClient;
    
    @Autowired
    private ItemClient itemClient;
    
    @Autowired
    private ObjectMapper mapper;
    
    @Autowired
    private IngestaoDadosPncpRepository pncpRepository;
    
    @Autowired
    private LogErroRepository logErroRepository;
    
    @Autowired
    private IngestaoLicitacaoService pncpLicitacaoService;

    @Autowired
    private IngestaoItemLicitacaoService pncpItemLicitacaoService;

    @Autowired
    private IngestaoResultadoItemService pncpResultadoItemService;

    @Autowired
    private IngestaoAtaRegistroPrecoService pncpAtaService;

    @Autowired
    private EnriquecimentoSituacaoCompraService enriquecimentoSituacaoCompraService;
    
    // Valor da chave da API do PNCP
    @Value("${pncp.api.key}")
    private String apiKey;

    // Data mínima de coleta para modalidades sem arquivos anteriores
    @Value("${pncp.api.coleta.data-inicio:2022-01-01}")
    private String dataInicioConfig;
    
    // Diretório de saída
    @Value("${pncp.api.output.dir}")
    private String folder;

	private String folderItens;

    @PostConstruct
    public void init() {
    	folderItens = folder + "itens";
        new File(folderItens).mkdirs();
    }
    
    private void insertIngestaoDadosPncp() {
        IngestaoDadosPncp ingestao = new IngestaoDadosPncp(LocalDateTime.now(), "Mineração automática");
        try {
            pncpRepository.save(ingestao);
            System.out.println("INFO: Inserido registro de início de ingestão.");
        } catch (Exception e) {
            System.err.println("ERROR: Falha ao inserir registro de ingestão: " + e.getMessage());
            insertLogErro("DAO.insert_ingestao_dados_pncp", "Erro: " + e.getMessage());
        }
    }
    
    private void insertLogErro(String tipo, String mensagem) {
        LogErro logErro = new LogErro(new Date(), tipo, mensagem);
        try {
            logErroRepository.save(logErro);
        } catch (Exception e) {
            System.err.println("ERROR: Falha CRÍTICA ao inserir log de erro. Erro: " + e.getMessage());
        }
    }
    
    private LocalDate findUltimaIngestaoDadosPncp() {
        try {
            return pncpRepository.findUltimaIngestaoData()
                .map(LocalDateTime::toLocalDate)
                .orElse(LocalDate.now()); // Se Optional estiver vazio, retorna data atual
        } catch (Exception e) {
            System.err.println("ERROR: Falha ao buscar última data de ingestão: " + e.getMessage());
            insertLogErro("DAO.find_ultima_ingestao_dados_pncp", "Erro: " + e.getMessage());
            // Em caso de falha no DB, retorna a data atual para continuar o processamento
            return LocalDate.now(); 
        }
    }

    private void getDadosLicitacao() {
        long inicio = System.currentTimeMillis();
        insertIngestaoDadosPncp();

        LocalDate dataParada = findUltimaIngestaoDadosPncp();
        System.out.println("Iniciando coleta de dados de licitação do PNCP (todas as modalidades)...");

        LocalDate dataInicio = LocalDate.parse(dataInicioConfig);

        for (int modalidade : TODAS_MODALIDADES) {
            // Para modalidades sem arquivos ainda, retrocede até a data de início configurada
            LocalDate parada = temArquivosParaModalidade(modalidade) ? dataParada : dataInicio;
            coletarModalidade(modalidade, parada);
        }

        System.out.printf("INFO: Coleta de licitações concluída em %.3fs%n",
                (System.currentTimeMillis() - inicio) / 1000.0);
    }

    private void coletarModalidade(int modalidade, LocalDate dataParada) {
        LocalDate dataFinal = LocalDate.now();
        int countJaExiste = 0;
        final int limiteJaExiste = 2;

        System.out.printf("INFO: Coletando modalidade %d a partir de %s%n", modalidade, dataFinal);

        while (!dataFinal.isBefore(dataParada) && countJaExiste < limiteJaExiste) {
            LocalDate dataInicial = dataFinal.minusDays(1);
            String dataFinalStr = dataFinal.format(DATE_FORMATTER);
            String dataInicialStr = dataInicial.format(DATE_FORMATTER);

            int pagina = 1;
            boolean temPagina = true;
            boolean jaExiste = false;

            while (temPagina && !jaExiste) {
                String nomeArquivoJson = nomeArquivoLicitacao(modalidade, dataFinalStr, pagina);
                String msg = String.format("Mod %d | %s → %s | pág %d", modalidade, dataInicialStr, dataFinalStr, pagina);

                try {
                    File arquivo = new File(nomeArquivoJson);

                    if (!arquivo.isFile()) {
                        System.out.println("INFO: " + msg + " - Chamando API");

                        Object responseJson = pncpClient.getLicitacoes(dataInicialStr, dataFinalStr, modalidade, pagina, 50, apiKey);

                        if (Objects.nonNull(responseJson)) {
                            new ObjectMapper().writeValue(arquivo, responseJson);
                            System.out.println("INFO: " + msg + " - Downloaded");
                            pagina++;
                        } else {
                            temPagina = false;
                        }
                    } else {
                        jaExiste = true;
                        countJaExiste++;
                    }
                } catch (Exception e) {
                    System.err.println("ERROR: " + msg + ": " + e.getMessage());
                    insertLogErro("OpenDataLicitacaoCollector",
                            String.format("Arquivo: %s. Erro: %s", nomeArquivoJson, e.getMessage()));
                    temPagina = false;
                }
            }

            dataFinal = dataFinal.minusDays(1);
        }
    }

    /**
     * Modalidade 6 (Pregão - Eletrônico) usa o formato legado para não re-baixar os 35K arquivos existentes.
     * Demais modalidades usam formato com prefixo de modalidade.
     */
    private String nomeArquivoLicitacao(int modalidade, String data, int pagina) {
        if (modalidade == 6) {
            return String.format("%slicitacoes-%s-%d.json", folder, data, pagina);
        }
        return String.format("%slicitacoes-m%d-%s-%d.json", folder, modalidade, data, pagina);
    }

    /** Verifica se já existe ao menos um arquivo baixado para a modalidade. */
    private boolean temArquivosParaModalidade(int modalidade) {
        File dir = new File(folder);
        String prefixo = (modalidade == 6) ? "licitacoes-2" : "licitacoes-m" + modalidade + "-";
        String[] encontrados = dir.list((d, name) -> name.startsWith(prefixo) && name.endsWith(".json"));
        return encontrados != null && encontrados.length > 0;
    }
    
    private void getDadosItemLicitacao() {
        long inicio = System.currentTimeMillis();

        File dir = new File(folder);
        File[] jsonArqs = dir.listFiles((d, name) -> name.endsWith(".json"));

        if (jsonArqs == null) return;

        // Ordenação por data (descendente) extraída do nome do arquivo
        List<File> ordenados = Arrays.stream(jsonArqs)
                .sorted(Comparator.comparing(ColetaDadosPncpService::extrairData, Comparator.reverseOrder())
                          .thenComparing(ColetaDadosPncpService::extrairSequencial, Comparator.reverseOrder()))
                .collect(Collectors.toList());

        int countJaExisteTotal = 0;

        for (File arq : ordenados) {
            try {
                JsonNode rootNode = mapper.readTree(arq);
                JsonNode dataNode = rootNode.get("data");

                for (JsonNode dado : dataNode) {
                    int pagina = 1;
                    boolean temProxima = true;
                    boolean jaExisteLocal = false;

                    while (temProxima && !jaExisteLocal) {
                        String numeroPncp = dado.get("numeroControlePNCP").asText();
                        String fileName = String.format("%s/itens-%s-%d.json", folderItens, numeroPncp.replace("/", "-"), pagina);
                        File destino = new File(fileName);
                        String msg = String.format("Arquivo: %s. Página: %s", fileName, pagina);
                        System.out.println("INFO: Arquivo: " + fileName);
                        if (!destino.exists()) {
                            try {
                                // Extração de dados para a URL
                                String cnpj = numeroPncp.substring(0, numeroPncp.indexOf("-"));
                                String ano = dado.get("anoCompra").asText();
                                String sequencial = dado.get("sequencialCompra").asText();

                                // Chamada via Feign
                                String responseBody = itemClient.getItens(cnpj, ano, sequencial, pagina, 50);

                                if (responseBody != null && !responseBody.equals("[]")) {
                                    // Salva formatado
                                    Object json = mapper.readValue(responseBody, Object.class);
                                    mapper.writerWithDefaultPrettyPrinter().writeValue(destino, json);
                                    System.out.println(msg + " - Downloaded");
                                    pagina++;
                                } else {
                                    temProxima = false;
                                }
                            } catch (FeignException.NotFound e) {
                                temProxima = false; // 404 interrompe a paginação
                            } catch (Exception e) {
                                System.err.println("Erro na requisição: " + e.getMessage());
                                insertLogErro("OpenDataItemLicitacaoCollector", String.format("Arquivo: %s. Erro: %s", fileName, e.getMessage()));
                                temProxima = false;
                            }
                        } else {
                            jaExisteLocal = true;
                            countJaExisteTotal++;
                        }
                        
                        if (!temProxima || jaExisteLocal) {
                        	System.out.println(msg + " - Missing");
                        }
                    }
                    if (countJaExisteTotal >= 2) break;
                }
            } catch (Exception e) {
                System.err.println("Erro ao processar arquivo " + arq.getName() + ": " + e.getMessage());
                insertLogErro("OpenDataItemLicitacaoCollector", String.format("Arquivo: %s. Erro: %s", arq.getName(), e.getMessage()));
            }
        }
        
        System.out.println("Processamento concluído em " + (System.currentTimeMillis() - inicio)/1000.0 + "s");
    }
    
    // Extrai "20250711" do nome "licitacoes-20250711-64.json"
    private static String extrairData(File f) {
        return f.getName().split("-")[1];
    }

    // Extrai "64" (como número) do nome "licitacoes-20250711-64.json"
    private static Integer extrairSequencial(File f) {
        String parte = f.getName().split("-")[2].replace(".json", "");
        return Integer.parseInt(parte);
    }
    
    // Sem @Transactional — cada sub-serviço gerencia sua própria transação (REQUIRED_NEW via proxy)
    public void getDados(boolean startup, boolean licitacoesOnly) {
    	if (startup) {
	    	executarEtapa("getDadosLicitacao", this::getDadosLicitacao);

	    	if (!licitacoesOnly) {
	    		executarEtapa("getDadosItemLicitacao", this::getDadosItemLicitacao);
	    	}

	        executarEtapa("carregaLicitacoesBaixadasNoBanco", pncpLicitacaoService::carregaLicitacoesBaixadasNoBanco);

	        if (!licitacoesOnly) {
	        	executarEtapa("carregaItensLicitacaoBaixadosNoBanco", pncpItemLicitacaoService::carregaItensLicitacaoBaixadosNoBanco);
	        	executarEtapa("carregaResultadosBaixadosNoBanco", pncpResultadoItemService::carregaResultadosBaixadosNoBanco);
	        	executarEtapa("carregaAtasBaixadasNoBanco", pncpAtaService::carregaAtasBaixadasNoBanco);
	        }
    	}
    }

    /** Executa apenas as etapas de ingestão (sem download de novos JSONs). */
    public void ingerirDadosExistentes() {
        executarEtapa("carregaLicitacoesBaixadasNoBanco", pncpLicitacaoService::carregaLicitacoesBaixadasNoBanco);
        executarEtapa("carregaItensLicitacaoBaixadosNoBanco", pncpItemLicitacaoService::carregaItensLicitacaoBaixadosNoBanco);
        executarEtapa("carregaResultadosBaixadosNoBanco", pncpResultadoItemService::carregaResultadosBaixadosNoBanco);
        executarEtapa("carregaAtasBaixadasNoBanco", pncpAtaService::carregaAtasBaixadasNoBanco);
    }

    /**
     * Executa uma etapa do pipeline isolada de falha (fail-open): uma exceção não tratada
     * em uma etapa (ex.: coleta de fornecedores) não pode impedir as etapas seguintes
     * (ex.: coleta de atas) de rodar na mesma execução.
     */
    private void executarEtapa(String nomeEtapa, Runnable etapa) {
        long inicio = System.currentTimeMillis();
        try {
            etapa.run();
        } catch (Exception e) {
            System.err.println("ERROR: Falha na etapa " + nomeEtapa + ": " + e.getMessage());
            insertLogErro("Coleta." + nomeEtapa, e.getMessage());
        } finally {
            System.out.printf("INFO: Etapa %s finalizada em %.1fs%n",
                    nomeEtapa, (System.currentTimeMillis() - inicio) / 1000.0);
        }
    }

    /** Executa apenas a coleta de resultados para itens já no banco sem fornecedor. */
    public void coletarFornecedores() {
        pncpResultadoItemService.carregaResultadosBaixadosNoBanco();
        // Atas não são chamadas aqui: têm endpoint próprio (/coleta/pncp/atas)
    }

    /** Executa apenas a ingestão de atas de registro de preço. */
    public void coletarAtas() {
        pncpAtaService.carregaAtasBaixadasNoBanco();
    }

    /** Lê todos os JSONs de licitações e popula situacao_compra + situacao_compra_id. */
    public void enriquecerSituacaoCompra() {
        enriquecimentoSituacaoCompraService.enriquecer();
    }

}
