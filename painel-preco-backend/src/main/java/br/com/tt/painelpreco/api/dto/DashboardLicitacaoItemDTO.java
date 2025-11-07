package br.com.tt.painelpreco.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardLicitacaoItemDTO {
    private UUID uuid;
    private String numero;
    private String objeto;
    private Date dataAbertura;
    private String status;
    private Double valor;
}
