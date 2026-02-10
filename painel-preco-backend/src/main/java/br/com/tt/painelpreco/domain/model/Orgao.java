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

import org.hibernate.search.mapper.pojo.mapping.definition.annotation.KeywordField;

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
	@KeywordField
	@Column(insertable = false, updatable = false)
	private UUID uuid;

	private Integer codigo;

	private String nome;
	
	private String cnpj;
	
	@Column(name = "poder_id")
	private String poder;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "esfera_id")
	private Esfera esfera;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "superior_id")
	private Orgao superior;

	@OneToMany(mappedBy = "superior", fetch = FetchType.LAZY)
	private List<Orgao> subOrgaos;

	public boolean getEhSuperior() {
		return superior == null;
	}

}
