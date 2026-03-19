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
import javax.transaction.Transactional;

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
    
    // Valor da chave da API do PNCP
    @Value("${pncp.api.key}")
    private String apiKey;
    
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
        
        // 1. Inserção do registro de início
        insertIngestaoDadosPncp(); 

        // 2. Definição das datas
        LocalDate dataFinal = LocalDate.now();
        //LocalDate dataFinal = LocalDate.of(2025, 2, 5); // Exemplo de data fixa
        
        // 3. Busca da última data de ingestão no DB
        LocalDate dataParada = findUltimaIngestaoDadosPncp(); //LocalDate.of(2026, 3, 7); 
        // Você pode comentar a linha acima e usar a linha abaixo para testar o loop completo:
//         LocalDate dataParada = LocalDate.of(2015, 1, 1);

        final int modalidadeCompra = 6;
        int countJaExiste = 0;
        final int limiteJaExiste = 2;
        
        System.out.println("Iniciando coleta de dados de licitação do PNCP...");

        // Laço while principal
        while (!dataFinal.isBefore(dataParada) && countJaExiste < limiteJaExiste) {
            LocalDate dataInicial = dataFinal.minusDays(1);
            
            int pagina = 1;
            boolean temPagina = true;
            boolean jaExiste = false;
            String msg = "";

            // Laço while interno
            while (temPagina && !jaExiste) {
                String dataFinalStr = dataFinal.format(DATE_FORMATTER);
                String dataInicialStr = dataInicial.format(DATE_FORMATTER);
                String nomeArquivoJson = String.format("%slicitacoes-%s-%d.json", folder, dataFinalStr, pagina);
                msg = String.format("Data inicial: %s; data final: %s. Página: %d", dataInicialStr, dataFinalStr, pagina);

                try {
                    File arquivo = new File(nomeArquivoJson);
                    
                    if (!arquivo.isFile()) {
                        System.out.println("INFO: " + msg + " - Chamando API");
                        
                        Object responseJson = null;
                        boolean erro = false;
                        do {
	                        responseJson = pncpClient.getLicitacoes(dataInicialStr, dataFinalStr, modalidadeCompra, pagina, 50, apiKey);
	                        if (Objects.nonNull(responseJson) && responseJson instanceof String && !((String) responseJson).startsWith("{\"data\":"))
	                        	erro = true;
	                        else
	                        	erro = false;
                        } while (erro);

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
                    System.err.println("ERROR: Erro no download/parsing: " + e.getMessage());
                    insertLogErro("OpenDataLicitacaoCollector", String.format("Arquivo: %s. Erro: %s", nomeArquivoJson, e.getMessage()));
                }
            } // Fim do while interno

            if (!temPagina || jaExiste) {
                System.out.println("INFO: " + msg + " - Missing/Stop");
            }
            
            dataFinal = dataFinal.minusDays(1);
        } 

        long tempoTotal = System.currentTimeMillis() - inicio;
        System.out.printf("INFO: Tempo de processamento: %.3f segundos%n", tempoTotal / 1000.0);
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
    
    @Transactional
    public void getDados(boolean startup) {
    	if (startup) {
	    	this.getDadosLicitacao();
	    	this.getDadosItemLicitacao();
	        pncpLicitacaoService.carregaLicitacoesBaixadasNoBanco();
	    	pncpItemLicitacaoService.carregaItensLicitacaoBaixadosNoBanco();
    	}
    }

}
