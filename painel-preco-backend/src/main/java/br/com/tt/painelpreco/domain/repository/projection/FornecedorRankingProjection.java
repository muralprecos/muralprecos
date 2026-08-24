package br.com.tt.painelpreco.domain.repository.projection;

public interface FornecedorRankingProjection {
    String getDocumento();
    String getNome();
    String getPorte();
    Long getTotalContratos();
    Double getValorTotal();
}
