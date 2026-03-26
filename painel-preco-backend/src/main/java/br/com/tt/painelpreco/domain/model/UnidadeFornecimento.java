package br.com.tt.painelpreco.domain.model;

import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.search.mapper.pojo.mapping.definition.annotation.KeywordField;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Data
@Entity
@Table(name = "unidade_fornecimento", schema = "mural")
public class UnidadeFornecimento {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_unidade_fornecimento")
	private Integer id;
	
	@KeywordField
	@Column(insertable = false, updatable = false)
	private UUID uuid;
	
	/** Nome da Unidade de Fornecimento **/
	@EqualsAndHashCode.Include
	private String nome;
	
	public UnidadeFornecimento() {}
	
	public UnidadeFornecimento(String nome) {
		this.nome = nome;
	}

}
