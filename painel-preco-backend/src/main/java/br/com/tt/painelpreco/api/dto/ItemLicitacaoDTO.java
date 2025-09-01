package br.com.tt.painelpreco.api.dto;

import java.text.NumberFormat;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

import br.com.tt.painelpreco.domain.model.vo.Link;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ItemLicitacaoDTO {
	
	private UUID uuid;
	private String codigo;
	private String descricao;
	private String descricaoComplementar;
	private UnidadeFornecimentoDTO unidadeFornecimento;
	private Integer quantidade;
	private Double valor;
	private MaterialDTO material;
	private FornecedorDTO fornecedor;
	private LicitacaoDTO licitacao;
	private List<Link> links;
	
	public String getValor() {
		Locale localBrasil = new Locale("pt", "BR");
		return NumberFormat.getCurrencyInstance(localBrasil).format(valor);
	}

}
