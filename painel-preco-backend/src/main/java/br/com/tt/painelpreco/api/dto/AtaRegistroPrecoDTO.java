package br.com.tt.painelpreco.api.dto;

import java.util.Date;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AtaRegistroPrecoDTO {
    private UUID uuid;
    private Integer numeroAta;
    private Integer ano;
    private String numeroPncp;
    private Date dataAssinatura;
    private Date dataVigenciaInicio;
    private Date dataVigenciaFim;
    private String situacaoNome;
    private String licitacaoNumeroPncp;
    private String licitacaoObjeto;
}
