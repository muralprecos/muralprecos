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
@Table(name = "modalidade_compra", schema = "mural")
public class ModalidadeCompra {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_modalidade_compra")
	private Integer id;
	
	@EqualsAndHashCode.Include
	private UUID uuid;
	
	private Integer codigo;
	
	private String nome;
	
	public Integer getCodigo() {
		if (codigo.equals(-97)) return 3;
		if (codigo.equals(-98)) return 4;
		if (codigo.equals(-99)) return 5;
		return codigo;
	}

}
