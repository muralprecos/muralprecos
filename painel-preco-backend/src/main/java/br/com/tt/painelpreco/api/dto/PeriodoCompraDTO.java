package br.com.tt.painelpreco.api.dto;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@AllArgsConstructor
@Getter
@Setter
public class PeriodoCompraDTO implements Comparable<PeriodoCompraDTO> {
	
	@EqualsAndHashCode.Include
	private Integer uuid;
	private String nome;
	
	@Override
	public int compareTo(PeriodoCompraDTO o) {
		return this.uuid.compareTo(o.getUuid());
	}

}
