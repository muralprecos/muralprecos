package br.com.tt.painelpreco.domain.repository.projection;

public interface FornecedorEvolucaoProjection {
    String getMesAno();
    Long getTotalFornecedores();
    Long getTotalContratos();
    Double getValorTotal();
}
