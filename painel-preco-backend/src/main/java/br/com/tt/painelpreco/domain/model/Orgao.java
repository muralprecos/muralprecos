package br.com.tt.painelpreco.domain.model;

import java.util.List;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
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
@Table(name = "orgao", schema = "mural")
public class Orgao {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_orgao")
	private Integer id;
	
	@EqualsAndHashCode.Include
	private UUID uuid;
	
	private Integer codigo;
	
	private String nome;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "superior_id")
	private Orgao superior;
	
	@OneToMany(mappedBy = "superior", fetch = FetchType.LAZY)
	private List<Orgao> subOrgaos;
	
	public boolean getEhSuperior() {
		return superior == null;
	}
	
}
