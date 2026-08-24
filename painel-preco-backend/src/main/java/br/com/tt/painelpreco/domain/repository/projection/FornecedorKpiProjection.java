package br.com.tt.painelpreco.domain.repository.projection;

public interface FornecedorKpiProjection {
    Long getTotalFornecedores();
    Long getTotalContratos();
    Double getValorTotal();
    Long getFornecedoresMes();
    Long getFornecedoresMesAnterior();
    Double getValorMes();
    Double getValorMesAnterior();
}
