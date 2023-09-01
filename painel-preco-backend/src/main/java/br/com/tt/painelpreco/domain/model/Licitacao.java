package br.com.tt.painelpreco.domain.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Data
@Entity
@Table(name = "licitacao", schema = "painel")
public class Licitacao {
	
	@EqualsAndHashCode.Include
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_licitacao")
	private Long id;
	
	private Integer numero;
	
	@ManyToOne
	@JoinColumn(name = "unidade_gestora_id")
	private UnidadeGestora unidadeGestora;
	
	@ManyToOne
	@JoinColumn(name = "modalidade_compra_id")
	private ModalidadeCompra modalidadeCompra;
	
	@Column(name = "numero_processo")
	private String numeroProcesso;
	
	@Lob
	private String objeto;
	
	@ManyToOne
	@JoinColumn(name = "situacao_licitacao_id")
	private SituacaoLicitacao situacao;
	
	@ManyToOne
	@JoinColumn(name = "orgao_id")
	private Orgao orgao;
	
	@ManyToOne
	@JoinColumn(name = "orgao_superior_id")
	private Orgao orgaoSuperior;
	
	@ManyToOne
	@JoinColumn(name = "municipio_id")
	private Municipio municipio;
	
	@Temporal(TemporalType.DATE)
	@JoinColumn(name = "data_abertura")
	private Date dataAbertura;
	
	@Temporal(TemporalType.DATE)
	@JoinColumn(name = "data_resultado_compra")
	private Date dataResultadoCompra;
	
	private Double valor;

}
