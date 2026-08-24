package br.com.tt.painelpreco.domain.service;

import br.com.tt.painelpreco.api.dto.DashboardFornecedorEvolucaoItemDTO;
import br.com.tt.painelpreco.api.dto.DashboardFornecedorKpiDTO;
import br.com.tt.painelpreco.api.dto.DashboardFornecedorPorteDTO;
import br.com.tt.painelpreco.api.dto.DashboardFornecedorRankingItemDTO;
import br.com.tt.painelpreco.domain.repository.ItemLicitacaoRepository;
import br.com.tt.painelpreco.domain.repository.projection.FornecedorEvolucaoProjection;
import br.com.tt.painelpreco.domain.repository.projection.FornecedorKpiProjection;
import br.com.tt.painelpreco.domain.repository.projection.FornecedorPorteProjection;
import br.com.tt.painelpreco.domain.repository.projection.FornecedorRankingProjection;
import br.com.tt.painelpreco.util.DateUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardFornecedorService {

    @Autowired
    private ItemLicitacaoRepository itemLicitacaoRepository;

    @Cacheable(value = "fornecedor-kpis", keyGenerator = "cacheKeyGenerator")
    public DashboardFornecedorKpiDTO getKpis(Date dataInicio, Date dataFim, String nome, String documento, String porte) {
        Date hoje = new Date();
        Date inicioMes = DateUtil.getStartOfMonth(hoje);
        Date fimMes = DateUtil.getEndOfMonth(hoje);
        Date inicioMesAnterior = DateUtil.getStartOfPreviousMonth(hoje);
        Date fimMesAnterior = DateUtil.getEndOfPreviousMonth(hoje);

        FornecedorKpiProjection kpi = itemLicitacaoRepository.getFornecedorKpiData(
                inicioMes, fimMes, inicioMesAnterior, fimMesAnterior, dataInicio, dataFim, nome, documento, porte);

        double fornecedoresVariacao = calcularVariacao(
                kpi.getFornecedoresMes() != null ? kpi.getFornecedoresMes().doubleValue() : 0,
                kpi.getFornecedoresMesAnterior() != null ? kpi.getFornecedoresMesAnterior().doubleValue() : 0);

        double valorVariacao = calcularVariacao(
                kpi.getValorMes() != null ? kpi.getValorMes() : 0,
                kpi.getValorMesAnterior() != null ? kpi.getValorMesAnterior() : 0);

        return DashboardFornecedorKpiDTO.builder()
                .totalFornecedores(kpi.getTotalFornecedores())
                .totalContratos(kpi.getTotalContratos())
                .valorTotal(kpi.getValorTotal())
                .fornecedoresMes(kpi.getFornecedoresMes())
                .fornecedoresMesVariacao(fornecedoresVariacao)
                .valorMes(kpi.getValorMes())
                .valorMesVariacao(valorVariacao)
                .build();
    }

    @Cacheable(value = "fornecedor-ranking", keyGenerator = "cacheKeyGenerator")
    public List<DashboardFornecedorRankingItemDTO> getRanking(Date dataInicio, Date dataFim, String nome,
                                                                String documento, String porte, int limite) {
        List<FornecedorRankingProjection> projecoes =
                itemLicitacaoRepository.getRankingFornecedores(dataInicio, dataFim, nome, documento, porte, limite);

        return projecoes.stream()
                .map(p -> DashboardFornecedorRankingItemDTO.builder()
                        .documento(p.getDocumento())
                        .nome(p.getNome())
                        .porte(p.getPorte())
                        .totalContratos(p.getTotalContratos())
                        .valorTotal(p.getValorTotal())
                        .build())
                .collect(Collectors.toList());
    }

    @Cacheable(value = "fornecedor-porte", keyGenerator = "cacheKeyGenerator")
    public List<DashboardFornecedorPorteDTO> getDistribuicaoPorPorte(Date dataInicio, Date dataFim, String nome, String documento) {
        List<FornecedorPorteProjection> projecoes =
                itemLicitacaoRepository.getDistribuicaoPorPorte(dataInicio, dataFim, nome, documento);

        return projecoes.stream()
                .map(p -> DashboardFornecedorPorteDTO.builder()
                        .porte(p.getPorte())
                        .totalFornecedores(p.getTotalFornecedores())
                        .totalContratos(p.getTotalContratos())
                        .valorTotal(p.getValorTotal())
                        .build())
                .collect(Collectors.toList());
    }

    @Cacheable(value = "fornecedor-evolucao", keyGenerator = "cacheKeyGenerator")
    public List<DashboardFornecedorEvolucaoItemDTO> getEvolucaoMensal(int ano, String nome, String documento, String porte) {
        Date inicioPeriodo = DateUtil.getDateFirtDayYear(ano);
        Date fimPeriodo = DateUtil.getEndOfMonth(DateUtil.getDate(ano, DateUtil.DEZEMBRO, 1));

        List<FornecedorEvolucaoProjection> projecoes =
                itemLicitacaoRepository.getEvolucaoMensal(inicioPeriodo, fimPeriodo, nome, documento, porte);

        return projecoes.stream()
                .map(p -> DashboardFornecedorEvolucaoItemDTO.builder()
                        .mesAno(p.getMesAno())
                        .totalFornecedores(p.getTotalFornecedores())
                        .totalContratos(p.getTotalContratos())
                        .valorTotal(p.getValorTotal())
                        .build())
                .collect(Collectors.toList());
    }

    private double calcularVariacao(double valorAtual, double valorAnterior) {
        if (valorAnterior == 0) return 0.0;
        return (valorAtual / valorAnterior) - 1.0;
    }
}
