package br.com.tt.painelpreco.domain.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Auditoria por seção/token processado numa geração: registra exatamente
 * quais fatos foram enviados à IA (ou se a seção foi 100% determinística) e
 * qual foi a resposta bruta — base para revisão e defesa em auditoria (TCU).
 */
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Data
@Entity
@Table(name = "artefato_secao_log", schema = "mural")
public class ArtefatoSecaoLog {

	public enum OrigemEnum { DETERMINISTICO, LLM_SELECAO_CLAUSULA, LLM_REDACAO_LIVRE }

	@Id
	@EqualsAndHashCode.Include
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_artefato_secao_log")
	private Integer id;

	@ManyToOne
	@JoinColumn(name = "artefato_gerado_id", nullable = false)
	private ArtefatoGerado artefatoGerado;

	@Column(name = "secao_chave", nullable = false)
	private String secaoChave;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private OrigemEnum origem;

	@Column(name = "clausula_selecionada")
	private String clausulaSelecionada;

	@Column(name = "facts_enviados", columnDefinition = "TEXT")
	private String factsEnviados;

	@Column(name = "resposta_bruta", columnDefinition = "TEXT")
	private String respostaBruta;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "criado_em", nullable = false)
	private Date criadoEm = new Date();

}
