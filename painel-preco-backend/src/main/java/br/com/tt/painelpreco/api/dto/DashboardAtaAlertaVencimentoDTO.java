package br.com.tt.painelpreco.api.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardAtaAlertaVencimentoDTO implements java.io.Serializable {
    private String numeroPncp;
    private String orgaoGerenciador;
    private String objeto;
    private String dataVigenciaFim;
    private Integer diasRestantes;
    private Double valorTotal;
}
