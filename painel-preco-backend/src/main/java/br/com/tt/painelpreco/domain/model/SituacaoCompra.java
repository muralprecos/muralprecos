package br.com.tt.painelpreco.domain.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Data
@Entity
@Table(name = "situacao_compra", schema = "mural")
public class SituacaoCompra {

    @Id
    @Column(name = "id_situacao_compra")
    @EqualsAndHashCode.Include
    private Integer id;

    private String nome;
}
