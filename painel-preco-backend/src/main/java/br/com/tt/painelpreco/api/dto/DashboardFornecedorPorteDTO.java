package br.com.tt.painelpreco.api.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardFornecedorPorteDTO implements java.io.Serializable {
    private String porte;
    private Long totalFornecedores;
    private Long totalContratos;
    private Double valorTotal;
}
