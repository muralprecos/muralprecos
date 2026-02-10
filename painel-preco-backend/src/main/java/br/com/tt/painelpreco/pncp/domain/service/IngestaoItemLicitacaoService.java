package br.com.tt.painelpreco.pncp.domain.service;

import java.io.File;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;

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
import br.com.tt.painelpreco.pncp.domain.repository.LogErroRepository;
import br.com.tt.painelpreco.pncp.domain.repository.IngestaoDadosPncpRepository;

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
	
	@Value("${pncp.api.output.dir}")
    private String jsonDir;
	
	@Transactional
	public void carregaItensLicitacaoBaixadosNoBanco() {
        long inicio = System.currentTimeMillis();
        ObjectMapper mapper = new ObjectMapper();
        
        // Simulando o retorno do DAO (assumindo que retorna uma lista de arrays ou objetos)
        // licitacao[0] = ID, licitacao[1] = Numero PNCP
        List<Licitacao> licitacoes = licitacaoRepository.findPendentesImportacaoItens();

        Set<UnidadeFornecimento> unidadesFornecimento = new HashSet<>();
        Set<ItemLicitacao> itens = new HashSet<>();

        for (Licitacao licitacao : licitacoes) {
            String numeroPncp = licitacao.getNumeroPncp();
            
            // O nome base substitui "/" por "-" conforme o original
            String nomeBaseArquivo = "itens-" + numeroPncp.replace("/", "-");

            for (int pagina = 1; pagina < 10000; pagina++) {
                String caminhoArquivo = String.format(jsonDir + "itens/%s-%d.json", nomeBaseArquivo, pagina);
                File arqJson = new File(caminhoArquivo);

                // No Python você usa try/except FileNotFoundError. 
                // Em Java, verificar se o arquivo existe é mais eficiente.
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

        // Persistência
        unidadeFornecimentoService.saveAll(unidadesFornecimento);
        
        Map<String, UnidadeFornecimento> unidadesFornecimentoMap = new HashMap<>();
        unidadeFornecimentoService.findAll().forEach(unidade -> {
        	unidadesFornecimentoMap.put(unidade.getNome(), unidade);
        });
        
        itens.forEach(item -> {
        	item.setUnidadeFornecimento(unidadesFornecimentoMap.get(item.getUnidadeFornecimento().getNome()));
        });
        
        itemLicitacaoRepository.saveAll(itens);
        
        IngestaoDadosPncp ingestaoDadosPncp = pncpRepository.findAtualIngestaoData();
        ingestaoDadosPncp.setDataFim(LocalDateTime.now());
        ingestaoDadosPncp.setStatus(1);
        ingestaoDadosPncp.setTotalLicitacao(licitacoes.size());
        ingestaoDadosPncp.setTotalItensLicitacao(itens.size());
        pncpRepository.save(ingestaoDadosPncp);
        
        //limpa diretorio
        FileSystemUtils.deleteRecursively(new File(jsonDir));

        double tempoTotal = (System.currentTimeMillis() - inicio) / 1000.0;
        System.out.println(String.format("Tempo de processamento: %.6f segundos", tempoTotal));
    }

}
