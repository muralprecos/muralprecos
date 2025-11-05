package br.com.tt.painelpreco.domain.repository.projection;

public interface DashboardKpiProjection {

//    Double getValorMedioCotacao();
//    Double getValorMedioCotacaoGeral();

    Long getLicitacoesMes();
    Long getLicitacoesMesAnterior();

    Long getCotacoesCriadas();
    Long getCotacoesCriadasAnterior();

    Double getValorMedio();

    Double getValorMedioGeral();
}
