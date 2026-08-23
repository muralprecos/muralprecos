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
import javax.persistence.NamedAttributeNode;
import javax.persistence.NamedEntityGraph;
import javax.persistence.NamedSubgraph;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.search.engine.backend.types.Sortable;
import org.hibernate.search.mapper.pojo.automaticindexing.ReindexOnUpdate;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.DocumentId;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.ObjectPath;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.PropertyValue;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.FullTextField;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.GenericField;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.Indexed;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.IndexedEmbedded;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.IndexingDependency;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.KeywordField;

import br.com.tt.painelpreco.domain.model.vo.Link;
import br.com.tt.painelpreco.util.StringUtil;
import lombok.Data;
import lombok.EqualsAndHashCode;

@NamedEntityGraph(
		name = "itemLicitacao.withDetails",
		attributeNodes = {
				@NamedAttributeNode("unidadeFornecimento"),
				@NamedAttributeNode("material"),
				@NamedAttributeNode(value = "fornecedor", subgraph = "fornecedor.withPorte"),
				@NamedAttributeNode(value = "licitacao", subgraph = "licitacao.withDetails")
		},
		subgraphs = {
				@NamedSubgraph(
						name = "licitacao.withDetails",
						attributeNodes = {
								@NamedAttributeNode("unidadeGestora"),
								@NamedAttributeNode("modalidadeCompra"),
								@NamedAttributeNode("orgao"),
								@NamedAttributeNode("orgaoSuperior"),
								@NamedAttributeNode(value = "municipio", subgraph = "municipio.withUf"),
								@NamedAttributeNode("formaCompra"),
								@NamedAttributeNode("esfera"),
								@NamedAttributeNode("situacao")
						}
				),
				@NamedSubgraph(
						name = "municipio.withUf",
						attributeNodes = {
								@NamedAttributeNode("uf")
						}
				),
				@NamedSubgraph(
						name = "fornecedor.withPorte",
						attributeNodes = {
								@NamedAttributeNode("porte")
						}
				)
		}
)
@Indexed
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Data
@Entity
@Table(name = "item_licitacao", schema = "mural")
public class ItemLicitacao {

	@DocumentId
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_item_licitacao")
	@GenericField(sortable = Sortable.YES)
	private Long id;

	@KeywordField
	@Column(insertable = false, updatable = false)
	private UUID uuid;

	@ManyToOne
	@JoinColumn(name = "licitacao_id")
	//TODO: avaliar necessidade de profundidade = 3
	@IndexedEmbedded(includeDepth = 3)
	@IndexingDependency(reindexOnUpdate = ReindexOnUpdate.SHALLOW)
	private Licitacao licitacao;

	@KeywordField
	private String codigo;

	/** Descrição do Item **/
	@FullTextField
	@KeywordField(name = "descricao_sort", sortable = Sortable.YES)
	private String descricao;

	/** Descrição Complementar **/
	@FullTextField
	private String descricaoComplementar;

	/** Unidade de Fornecimento **/
	@ManyToOne
	@JoinColumn(name = "unidade_fornecimento_id")
	@IndexedEmbedded(includeDepth = 1)
	@IndexingDependency(reindexOnUpdate = ReindexOnUpdate.SHALLOW)
	private UnidadeFornecimento unidadeFornecimento;

	@GenericField(sortable = Sortable.YES)
	private Long quantidade;

	@GenericField(sortable = Sortable.YES)
	private Double valor;

	@ManyToOne
	@JoinColumn(name = "material_id")
	@IndexedEmbedded(includeDepth = 1)
	@IndexingDependency(reindexOnUpdate = ReindexOnUpdate.SHALLOW)
	private Material material;

	@ManyToOne
	@JoinColumn(name = "fornecedor_id")
	@IndexedEmbedded(includeDepth = 1)
	@IndexingDependency(reindexOnUpdate = ReindexOnUpdate.SHALLOW)
	private Fornecedor fornecedor;

	@EqualsAndHashCode.Include
	@Column(name = "numero_item")
	@GenericField(sortable = Sortable.YES)
	private Integer numeroItem;

	@EqualsAndHashCode.Include
	@Column(name = "numero_controle_pncp")
	@KeywordField(sortable = Sortable.YES)
	private String numeroPncp;

	@Transient
	private List<Link> links = new ArrayList<>();

	public ItemLicitacao(String descricao) {
		this.descricao = descricao;
		this.descricaoComplementar = descricao;
	}

	public ItemLicitacao() {
	}

	public Integer getCatMat() {
		try {
			return this.getMaterial().getCodigo();
		} catch (NullPointerException e) {
			return null;
		}
	}

	public List<Link> getLinks() {
		String numeroPncp = licitacao.getNumeroPncp();
		String param1 = StringUtil.substring(numeroPncp, 0, 14);
		String param2 = StringUtil.substring(numeroPncp, 24, 4);
		String param3 = StringUtil.substring(numeroPncp, 17, 6);
		String url = String.format("https://pncp.gov.br/app/editais/%s/%s/%s", param1, param2, param3);

		links.add(new Link(licitacao.getNumeroFormatado(), url));

		return links;
	}
	
	@IndexingDependency(derivedFrom = {
			@ObjectPath(@PropertyValue(propertyName = "valor")),
			@ObjectPath(@PropertyValue(propertyName = "quantidade"))
	})
	@GenericField(name = "valorUnitario", sortable = Sortable.YES)
	public Double getValorUnitario() {
		if (valor == null || quantidade == null || quantidade == 0) {
			return null;
		}
		return valor / quantidade;
	}

	@Override
	public String toString() {
		return "Item Licitação: " + numeroPncp + " / " + numeroItem; 
	}

}
