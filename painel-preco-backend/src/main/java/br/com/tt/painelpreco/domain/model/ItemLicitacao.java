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
		Integer uasg = licitacao.getUnidadeGestora().getCodigo();
		Integer numLicitacao = licitacao.getNumero();
		Integer codModalidade = licitacao.getModalidadeCompra().getCodigo();
		String url = "http://comprasnet.gov.br/livre/pregao/ata2.asp?co_no_uasg=" + uasg + "&numprp=" + numLicitacao + "&codigoModalidade=" + codModalidade + "&f_lstSrp=T&f_Uf=&f_numPrp=0&f_codUasg=" + uasg + "&f_codMod=" + codModalidade + "&f_tpPregao=E&f_lstICMS=T&f_dtAberturaIni=&f_dtAberturaFim=";
		links.add(new Link(licitacao.getNumeroFormatado(), url));
		
		return links;
	}

}
