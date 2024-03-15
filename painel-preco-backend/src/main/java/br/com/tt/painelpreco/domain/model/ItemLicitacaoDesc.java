package br.com.tt.painelpreco.domain.model;

import java.util.UUID;

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
@Table(name = "item_licitacao_desc", schema = "mural")
public class ItemLicitacaoDesc {
	
	@EqualsAndHashCode.Include
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_item_licitacao_desc")
	private Long id;
	
	private UUID uuid;

	/** Descrição do Item **/
	private String descricao;
	
	public ItemLicitacaoDesc(String descricao) {
		this.descricao = descricao;
	}
	
	public ItemLicitacaoDesc() {}

}
