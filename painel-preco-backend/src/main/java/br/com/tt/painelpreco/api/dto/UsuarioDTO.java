package br.com.tt.painelpreco.api.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioDTO {

  private Integer id;

  private UUID uuid;

  private String username;

  private String login;

  private String email;

  private String nome;

  private String organizacaoNome;

  private Integer organizacaoId;

  private Boolean ativo;

  private LocalDateTime dataCriacao;

  /** true quando o usuário correspondente ao uuid não foi encontrado no Keycloak */
  private Boolean keycloakNaoEncontrado;

}
