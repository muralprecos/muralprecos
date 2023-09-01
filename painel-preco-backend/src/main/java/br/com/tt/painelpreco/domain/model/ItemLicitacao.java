package br.com.tt.painelpreco.domain.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Data
@Entity
@Table(name = "item_licitacao", schema = "painel")
public class ItemLicitacao {
	
	@EqualsAndHashCode.Include
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_item_licitacao")
	private Long id;
	
	@ManyToOne
	@JoinColumn(name = "licitacao_id")
	private Licitacao licitacao;
	
	private Integer codigo;

	private String descricao;
	
	private Integer quantidade;
	
	private Double valor;
	
	@ManyToOne
	@JoinColumn(name = "fornecedor_id")
	private Fornecedor fornecedor;

}
