package br.com.tt.painelpreco.domain.model;

import java.util.UUID;

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
@Table(name = "item_licitacao", schema = "mural")
public class ItemLicitacao {
	
	@EqualsAndHashCode.Include
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_item_licitacao")
	private Long id;
	
	private UUID uuid;
	
	@ManyToOne
	@JoinColumn(name = "licitacao_id")
	private Licitacao licitacao;
	
	private Integer codigo;

	/** Descrição do Item **/
	private String descricao;
	
	/** Descrição Complementar **/
	private String descricaoComplementar;
	
	/** Unidade de Fornecimento **/
	@ManyToOne
	@JoinColumn(name = "unidade_fornecimento_id")
	private UnidadeFornecimento unidadeFornecimento;
	
	private Integer quantidade;
	
	private Double valor;
	
	@ManyToOne
	@JoinColumn(name = "material_id")
	private Material material;
	
	@ManyToOne
	@JoinColumn(name = "fornecedor_id")
	private Fornecedor fornecedor;

	public Integer getCatMat() {
		try {
			return this.getMaterial().getCodigo();
		} catch (NullPointerException e) {
			return null;
		}
	}

}
