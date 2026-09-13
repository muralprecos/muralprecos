package br.com.tt.painelpreco.api.dto;

import java.util.Map;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class PncpOutputExtracaoDTO {

  private long arquivosExtraidos;
  private long bytesExtraidos;
  private Map<String, Long> bytesPorPasta;

  public PncpOutputExtracaoDTO(long arquivosExtraidos, long bytesExtraidos, Map<String, Long> bytesPorPasta) {
    this.arquivosExtraidos = arquivosExtraidos;
    this.bytesExtraidos = bytesExtraidos;
    this.bytesPorPasta = bytesPorPasta;
  }

}
