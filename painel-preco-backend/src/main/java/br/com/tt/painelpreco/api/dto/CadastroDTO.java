package br.com.tt.painelpreco.api.dto;

import br.com.tt.painelpreco.arch.api.dto.DTO;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CadastroDTO extends DTO {

  private String username;

  private String email;

  private String nome;

  private String organizacaoNome;

  private String message;

}
