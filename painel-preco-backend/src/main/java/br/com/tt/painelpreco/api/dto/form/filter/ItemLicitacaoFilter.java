package br.com.tt.painelpreco.api.dto.form.filter;

import java.lang.reflect.Field;
import java.util.UUID;

import br.com.tt.painelpreco.domain.model.vo.PeriodoCompra;
import br.com.tt.painelpreco.util.ReflectionUtil;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ItemLicitacaoFilter {
	
	private UUID uuid;
	private String descricao;
	private String descricaoComplementar;
	
	/** ============== LICITACAO ============== **/
	private Integer ano;
	private String objeto;
	private UUID orgaoSuperiorId;
	private UUID orgaoId;
	private UUID ugId;
	private UUID modalidadeId;
	private Integer periodoCompraId;
	private UUID formaCompraId;
	private UUID esferaId;
	private UUID materialId;
	private UUID porteFornecedorId;
	private UUID fornecedorId;
	private String regiao;
	private Integer[] idsUFsRegiao;
	private UUID ufId;
	private UUID municipioId;
	private UUID unidadeFornecimentoId;
	/** ============== LICITACAO ============== **/
	
	private boolean only = false;
	
	public PeriodoCompra getPeriodoCompra() {
		return new PeriodoCompra(periodoCompraId);
	}
	
	public boolean isDescricaoOnly() {
		return isSpecificField("descricao");
	}
	
	public boolean isDescricaoComplmentarOnly() {
		return isSpecificField("descricaoComplementar");
	}

	private boolean isSpecificField(String fieldName) {
		boolean objeto = false;
		boolean outros = false;
		Field[] fields = ReflectionUtil.getFields(ItemLicitacaoFilter.class);
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
