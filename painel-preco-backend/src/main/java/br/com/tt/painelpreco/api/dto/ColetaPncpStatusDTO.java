package br.com.tt.painelpreco.api.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ColetaPncpStatusDTO {

  private boolean licitacoesItensEmAndamento;
  private boolean fornecedoresEmAndamento;
  private boolean atasEmAndamento;

  public ColetaPncpStatusDTO(boolean licitacoesItensEmAndamento, boolean fornecedoresEmAndamento,
      boolean atasEmAndamento) {
    this.licitacoesItensEmAndamento = licitacoesItensEmAndamento;
    this.fornecedoresEmAndamento = fornecedoresEmAndamento;
    this.atasEmAndamento = atasEmAndamento;
  }

}
