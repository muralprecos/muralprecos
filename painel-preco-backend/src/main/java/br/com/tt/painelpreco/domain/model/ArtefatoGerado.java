package br.com.tt.painelpreco.domain.model;

import java.util.Date;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import br.com.tt.painelpreco.arch.infra.auth.Usuario;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Uma versão gerada de um artefato (ETP/TR/Edital). Append-only: uma nova
 * geração sempre cria uma nova linha (versao incrementada), nunca sobrescreve
 * uma anterior — histórico completo para auditoria.
 */
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Data
@Entity
@Table(name = "artefato_gerado", schema = "mural")
public class ArtefatoGerado {

	public enum TipoEnum { ETP, TR, EDITAL }

	public enum StatusEnum { RASCUNHO, REVISADO }

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_artefato_gerado")
	private Integer id;

	@EqualsAndHashCode.Include
	private UUID uuid;

	@ManyToOne
	@JoinColumn(name = "processo_contratacao_id", nullable = false)
	private ProcessoContratacao processoContratacao;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private TipoEnum tipo;

	@Column(nullable = false)
	private Integer versao;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private StatusEnum status = StatusEnum.RASCUNHO;

	@Column(name = "nome_arquivo")
	private String nomeArquivo;

	@Lob
	private byte[] docx;

	@Column(name = "modelo_base")
	private String modeloBase;

	@Column(name = "modelo_llm")
	private String modeloLlm;

	@Column(name = "prompt_version")
	private String promptVersion;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "gerado_em", nullable = false)
	private Date geradoEm = new Date();

	@ManyToOne
	@JoinColumn(name = "gerado_por")
	private Usuario geradoPor;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "revisado_em")
	private Date revisadoEm;

	@ManyToOne
	@JoinColumn(name = "revisado_por")
	private Usuario revisadoPor;

}
