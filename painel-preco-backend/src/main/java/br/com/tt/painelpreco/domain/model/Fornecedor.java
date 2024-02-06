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

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Data
@Entity
@Table(name = "fornecedor", schema = "mural")
public class Fornecedor {
	
	@EqualsAndHashCode.Include
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_fornecedor")
	private Integer id;
	
	private UUID uuid;
	
	/** CNPJ/CPF/NOME do Fornecedor **/
	private String documento;
	
	private String nome;
	
	/** Porte da Empresa (Micro Empresa, Pequena Empresa, Não Informado, Não se Aplica, Outros) **/
	@ManyToOne
	@JoinColumn(name = "porte_fornecedor_id")
	private PorteFornecedor porte;

}
