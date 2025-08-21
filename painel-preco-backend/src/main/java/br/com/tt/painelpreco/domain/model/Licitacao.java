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

import br.com.tt.painelpreco.domain.model.vo.PeriodoCompra;
import br.com.tt.painelpreco.util.DateUtil;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Data
@Entity
@Table(name = "licitacao", schema = "mural")
public class Licitacao {
	
	@EqualsAndHashCode.Include
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_licitacao")
	private Long id;
	
	private UUID uuid;
	
	private String numero;
	
	/** UASG */
	@ManyToOne
	@JoinColumn(name = "unidade_gestora_id")
	private UnidadeGestora unidadeGestora;
	
	/** Modalidade da Compra **/
	@ManyToOne
	@JoinColumn(name = "modalidade_compra_id")
	private ModalidadeCompra modalidadeCompra;
	
	@Column(name = "numero_processo")
	private String numeroProcesso;
	
	/** Objeto da Compra **/
	private String objeto;
	
	@ManyToOne
	@JoinColumn(name = "situacao_licitacao_id")
	private SituacaoLicitacao situacao;
	
	/** Órgão Superior **/
	@ManyToOne
	@JoinColumn(name = "orgao_id")
	private Orgao orgao;
	
	/** Órgão Superior **/
	@ManyToOne
	@JoinColumn(name = "orgao_superior_id")
	private Orgao orgaoSuperior;
	
	@ManyToOne
	@JoinColumn(name = "municipio_id")
	private Municipio municipio;
	
	/** Forma da Compra (SISPP (preços praticados) ou o SISRP (menor preço)) **/
	@ManyToOne
	@JoinColumn(name = "forma_compra_id")
	private FormaCompra formaCompra;
	
	/** Federal, Estadual, Municipal */
	@ManyToOne
	@JoinColumn(name = "esfera_id")
	private Esfera esfera;
	
	@Temporal(TemporalType.DATE)
	@JoinColumn(name = "data_abertura")
	private Date dataAbertura;
	
	/** Ano da Compra **/
	@Temporal(TemporalType.DATE)
	@JoinColumn(name = "data_resultado_compra")
	private Date dataResultadoCompra;
	
	private Double valor;
	
	@Column(name = "numero_controle_pncp")
	private String numeroPncp;
	
	@OneToMany(mappedBy = "licitacao")
	private List<ItemLicitacao> itens = new ArrayList<>();
	
	/** Ano da Compra */
	public Integer getAnoCompra() {
		return DateUtil.getAno(dataResultadoCompra);
	}
	
	/** Período da Compra: comprado nos últimos: 180, 150, 120, 90, 60, 30; e há mais de 180 dias. **/
	public PeriodoCompra getPeriodoCompra() {
		return new PeriodoCompra(dataResultadoCompra);
	}
	
	public String getNumeroFormatado() {
		String numStr = String.valueOf(numero);
		String num = numStr.substring(0, 1);
		String ano = numStr.substring(2);
		
		return modalidadeCompra.getNome() + " N.º " + num + "/" + ano;
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

}
