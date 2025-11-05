package br.com.tt.painelpreco.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {

    private DashboardKpiDTO resumo;
    private DashboardChartDTO graficos;
    private Page<DashboardLicitacaoItemDTO> ultimasLicitacoes;
    private Page<DashboardCotacaoItemDTO> ultimasCotacoes;
}
