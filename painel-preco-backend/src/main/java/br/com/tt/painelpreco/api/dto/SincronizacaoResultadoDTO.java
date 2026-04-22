package br.com.tt.painelpreco.api.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class SincronizacaoResultadoDTO {

  private int usuariosDesativados = 0;
  private int usuariosReativados = 0;
  private int usuariosCriados = 0;
  private int usuariosComConflito = 0;
  private int usuariosNaoAlterados = 0;

  private int organizacoesDesativadas = 0;
  private int organizacoesReativadas = 0;
  private int organizacoesCriadas = 0;
  private int organizacoesComConflito = 0;
  private int organizacoesNaoAlteradas = 0;

  private List<String> mensagens = new ArrayList<>();

  public void incrementUsuariosDesativados() { this.usuariosDesativados++; }
  public void incrementUsuariosReativados() { this.usuariosReativados++; }
  public void incrementUsuariosCriados() { this.usuariosCriados++; }
  public void incrementUsuariosComConflito() { this.usuariosComConflito++; }
  public void incrementUsuariosNaoAlterados() { this.usuariosNaoAlterados++; }

  public void incrementOrganizacoesDesativadas() { this.organizacoesDesativadas++; }
  public void incrementOrganizacoesReativadas() { this.organizacoesReativadas++; }
  public void incrementOrganizacoesCriadas() { this.organizacoesCriadas++; }
  public void incrementOrganizacoesComConflito() { this.organizacoesComConflito++; }
  public void incrementOrganizacoesNaoAlteradas() { this.organizacoesNaoAlteradas++; }

  public void addMensagem(String mensagem) { this.mensagens.add(mensagem); }

}
