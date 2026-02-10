package br.com.tt.painelpreco.pncp.domain.model;

import java.time.LocalDateTime;

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
@Table(name = "ingestao_dados_pncp", schema = "mural")
public class IngestaoDadosPncp {
	
	@EqualsAndHashCode.Include
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_ingestao_dados_pncp")
    private Long id; 

    @Column(name = "data_inicio")
    private LocalDateTime dataInicio;
    
    @Column(name = "data_fim")
    private LocalDateTime dataFim;
    
    @Column(name = "total_licitacoes")
    private Integer totalLicitacao;
    
    @Column(name = "total_itens_licitacao")
    private Integer totalItensLicitacao;

    private String detalhes;
    
    private Integer status;
    
    public IngestaoDadosPncp() {}

    public IngestaoDadosPncp(LocalDateTime dataInicio, String detalhes) {
        this.dataInicio = dataInicio;
        this.detalhes = detalhes;
        this.status = 0; // Default
    }

}
