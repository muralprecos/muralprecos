package br.com.tt.painelpreco.api.dto.form;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CadastroForm {

  @NotBlank(message = "Username é obrigatório")
  @Size(min = 3, max = 50, message = "Username deve ter entre 3 e 50 caracteres")
  private String username;

  @NotBlank(message = "Senha é obrigatória")
  @Size(min = 6, message = "Senha deve ter no mínimo 6 caracteres")
  private String password;

  @NotBlank(message = "Email é obrigatório")
  @Email(message = "Email inválido")
  private String email;

  @NotBlank(message = "Primeiro nome é obrigatório")
  @Size(max = 100, message = "Primeiro nome deve ter no máximo 100 caracteres")
  private String firstName;

  @NotBlank(message = "Sobrenome é obrigatório")
  @Size(max = 100, message = "Sobrenome deve ter no máximo 100 caracteres")
  private String lastName;

  @NotBlank(message = "Organização é obrigatória")
  private String organizacaoId;

}
