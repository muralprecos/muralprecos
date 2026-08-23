package br.com.tt.painelpreco.api.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardFornecedorRankingItemDTO implements java.io.Serializable {
    private String documento;
    private String nome;
    private String porte;
    private Long totalContratos;
    private Double valorTotal;
}
