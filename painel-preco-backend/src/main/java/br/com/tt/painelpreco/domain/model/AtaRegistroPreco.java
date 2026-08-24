package br.com.tt.painelpreco.domain.model;

import java.util.Date;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Data
@Entity
@Table(name = "ata_registro_preco", schema = "mural")
public class AtaRegistroPreco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ata_registro_preco")
    private Long id;

    @Column(insertable = false, updatable = false)
    private UUID uuid;

    @Column(name = "numero_ata")
    private Integer numeroAta;

    private Integer ano;

    private Integer sequencial;

    @EqualsAndHashCode.Include
    @Column(name = "numero_controle_pncp", unique = true)
    private String numeroPncp;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "data_assinatura")
    private Date dataAssinatura;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "data_vigencia_inicio")
    private Date dataVigenciaInicio;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "data_vigencia_fim")
    private Date dataVigenciaFim;

    @Column(name = "situacao_id")
    private Integer situacaoId;

    @Column(name = "situacao_nome")
    private String situacaoNome;

    @ManyToOne
    @JoinColumn(name = "licitacao_id")
    private Licitacao licitacao;
}
