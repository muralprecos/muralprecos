package br.com.tt.painelpreco.domain.model;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import br.com.tt.painelpreco.domain.model.vo.Link;
import br.com.tt.painelpreco.util.StringUtil;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Data
@Entity
@Table(name = "item_licitacao", schema = "mural")
public class ItemLicitacao {
	
	@EqualsAndHashCode.Include
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_item_licitacao")
	private Long id;
	
	private UUID uuid;
	
	@ManyToOne
	@JoinColumn(name = "licitacao_id")
	private Licitacao licitacao;
	
	private Integer codigo;

	/** Descrição do Item **/
	private String descricao;
	
	/** Descrição Complementar **/
	private String descricaoComplementar;
	
	/** Unidade de Fornecimento **/
	@ManyToOne
	@JoinColumn(name = "unidade_fornecimento_id")
	private UnidadeFornecimento unidadeFornecimento;
	
	private Integer quantidade;
	
	private Double valor;
	
	@ManyToOne
	@JoinColumn(name = "material_id")
	private Material material;
	
	@ManyToOne
	@JoinColumn(name = "fornecedor_id")
	private Fornecedor fornecedor;

	@Transient
	private List<Link> links = new ArrayList<>();
	
	public ItemLicitacao(String descricao) {
		this.descricao = descricao;
		this.descricaoComplementar = descricao;
	}
	
	public ItemLicitacao() {}
	
	public Integer getCatMat() {
		try {
			return this.getMaterial().getCodigo();
		} catch (NullPointerException e) {
			return null;
		}
	}
	
	public List<Link> getLinks() {
		String url = null;
		if (licitacao.isFederal()) {
			Integer uasg = licitacao.getUnidadeGestora().getCodigo();
			String codModalidade = licitacao.getCodigoModalidadeComprasNet();
			String numLicitacao = licitacao.getNumero();
			String anoNumeroPncp = licitacao.getAnoNumeroPncp();
			url = "https://cnetmobile.estaleiro.serpro.gov.br/comprasnet-web/public/compras/acompanhamento-compra?compra=" + uasg + codModalidade + numLicitacao + anoNumeroPncp;
		} else {
			String numeroPncp = licitacao.getNumeroPncp();
			String param1 = StringUtil.substring(numeroPncp, 0, 14);
			String param2 = StringUtil.substring(numeroPncp, 24, 4);
			String param3 = StringUtil.substring(numeroPncp, 17, 6);
			url = String.format("https://pncp.gov.br/app/editais/%s/%s/%s", param1, param2, param3);
		}
		links.add(new Link(licitacao.getNumeroFormatado(), url));
		
		return links;
	}

}
