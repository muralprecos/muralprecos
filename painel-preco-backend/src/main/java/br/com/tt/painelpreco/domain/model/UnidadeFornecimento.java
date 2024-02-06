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
@Table(name = "unidade_fornecimento", schema = "mural")
public class UnidadeFornecimento {
	
	@EqualsAndHashCode.Include
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_unidade_fornecimento")
	private Integer id;
	
	private UUID uuid;
	
	/** Nome da Unidade de Fornecimento **/
	private String nome;

}
