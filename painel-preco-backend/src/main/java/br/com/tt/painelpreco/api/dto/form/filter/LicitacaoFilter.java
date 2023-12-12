package br.com.tt.painelpreco.api.dto.form.filter;

import java.lang.reflect.Field;
import java.util.UUID;

import br.com.tt.painelpreco.domain.model.vo.PeriodoCompra;
import br.com.tt.painelpreco.util.ReflectionUtil;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LicitacaoFilter {
	
	private Integer ano;
	private String objeto;
	private UUID orgaoSuperiorId;
	private UUID orgaoId;
	private UUID ugId;
	private UUID modalidadeId;
	private Integer periodoCompraId;
	private UUID formaCompraId;
	private UUID esferaId;
	private String descricao;
	private String descricaoComplementar;
	private UUID materialId;
	private UUID porteFornecedorId;
	private UUID fornecedorId;
	private UUID ufId;
	private UUID municipioId;
	
	private boolean only = false;
	
	public PeriodoCompra getPeriodoCompra() {
		return new PeriodoCompra(periodoCompraId);
	}
	
	public boolean isObjetoOnly() {
		return isSpecificField("objeto");
	}

	private boolean isSpecificField(String fieldName) {
		boolean objeto = false;
		boolean outros = false;
		Field[] fields = ReflectionUtil.getFields(LicitacaoFilter.class);
		for (Field field : fields) {
			try {
				if (field.get(this) != null) {
					if (field.getName().equals(fieldName)) {
						objeto = true;
						break;
					} else {
						outros = true;
					}
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return objeto && !outros;
	}

}
