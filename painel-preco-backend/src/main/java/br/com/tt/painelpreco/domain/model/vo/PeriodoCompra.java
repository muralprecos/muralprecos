package br.com.tt.painelpreco.domain.model.vo;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import br.com.tt.painelpreco.util.DateUtil;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PeriodoCompra {
	
	private static final Integer[] VALORES_LIMITROFES = {30, 60, 90, 120, 150, 180};

	private static Map<Integer, String> periodos = new HashMap<>();
	
	static {
		for (Integer limite : VALORES_LIMITROFES)
			periodos.put(limite, String.format("Comprado nos últimos %d dias", limite));
		
		periodos.put(181, String.format("Comprado há mais de %d dias", VALORES_LIMITROFES[VALORES_LIMITROFES.length - 1]));
	}
	
	private Date dataCompra;
	
	private Integer limite;
	
	public PeriodoCompra(Date dataCompra) {
		this.dataCompra = dataCompra;
	}
	
	public PeriodoCompra(Integer limite) {
		this.limite = limite;
		this.dataCompra = DateUtil.decrementaDeHoje(limite);
	}

	public static Map<Integer, String> getPeriodos() {
		 return periodos;
	}
	
	public Integer getUuid() {
		return getIntervalo().intValue();
	}
	
	/** Período da Compra: comprado nos últimos: 180, 150, 120, 90, 60, 30; e há mais de 180 dias. **/
	public String getPeriodo() {
		long intervalo = getIntervalo();
		for (Integer limite : VALORES_LIMITROFES) {
			if (intervalo <= limite)
				return String.format("Comprado nos últimos %d dias", limite);
		}
		// Último elemento
		return String.format("Comprado há mais de %d dias", VALORES_LIMITROFES[VALORES_LIMITROFES.length - 1]);
	}

	private Long getIntervalo() {
		return DateUtil.getIntervalo(dataCompra, new Date());
	}

	@Override
	public int hashCode() {
		return Objects.hash(getUuid());
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		PeriodoCompra other = (PeriodoCompra) obj;
		return Objects.equals(getUuid(), other.getUuid());
	}
	
	

}
