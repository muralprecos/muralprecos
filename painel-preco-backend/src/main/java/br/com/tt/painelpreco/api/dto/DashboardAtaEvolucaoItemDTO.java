package br.com.tt.painelpreco.api.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardAtaEvolucaoItemDTO implements java.io.Serializable {
    private String mesAno;
    private Long criadas;
    private Long encerradas;
    private Long ativas;
}
