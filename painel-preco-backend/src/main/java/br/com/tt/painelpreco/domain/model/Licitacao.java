package br.com.tt.painelpreco.domain.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.search.engine.backend.types.Sortable;
import org.hibernate.search.mapper.pojo.automaticindexing.ReindexOnUpdate;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.FullTextField;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.GenericField;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.IndexedEmbedded;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.IndexingDependency;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.KeywordField;

import br.com.tt.painelpreco.domain.model.vo.PeriodoCompra;
import br.com.tt.painelpreco.util.DateUtil;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Data
@Entity
@Table(name = "licitacao", schema = "mural")
public class Licitacao {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_licitacao")
	private Long id;

	@KeywordField
	@Column(insertable = false, updatable = false)
	private UUID uuid;

	@KeywordField
	private String numero;

	/** UASG */
	@ManyToOne
	@JoinColumn(name = "unidade_gestora_id")
	@IndexedEmbedded(includeDepth = 1)
	@IndexingDependency(reindexOnUpdate = ReindexOnUpdate.SHALLOW)
	private UnidadeGestora unidadeGestora;

	/** Modalidade da Compra **/
	@ManyToOne
	@JoinColumn(name = "modalidade_compra_id")
	@IndexedEmbedded(includeDepth = 1)
	@IndexingDependency(reindexOnUpdate = ReindexOnUpdate.SHALLOW)
	private ModalidadeCompra modalidadeCompra;

	@Column(name = "numero_processo")
	@KeywordField
	private String numeroProcesso;

	/** Objeto da Compra **/
	@FullTextField
	private String objeto;

	@ManyToOne
	@JoinColumn(name = "situacao_licitacao_id")
	private SituacaoLicitacao situacao;

	/** Órgão Superior **/
	@ManyToOne
	@JoinColumn(name = "orgao_id")
	@IndexedEmbedded(includeDepth = 1)
	@IndexingDependency(reindexOnUpdate = ReindexOnUpdate.SHALLOW)
	private Orgao orgao;

	/** Órgão Superior **/
	@ManyToOne
	@JoinColumn(name = "orgao_superior_id")
	@IndexedEmbedded(includeDepth = 1)
	@IndexingDependency(reindexOnUpdate = ReindexOnUpdate.SHALLOW)
	private Orgao orgaoSuperior;

	@ManyToOne
	@JoinColumn(name = "municipio_id")
	@IndexedEmbedded(includeDepth = 2)
	@IndexingDependency(reindexOnUpdate = ReindexOnUpdate.SHALLOW)
	private Municipio municipio;

	/** Forma da Compra (SISPP (preços praticados) ou o SISRP (menor preço)) **/
	@ManyToOne
	@JoinColumn(name = "forma_compra_id")
	@IndexedEmbedded(includeDepth = 1)
	@IndexingDependency(reindexOnUpdate = ReindexOnUpdate.SHALLOW)
	private FormaCompra formaCompra;

	/** Federal, Estadual, Municipal */
	@ManyToOne
	@JoinColumn(name = "esfera_id")
	@IndexedEmbedded(includeDepth = 1)
	@IndexingDependency(reindexOnUpdate = ReindexOnUpdate.SHALLOW)
	private Esfera esfera;

	@Temporal(TemporalType.DATE)
	@JoinColumn(name = "data_abertura")
	@GenericField(sortable = Sortable.YES)
	private Date dataAbertura;

	/** Ano da Compra **/
	@Temporal(TemporalType.DATE)
	@JoinColumn(name = "data_resultado_compra")
	@GenericField(sortable = Sortable.YES)
	private Date dataResultadoCompra;

	@GenericField
	private Double valor;

	@EqualsAndHashCode.Include
	@Column(name = "numero_controle_pncp")
	@KeywordField(sortable = Sortable.YES)
	private String numeroPncp;

	@OneToMany(mappedBy = "licitacao")
	private List<ItemLicitacao> itens = new ArrayList<>();

	/** Ano da Compra */
	public Integer getAnoCompra() {
		return DateUtil.getAno(dataResultadoCompra);
	}

	/**
	 * Período da Compra: comprado nos últimos: 180, 150, 120, 90, 60, 30; e há mais
	 * de 180 dias.
	 **/
	public PeriodoCompra getPeriodoCompra() {
		return new PeriodoCompra(dataResultadoCompra);
	}

	public String getNumeroFormatado() {
		try {
			String num = numero.substring(0, 1);
			String ano = numero.substring(2);

			return modalidadeCompra.getNome() + " N.º " + num + "/" + ano;
		} catch (NullPointerException | IndexOutOfBoundsException e) {
			return modalidadeCompra.getNome() + " N.º " + numero + "/" + getAnoNumeroPncp();
		}
	}

	public boolean isFederal() {
		return esfera.isFederal();
	}

	public String getAnoNumeroPncp() {
		return numeroPncp.substring(24);
	}

	public String getCodigoModalidadeComprasNet() {
		return modalidadeCompra.getCodigoComprasNet();
	}
	
	@Override
	public String toString() {
		return "Licitacao: " + numeroPncp;
	}

}
