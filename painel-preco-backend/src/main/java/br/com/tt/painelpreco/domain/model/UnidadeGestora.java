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
@Table(name = "unidade_gestora", schema = "mural")
public class UnidadeGestora {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_unidade_gestora")
	private Integer id;
	
	@EqualsAndHashCode.Include
	@KeywordField
	private UUID uuid;
	
	/** UASG */
	private String codigo;
	
	private String nome;

}
