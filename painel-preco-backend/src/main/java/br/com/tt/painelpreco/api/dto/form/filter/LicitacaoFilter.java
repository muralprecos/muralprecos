package br.com.tt.painelpreco.api.dto.form.filter;

import java.util.UUID;

import br.com.tt.painelpreco.domain.model.vo.PeriodoCompra;
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
	
	public PeriodoCompra getPeriodoCompra() {
		return new PeriodoCompra(periodoCompraId);
	}

}
