package br.com.tt.painelpreco.domain.model;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.search.mapper.pojo.mapping.definition.annotation.GenericField;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.KeywordField;

import br.com.tt.painelpreco.util.StringUtil;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Data
@Entity
@Table(name = "unidade_federativa", schema = "mural")
public class UnidadeFederativa {
	
	private static final String NAO_INFORMADO = "NI";

	@GenericField
	@EqualsAndHashCode.Include
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_unidade_federativa")
	private Integer id;
	
	@KeywordField
	@Column(insertable = false, updatable = false)
	private UUID uuid;
	
	private String nome;
	
	@EqualsAndHashCode.Include
	private String sigla;
	
	private String regiao;
	
	public boolean isRegiao() {
		return StringUtil.isEmpty(regiao) && !NAO_INFORMADO.equals(sigla) ? true : false; 
	}
	

}
