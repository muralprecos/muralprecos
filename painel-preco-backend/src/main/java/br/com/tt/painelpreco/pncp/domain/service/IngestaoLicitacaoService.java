package br.com.tt.painelpreco.pncp.domain.service;

import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.tt.painelpreco.domain.model.Esfera;
import br.com.tt.painelpreco.domain.model.Esfera.EsferaEnum;
import br.com.tt.painelpreco.domain.model.FormaCompra;
import br.com.tt.painelpreco.domain.model.Licitacao;
import br.com.tt.painelpreco.domain.model.ModalidadeCompra;
import br.com.tt.painelpreco.domain.model.Municipio;
import br.com.tt.painelpreco.domain.model.Orgao;
import br.com.tt.painelpreco.domain.model.SituacaoLicitacao;
import br.com.tt.painelpreco.domain.model.UnidadeFederativa;
import br.com.tt.painelpreco.domain.model.UnidadeGestora;
import br.com.tt.painelpreco.domain.service.EsferaService;
import br.com.tt.painelpreco.domain.service.FormaCompraService;
import br.com.tt.painelpreco.domain.service.LicitacaoService;
import br.com.tt.painelpreco.domain.service.ModalidadeCompraService;
import br.com.tt.painelpreco.domain.service.MunicipioService;
import br.com.tt.painelpreco.domain.service.OrgaoService;
import br.com.tt.painelpreco.domain.service.SituacaoLicitacaoService;
import br.com.tt.painelpreco.domain.service.UnidadeFederativaService;
import br.com.tt.painelpreco.domain.service.UnidadeGestoraService;
import br.com.tt.painelpreco.pncp.domain.model.LogErro;
import br.com.tt.painelpreco.pncp.domain.repository.LogErroRepository;
import br.com.tt.painelpreco.util.DateUtil;

@Service
public class IngestaoLicitacaoService {
	
	@Autowired
	private ModalidadeCompraService modalidadeCompraService;
	
	@Autowired
	private UnidadeFederativaService unidadeFederativaService;
	
	@Autowired
	private MunicipioService municipioService;
	
	@Autowired
	private OrgaoService orgaoService;
	
	@Autowired
	private SituacaoLicitacaoService situacaoLicitacaoService;
	
	@Autowired
	private UnidadeGestoraService unidadeGestoraService;
	
	@Autowired
	private EsferaService esferaService;
	
	@Autowired
	private FormaCompraService formaCompraService;
	
	@Autowired
	private LogErroRepository logErroRepository;
	
	@Autowired
	private LicitacaoService licitacaoService;
	
	@Value("${pncp.api.output.dir}")
    private String jsonDir;
	
