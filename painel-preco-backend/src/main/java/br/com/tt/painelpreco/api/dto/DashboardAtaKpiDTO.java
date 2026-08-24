package br.com.tt.painelpreco.api.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardAtaKpiDTO implements java.io.Serializable {
    private Long totalAtasAtivas;
    private Long atasVencendo30d;
    private Double valorTotalRegistrado;
    private Long totalItensCobertos;
}
