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
 * Porte da Empresa (Micro Empresa, Pequena Empresa, Não Informado, Não se Aplica, Outros)
 * 
 * **/
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Data
@Entity
@Table(name = "porte_fornecedor", schema = "mural")
public class PorteFornecedor {
	
	@EqualsAndHashCode.Include
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_porte_fornecedor")
	private Integer id;
	
	@Type(type = "uuid-char")
	private UUID uuid;
	
	private String nome;

}
