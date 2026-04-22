package br.com.tt.painelpreco.api.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrganizacaoDTO {

  private Integer id;

  private UUID uuid;

  private String nome;

  private Boolean ativo;

  private LocalDateTime dataCriacao;

}
