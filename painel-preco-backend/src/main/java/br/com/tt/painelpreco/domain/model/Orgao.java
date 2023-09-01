package br.com.tt.painelpreco.domain.model;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Data
@Entity
@Table(name = "orgao", schema = "painel")
public class Orgao {
	
	@EqualsAndHashCode.Include
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_orgao")
	private Integer id;
	
	private String nome;
	
	private Integer codigo;
	
	@ManyToOne
	@JoinColumn(name = "superior_id")
	private Orgao superior;
	
	@OneToMany(mappedBy = "superior")
	private List<Orgao> subOrgaos;

}
