package br.com.tt.painelpreco.api.dto.form;

import javax.validation.constraints.Email;
import javax.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioForm {

  @Size(min = 3, max = 50, message = "Username deve ter entre 3 e 50 caracteres")
  private String username;

  @Size(min = 6, message = "Senha deve ter no mínimo 6 caracteres")
  private String password;

  @Email(message = "Email inválido")
  private String email;

  @Size(max = 100, message = "Primeiro nome deve ter no máximo 100 caracteres")
  private String firstName;

  @Size(max = 100, message = "Sobrenome deve ter no máximo 100 caracteres")
  private String lastName;

  private String organizacaoId;

  private Boolean enabled;

}
