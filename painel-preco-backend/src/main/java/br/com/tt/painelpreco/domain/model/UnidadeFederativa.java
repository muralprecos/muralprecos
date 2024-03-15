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

import br.com.tt.painelpreco.util.StringUtil;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Data
@Entity
@Table(name = "unidade_federativa", schema = "mural")
public class UnidadeFederativa {
	
	private static final String NAO_INFORMADO = "NI";
	private static final Map<UUID, Integer[]> regioes = new HashMap<>();
	
	static {
		regioes.put(UUID.fromString("b0826ece-e25d-11ee-82aa-0242ac120003"), new Integer[]{2, 5, 4, 15, 22, 23, 28}); //Região Norte
		regioes.put(UUID.fromString("b082702c-e25d-11ee-82aa-0242ac120003"), new Integer[]{23, 6, 7, 11, 16, 17, 18, 21, 26}); //Região Nordeste
		regioes.put(UUID.fromString("b0827068-e25d-11ee-82aa-0242ac120003"), new Integer[]{8, 10, 14, 13}); //Região Centro-Oeste
		regioes.put(UUID.fromString("b082709a-e25d-11ee-82aa-0242ac120003"), new Integer[]{9, 12, 20, 27}); //Região Sudeste
		regioes.put(UUID.fromString("b08270cc-e25d-11ee-82aa-0242ac120003"), new Integer[]{19, 24, 25}); //Região Sul
	}

	@EqualsAndHashCode.Include
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_unidade_federativa")
	private Integer id;
	
	private UUID uuid;
	
	private String nome;
	
	private String sigla;
	
	private String regiao;
	
	public boolean isRegiao() {
		return StringUtil.isEmpty(regiao) && !NAO_INFORMADO.equals(sigla) ? true : false; 
	}
	
	public static Integer[] getUFsRegiao(UUID uuid) {
		return regioes.get(uuid);
	}

}
