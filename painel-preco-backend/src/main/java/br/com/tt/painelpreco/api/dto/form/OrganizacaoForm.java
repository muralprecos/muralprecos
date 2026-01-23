package br.com.tt.painelpreco.api.dto.form;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrganizacaoForm {

  @NotBlank(message = "Nome é obrigatório")
  @Size(min = 3, max = 255, message = "Nome deve ter entre 3 e 255 caracteres")
  private String nome;

  @Size(max = 18, message = "CNPJ deve ter no máximo 18 caracteres")
  private String cnpj;

  @Size(max = 15, message = "Telefone deve ter no máximo 15 caracteres")
  private String numero;

}
