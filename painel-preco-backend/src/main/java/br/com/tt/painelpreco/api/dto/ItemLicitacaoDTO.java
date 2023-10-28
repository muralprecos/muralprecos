package br.com.tt.painelpreco.api.dto;

import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ItemLicitacaoDTO {
	
	private UUID uuid;
	private Integer codigo;
	private String descricao;
	private String descricaoComplementar;
	private UnidadeFornecimentoDTO unidadeFornecimento;
	private Integer quantidade;
	private Double valor;
	private MaterialDTO material;
	private FornecedorDTO fornecedor;

}
