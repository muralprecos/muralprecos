package br.com.tt.painelpreco.api.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardFornecedorKpiDTO implements java.io.Serializable {
    private Long totalFornecedores;
    private Long totalContratos;
    private Double valorTotal;

    private Long fornecedoresMes;
    private Double fornecedoresMesVariacao;

    private Double valorMes;
    private Double valorMesVariacao;
}
