package br.com.tt.painelpreco.api.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrganizacaoDetalhesDTO {

  private Integer id;

  private UUID uuid;

  private String nome;

  private Boolean ativo;

  private LocalDateTime dataCriacao;

  // Atributos armazenados no Keycloak
  private String cnpj;

  private String telefone;

  private List<MembroDTO> membros;

  /** true quando o group correspondente ao uuid não foi encontrado no Keycloak */
  private Boolean keycloakNaoEncontrado;

  @Getter
  @Setter
  public static class MembroDTO {

    private String uuid;

    private String username;

    private String nome;

    private String email;

    @com.fasterxml.jackson.annotation.JsonProperty("isGestor")
    private boolean isGestor;

  }

}
