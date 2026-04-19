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
@Table(name = "situacao_licitacao", schema = "mural")
public class SituacaoLicitacao {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_situacao_licitacao")
	private Integer id;
	
	@EqualsAndHashCode.Include
	@Column(insertable = false, updatable = false)
	private UUID uuid;
	
	@EqualsAndHashCode.Include
	private String nome;

}
