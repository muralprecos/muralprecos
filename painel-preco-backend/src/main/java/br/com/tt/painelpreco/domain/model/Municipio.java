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

import org.hibernate.search.mapper.pojo.automaticindexing.ReindexOnUpdate;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.GenericField;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.Indexed;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.IndexedEmbedded;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.IndexingDependency;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Indexed
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Data
@Entity
@Table(name = "municipio", schema = "mural")
public class Municipio {
	
	@EqualsAndHashCode.Include
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_municipio")
	private Integer id;
	
	@GenericField
	private UUID uuid;
	
	private String nome;
	
	@ManyToOne
	@JoinColumn(name = "unidade_federativa_id")
	@IndexingDependency(reindexOnUpdate = ReindexOnUpdate.SHALLOW)
	@IndexedEmbedded(includePaths = {"uuid"})
	private UnidadeFederativa uf;

}
