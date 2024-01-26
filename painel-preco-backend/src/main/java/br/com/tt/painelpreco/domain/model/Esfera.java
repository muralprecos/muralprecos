package br.com.tt.painelpreco.domain.model;

import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.Type;

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
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_esfera")
	private Integer id;
	
	@EqualsAndHashCode.Include
	@Type(type = "uuid-char")
	private UUID uuid;
	
	private String nome;

}
