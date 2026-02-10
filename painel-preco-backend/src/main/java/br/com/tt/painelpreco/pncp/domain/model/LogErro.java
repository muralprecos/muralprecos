package br.com.tt.painelpreco.pncp.domain.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Data
@Entity
@Table(name = "log_erro", schema = "mural")
public class LogErro {
	
	@EqualsAndHashCode.Include
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_log_erro")
    private Long id;

    @Column(name = "criadoEm")
    private Date criadoEm;

    private String tipo;
    
    private String detalhes;

    public LogErro(Date criadoEm, String tipo, String detalhes) {
        this.criadoEm = criadoEm;
        this.tipo = tipo;
        this.detalhes = detalhes;
    }

}
