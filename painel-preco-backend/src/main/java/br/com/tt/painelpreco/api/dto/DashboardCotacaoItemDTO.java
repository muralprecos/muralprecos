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
public class DashboardCotacaoItemDTO {

    private UUID uuid;
    private String nome;
    private String criadoEm;
    private String status;
    private Double valor;
}
