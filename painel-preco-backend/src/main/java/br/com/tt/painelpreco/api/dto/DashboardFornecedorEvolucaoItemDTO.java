package br.com.tt.painelpreco.api.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardFornecedorEvolucaoItemDTO implements java.io.Serializable {
    private String mesAno;
    private Long totalFornecedores;
    private Long totalContratos;
    private Double valorTotal;
}
