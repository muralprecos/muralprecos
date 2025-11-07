package br.com.tt.painelpreco.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardKpiDTO {

    private Long licitacoesMes;
    private Double licitacoesMesComparacao;

    private Long cotacoesCriadas;
    private Double cotacoesCriadasComparacao;

    private Double valorMedioCotacao;
    private Double valorMedioCotacaoComparacao;

}