	@Transactional
	public void carregaLicitacoesBaixadasNoBanco() {
        long inicio = System.currentTimeMillis();
        ObjectMapper mapper = new ObjectMapper();

        Set<ModalidadeCompra> modalidades = new HashSet<>();
        Set<UnidadeFederativa> ufs = new HashSet<>();
        Set<Municipio> municipios = new HashSet<>();
        Set<Orgao> orgaos = new HashSet<>();
        Set<SituacaoLicitacao> situacoes = new HashSet<>();
        Set<Esfera> esferas = new HashSet<>();
        Set<FormaCompra> formas = new HashSet<>();
        Set<UnidadeGestora> unidades = new HashSet<>();
        Set<Licitacao> licitacoes = new HashSet<>();

        File folder = new File(jsonDir);
        File[] jsonArqs = folder.listFiles((dir, name) -> name.endsWith(".json"));

        if (jsonArqs == null) return;

        for (File arq : jsonArqs) {
            try {
                JsonNode rootNode = mapper.readTree(arq);
                JsonNode dataNode = rootNode.get("data");

                if (dataNode.isArray()) {
                    for (JsonNode dado : dataNode) {
                        // Modalidade
                        ModalidadeCompra modalidade = new ModalidadeCompra();
                        modalidade.setCodigo(dado.get("modalidadeId").asInt());
                        modalidade.setNome(dado.get("modalidadeNome").asText());
                        modalidades.add(modalidade);

                        // UF
                        UnidadeFederativa uf = new UnidadeFederativa();
                        uf.setSigla(dado.get("unidadeOrgao").get("ufSigla").asText());
                        uf.setNome(dado.get("unidadeOrgao").get("ufNome").asText());
                        ufs.add(uf);

                        // Municipio
                        Municipio municipio = new Municipio();
//                        String ufSigla = dado.get("unidadeOrgao").get("ufSigla").asText();
//                        UnidadeFederativa municipioUf = ufs.stream()
//                                .filter(u -> u.getSigla().equals(ufSigla))
//                                .findFirst().orElse(uf);

                        municipio.setNome(dado.get("unidadeOrgao").get("municipioNome").asText());
                        municipio.setUf(uf);
                        municipio.setCodigoIbge(dado.get("unidadeOrgao").get("codigoIbge").asText());
                        municipios.add(municipio);
                        
                        // Esfera
                        Esfera esfera = new Esfera();
                        String esferaId = dado.get("orgaoEntidade").get("esferaId").asText();
                        esfera.setCodigo(EsferaEnum.valueOf(esferaId));
                        esfera.setNome(esferaId);
                        esferas.add(esfera);

                        // Orgao
                        Orgao orgao = new Orgao();
                        orgao.setCnpj(dado.get("orgaoEntidade").get("cnpj").asText());
                        orgao.setNome(dado.get("orgaoEntidade").get("razaoSocial").asText());
                        orgao.setPoder(dado.get("orgaoEntidade").get("poderId").asText());
                        orgao.setEsfera(esfera);
                        orgaos.add(orgao);

                        // Situação
                        SituacaoLicitacao situacao = new SituacaoLicitacao();
                        situacao.setId(dado.get("situacaoCompraId").asInt());
                        situacao.setNome(dado.get("situacaoCompraNome").asText());
                        situacoes.add(situacao);

                        // Forma
                        FormaCompra forma = new FormaCompra();
                        forma.setId(dado.get("modoDisputaId").asInt());
                        forma.setNome(dado.get("modoDisputaNome").asText());
                        formas.add(forma);

                        // Unidade Gestora
                        UnidadeGestora unidade = new UnidadeGestora();
                        unidade.setCnpj(dado.get("orgaoEntidade").get("cnpj").asText());
                        unidade.setCodigo(dado.get("unidadeOrgao").get("codigoUnidade").asText());
                        unidade.setNomeEntidade(dado.get("orgaoEntidade").get("razaoSocial").asText());
                        unidade.setNome(dado.get("unidadeOrgao").get("nomeUnidade").asText());
                        unidade.setUfNome(dado.get("unidadeOrgao").get("ufNome").asText());
                        unidade.setUfSigla(dado.get("unidadeOrgao").get("ufSigla").asText());
                        unidade.setMunicipioNome(dado.get("unidadeOrgao").get("municipioNome").asText());
                        unidade.setCodigoIbge(dado.get("unidadeOrgao").get("codigoIbge").asText());
                        unidades.add(unidade);

                        // Licitacao
                        Licitacao licitacao = new Licitacao();
                        licitacao.setDataAbertura(DateUtil.convert(dado.get("dataAberturaProposta").asText()));
                        licitacao.setDataResultadoCompra(DateUtil.convert(dado.get("dataEncerramentoProposta").asText()));
                        licitacao.setNumero(dado.get("numeroCompra").asText().replace("/", ""));
                        licitacao.setNumeroProcesso(dado.get("processo").asText());
                        licitacao.setObjeto(dado.get("objetoCompra").asText());
                        licitacao.setValor(dado.get("valorTotalEstimado").asDouble());
                        licitacao.setNumeroPncp(dado.get("numeroControlePNCP").asText());
                        licitacao.setModalidadeCompra(modalidade);
                        licitacao.setMunicipio(municipio);
                        licitacao.setOrgao(orgao);
                        licitacao.setSituacao(situacao);
                        licitacao.setUnidadeGestora(unidade);
//                        licitacao.setOrgao(orgao);
                        licitacao.setEsfera(esfera);
                        licitacao.setFormaCompra(forma);
                        
                        System.out.println(licitacao);
                        licitacoes.add(licitacao);
                    }
                }
            } catch (Exception e) {
            	e.printStackTrace();
                System.err.println("Erro no arquivo: " + arq.getName() + " - " + e.getMessage());
                logErroRepository.save(new LogErro(new Date(), "DatabaseIngestor", "Arquivo: " + arq.getName() + ". Erro: " + e.getMessage()));
            }
        }

        // Inserções no Banco
        modalidades.forEach(modalidade -> {modalidadeCompraService.save(modalidade);});
        ufs.forEach(uf -> {unidadeFederativaService.save(uf);});
        esferas.forEach(esfera -> {esferaService.save(esfera);});
        situacoes.forEach(situacao -> {situacaoLicitacaoService.save(situacao);});
        formas.forEach(forma -> {formaCompraService.save(forma);});
        unidades.forEach(unidade -> {unidadeGestoraService.save(unidade);});
        
        Map<Integer, ModalidadeCompra> modalidadeMap = new HashMap<>();
        modalidadeCompraService.findAll().forEach(modalidade -> {modalidadeMap.put(modalidade.getCodigo(), modalidade);});
        
        Map<String, Municipio> municipioMap = new HashMap<>();
        municipioService.findAll().forEach(municipio -> {municipioMap.put(municipio.getCodigoIbge(), municipio);});
        
        Map<String, UnidadeFederativa> ufMap = new HashMap<>();
        unidadeFederativaService.findAll().forEach(uf -> {ufMap.put(uf.getSigla(), uf);});
        
        Map<EsferaEnum, Esfera> esferaMap = new HashMap<>();
        esferaService.findAll().forEach(esfera -> {esferaMap.put(esfera.getCodigo(), esfera);});
        
        Map<Integer, SituacaoLicitacao> situacaoLicitacaoMap = new HashMap<>();
        situacaoLicitacaoService.findAll().forEach(situacao -> {situacaoLicitacaoMap.put(situacao.getId(), situacao);});
        
        Map<Integer, FormaCompra> formaCompraMap = new HashMap<>();
        formaCompraService.findAll().forEach(formaCompra -> {formaCompraMap.put(formaCompra.getId(), formaCompra);});
        
        Map<String, Orgao> orgaoMap = new HashMap<>();
        orgaoService.findAll().forEach(orgao -> {orgaoMap.put(orgao.getCnpj(), orgao);});

        Map<String, UnidadeGestora> unidadeGestoraMap = new HashMap<>();
        unidadeGestoraService.findAll().forEach(unidade -> {unidadeGestoraMap.put(unidade.getCnpj() + "|" + unidade.getCodigo(), unidade);});
        
        municipios.forEach(municipio -> {
        	municipio.setUf(ufMap.get(municipio.getUf().getSigla()));
        	municipioService.save(municipio);
        });
        
        orgaos.forEach(orgao -> {
        	orgao.setEsfera(esferaMap.get(orgao.getEsfera().getCodigo()));
        	orgaoService.save(orgao);
        });
        
        List<String> numerosPncp = new ArrayList<>();
        licitacoes.forEach(licitacao -> {
        	licitacao.setModalidadeCompra(modalidadeMap.get(licitacao.getModalidadeCompra().getCodigo()));
        	licitacao.setMunicipio(municipioMap.get(licitacao.getMunicipio().getCodigoIbge()));
        	licitacao.setEsfera(esferaMap.get(licitacao.getEsfera().getCodigo()));
        	licitacao.setSituacao(situacaoLicitacaoMap.get(licitacao.getSituacao().getId()));
        	licitacao.setFormaCompra(formaCompraMap.get(licitacao.getFormaCompra().getId()));
        	licitacao.setOrgao(orgaoMap.get(licitacao.getOrgao().getCnpj()));
        	licitacao.setUnidadeGestora(unidadeGestoraMap.get(licitacao.getUnidadeGestora().getCnpj() + "|" + licitacao.getUnidadeGestora().getCodigo()));
        	
        	numerosPncp.add(licitacao.getNumeroPncp());
        });
        
        List<Licitacao> licitacoesJaExistem = licitacaoService.findAllByNumeroPncpIn(numerosPncp);
        
        Map<String, Long> mapaIds = licitacoesJaExistem.stream()
        	    .collect(Collectors.toMap(
        	        item -> item.getNumeroPncp(),
        	        item -> item.getId(),
        	        (existente, novo) -> existente
        	    ));

        	// 2. Percorremos o Set e aplicamos o Setter do Lombok
        	licitacoes.forEach(entidadeDoSet -> {
        	    Long idEncontrado = mapaIds.get(entidadeDoSet.getNumeroPncp());
        	    if (idEncontrado != null) {
        	        entidadeDoSet.setId(idEncontrado);
        	    }
        	});
        
//        licitacaoService.saveAll(licitacoesJaExistem);
//        
//        licitacoes.removeAll(licitacoesJaExistem);

        licitacaoService.saveAll(licitacoes);
        
        double tempoTotal = (System.currentTimeMillis() - inicio) / 1000.0;
        System.out.println(String.format("Tempo de processamento: %.6f segundos", tempoTotal));
    }

}
