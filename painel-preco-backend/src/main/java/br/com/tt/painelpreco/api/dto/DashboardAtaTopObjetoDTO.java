package br.com.tt.painelpreco.api.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardAtaTopObjetoDTO implements java.io.Serializable {
    private String descricao;
    private Long totalAtas;
    private Double valorTotal;
}
