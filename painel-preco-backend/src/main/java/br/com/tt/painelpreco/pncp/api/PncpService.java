package br.com.tt.painelpreco.pncp.api;

import java.io.File;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Objects;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class PncpService {
	
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd");
    
    @Autowired
    private PncpClient pncpClient;
    
    @Autowired
    private PncpRepository pncpRepository;
    
    @Autowired
    private LogErroRepository logErroRepository;
    
    // Valor da chave da API do PNCP
    @Value("${pncp.api.key}")
    private String apiKey;
    
    // Diretório de saída
    @Value("${pncp.api.output.dir}")
    private String folder;

    @PostConstruct
    public void init() {
        new File(folder).mkdirs();
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
    
    public void insertLogErro(String tipo, String mensagem) {
        LogErro logErro = new LogErro(LocalDateTime.now(), tipo, mensagem);
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

    public void obterDadosLicitacao() {
        long inicio = System.currentTimeMillis();
        
        // 1. Inserção do registro de início
        insertIngestaoDadosPncp(); 

        // 2. Definição das datas
        LocalDate dataFinal = LocalDate.now();
        //LocalDate dataFinal = LocalDate.of(2025, 2, 5); // Exemplo de data fixa
        
        // 3. Busca da última data de ingestão no DB
        LocalDate dataParada = findUltimaIngestaoDadosPncp(); 
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

}
