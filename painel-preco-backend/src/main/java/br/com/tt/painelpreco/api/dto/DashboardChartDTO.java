package br.com.tt.painelpreco.api.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class DashboardChartDTO {

    @Data
    @Builder
    public static class DadosMensais {

        private String mes;
        private Long volumeLicitacoes;
        private Double valorCotacoes;
    }

    private List<DadosMensais> dadosMensais;
}
