package br.com.tt.painelpreco.api.dto.form;

import javax.validation.constraints.NotBlank;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RefreshForm {

  @NotBlank(message = "refresh_token é obrigatório")
  private String refresh_token;

}
