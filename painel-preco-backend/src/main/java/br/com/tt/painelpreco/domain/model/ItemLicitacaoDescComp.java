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
@Table(name = "item_licitacao_desc_comp", schema = "mural")
public class ItemLicitacaoDescComp {
	
	@EqualsAndHashCode.Include
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_item_licitacao_desc_comp")
	private Long id;
	
	private UUID uuid;

	/** Descrição do Item **/
	private String descricaoComplementar;
	
	public ItemLicitacaoDescComp(String descricaoComplementar) {
		this.descricaoComplementar = descricaoComplementar;
	}
	
	public ItemLicitacaoDescComp() {}

}
