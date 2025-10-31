package br.com.tt.painelpreco.domain.service;

import br.com.tt.painelpreco.api.dto.*;
import br.com.tt.painelpreco.domain.model.Cotacao;
import br.com.tt.painelpreco.domain.model.Licitacao;
import br.com.tt.painelpreco.domain.repository.CotacaoRepository;
import br.com.tt.painelpreco.domain.repository.LicitacaoRepository;
import br.com.tt.painelpreco.domain.repository.projection.DadosMensaisProjection;
import br.com.tt.painelpreco.domain.repository.projection.DashboardKpiProjection;
import br.com.tt.painelpreco.util.DateUtil;
import br.com.tt.painelpreco.util.ModelConverter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired private LicitacaoRepository licitacaoRepository;
    @Autowired private CotacaoRepository cotacaoRepository;
    @Autowired private ModelConverter converter;


    public DashboardDTO getDashboardData(Pageable pageableLicitacoes, Pageable pageableCotacoes) {

        DashboardKpiDTO resumo = getResumoKPIs();
        DashboardChartDTO graficos = getDadosMensaisGraficos();
        Page<DashboardLicitacaoItemDTO> ultimasLicitacoes = getUltimasLicitacoes(pageableLicitacoes);
        Page<DashboardCotacaoItemDTO> ultimasCotacoes = getUltimasCotacoes(pageableCotacoes);

        return DashboardDTO.builder()
                .resumo(resumo)
                .graficos(graficos)
                .ultimasLicitacoes(ultimasLicitacoes)
                .ultimasCotacoes(ultimasCotacoes)
                .build();
    }

    //Implementação dos KPIs
    private DashboardKpiDTO getResumoKPIs() {
        // Lógica para calcular as datas
        Date inicioMesAtual = DateUtil.getStartOfMonth(new Date());
        Date fimMesAtual = DateUtil.getEndOfMonth(new Date());
        Date inicioMesAnterior = DateUtil.getStartOfPreviousMonth(new Date());
        Date fimMesAnterior = DateUtil.getEndOfPreviousMonth(new Date());

        // 1. Obter Projeções
        DashboardKpiProjection licitacoesKpi = licitacaoRepository.getLicitacoesKpiData(inicioMesAtual, fimMesAtual, inicioMesAnterior, fimMesAnterior);
        DashboardKpiProjection cotacoesKpi = cotacaoRepository.getCotacoesKpiData(inicioMesAtual, fimMesAtual, inicioMesAnterior, fimMesAnterior);

        // 2. Calcular Variações
        Double licitacoesComparacao = (licitacoesKpi.getLicitacoesMes().doubleValue() / licitacoesKpi.getLicitacoesMesAnterior().doubleValue()) - 1.0;
        Double cotacoesComparacao = (cotacoesKpi.getCotacoesCriadas().doubleValue() / cotacoesKpi.getCotacoesCriadasAnterior().doubleValue()) - 1.0;
        Double valorMedioComparacao = (licitacoesKpi.getValorMedio() / licitacoesKpi.getValorMedioGeral()) - 1.0;

        // 3. Mapear para DTO
        return DashboardKpiDTO.builder()
                .licitacoesMes(licitacoesKpi.getLicitacoesMes())
                .licitacoesMesComparacao(licitacoesComparacao)
                .cotacoesCriadas(cotacoesKpi.getCotacoesCriadas())
                .cotacoesCriadasComparacao(cotacoesComparacao)
                .valorMedioCotacao(licitacoesKpi.getValorMedio())
                .valorMedioCotacaoComparacao(valorMedioComparacao)
                .build();
    }

    // Implementação dos Gráficos
    private DashboardChartDTO getDadosMensaisGraficos() {
        // Exemplo: Últimos 6 meses
        Date inicioPeriodo = DateUtil.getStartOfSixMonthsAgo(new Date());

        List<DadosMensaisProjection> licitacoes = licitacaoRepository.getLicitacaoMensalVolume(inicioPeriodo);

        List<DashboardChartDTO.DadosMensais> dados = licitacoes.stream()
                .map(p -> {

                    return DashboardChartDTO.DadosMensais.builder()
                            .mes(p.getMesAno())
                            .volumeLicitacoes(p.getVolumeLicitacoes())
                            .valorCotacoes(p.getValorCotacoes())
                            .build();
                })
                .collect(Collectors.toList());

        return DashboardChartDTO.builder().dadosMensais(dados).build();
    }

    // Implementação das Listas Paginadas
    private Page<DashboardLicitacaoItemDTO> getUltimasLicitacoes(Pageable pageable) {
        Page<Licitacao> licitacoesPage = licitacaoRepository.findAll(pageable);

        return licitacoesPage.map(licitacao -> converter.toDTO(licitacao, DashboardLicitacaoItemDTO.class));
    }

    private Page<DashboardCotacaoItemDTO> getUltimasCotacoes(Pageable pageable) {
        Page<Cotacao> cotacoesPage = cotacaoRepository.findResumoDashboard(pageable); // <-- CORRIGIDO

        return cotacoesPage.map(cotacao -> converter.toDTO(cotacao, DashboardCotacaoItemDTO.class));
    }
}
