package br.com.tt.painelpreco.api.dto.form.filter;

import java.util.UUID;

import br.com.tt.painelpreco.domain.model.vo.PeriodoCompra;
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
	
	public PeriodoCompra getPeriodoCompra() {
		return new PeriodoCompra(periodoCompraId);
	}

}
