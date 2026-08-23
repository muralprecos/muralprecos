package br.com.tt.painelpreco.api.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardAtaSituacaoDTO implements java.io.Serializable {
    private String situacao;
    private Long total;
}
