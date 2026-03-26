package br.com.tt.painelpreco.domain.model;

import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.search.mapper.pojo.mapping.definition.annotation.KeywordField;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * Federal, Estadual, Municipal
 * 
 * **/
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Data
@Entity
@Table(name = "esfera", schema = "mural")
public class Esfera {
	
	public enum EsferaEnum {
		F, E, M, D, N;
	}
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_esfera")
	private Integer id;
	
	@EqualsAndHashCode.Include
	@KeywordField
	@Column(insertable = false, updatable = false)
	private UUID uuid;
	
	@EqualsAndHashCode.Include
	@Enumerated(EnumType.STRING)
	private EsferaEnum codigo;
	
	private String nome;

	public boolean isFederal() {
		return EsferaEnum.F.equals(this.codigo);
	}

}
