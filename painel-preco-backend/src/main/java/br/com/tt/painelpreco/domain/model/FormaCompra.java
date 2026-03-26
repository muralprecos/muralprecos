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

/**
 * 
 * Forma da Compra (SISPP (preços praticados) ou o SISRP (menor preço))
 * 
 * **/
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Data
@Entity
@Table(name = "forma_compra", schema = "mural")
public class FormaCompra {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_forma_compra")
	private Integer id;
	
	@EqualsAndHashCode.Include
	@KeywordField
	@Column(insertable = false, updatable = false)
	private UUID uuid;
	
	@EqualsAndHashCode.Include
	private String nome;
	
	private String sigla;

}
