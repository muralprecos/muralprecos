package br.com.tt.painelpreco.domain.model;

import java.math.BigDecimal;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Snapshot imutável de um item pesquisado no momento da criação do processo
 * de contratação. Não é FK para ItemLicitacao de propósito: precisa
 * sobreviver a mudanças futuras na linha de origem.
 */
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Data
@Entity
@Table(name = "item_processo_contratacao", schema = "mural")
public class ItemProcessoContratacao {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_item_processo_contratacao")
	private Integer id;

	@EqualsAndHashCode.Include
	@ManyToOne
	@JoinColumn(name = "processo_contratacao_id", nullable = false)
	private ProcessoContratacao processoContratacao;

	@Column(name = "item_licitacao_origem_uuid")
	private UUID itemLicitacaoOrigemUuid;

	@Column(name = "numero_item")
	private String numeroItem;

	@Column(columnDefinition = "TEXT")
	private String descricao;

	@Column(name = "descricao_complementar", columnDefinition = "TEXT")
	private String descricaoComplementar;

	@Column(name = "unidade_fornecimento")
	private String unidadeFornecimento;

	private Long quantidade;

	@Column(name = "valor_unitario")
	private BigDecimal valorUnitario;

	@Column(name = "valor_total")
	private BigDecimal valorTotal;

	@Column(name = "fornecedor_nome")
	private String fornecedorNome;

	@Column(name = "fornecedor_documento")
	private String fornecedorDocumento;

	@Column(name = "licitacao_numero_pncp")
	private String licitacaoNumeroPncp;

	@Column(name = "licitacao_modalidade")
	private String licitacaoModalidade;

	@Column(name = "licitacao_uf")
	private String licitacaoUf;

}
