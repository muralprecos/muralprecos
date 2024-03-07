package br.com.tt.painelpreco.domain.model;

import java.util.Date;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import br.com.tt.painelpreco.util.DateUtil;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * Federal, Estadual, Municipal
 * 
 * **/
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Data
@Entity
@Table(name = "cotacao", schema = "mural")
public class Cotacao {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_cotacao")
	private Integer id;
	
	@EqualsAndHashCode.Include
	private UUID uuid;
	
	@Column(nullable = false)
	private String nome;
	
	@Column(name = "nome_arquivo", nullable = false)
	private String nomeArquivo;
	
	@Column(name = "string_busca")
	private String stringBusca;
	
	@Column(name = "hash_validacao", nullable = false)
	private String hashValidacao;
	
	@Lob
	@Column(nullable = false)
	private byte[] arquivo;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "criado_em", nullable = false)
	private Date criadoEm = new Date();
	
	@Column(name = "criado_por", nullable = true)
	private String criadoPor;
	
	@Column(nullable = true)
	private String ip;
	
	public Cotacao() {}
		
	public Cotacao(UUID uuid, String nome, String nomeArquivo, String stringBusca, String hashValidacao, Date criadoEm) {
		this.uuid = uuid;
		this.nome = nome;
		this.nomeArquivo = nomeArquivo;
		this.stringBusca = stringBusca;
		this.hashValidacao = hashValidacao;
		this.criadoEm = criadoEm;
	}
	
	
	public String getCriadoEm() {
		return DateUtil.format(criadoEm, DateUtil.DD_MM_YYYY);
	}
	
	@Override
	public String toString() {
		return String.format("[Timestamp]=%s; [criadoPor]=%s; [ip]=%s; [stringBusca]=%s; [criadoEm]=%s; [nome]=%s; [nomeArquivo]=%s; [epilogo]=%s", new Date(), criadoPor, ip, stringBusca, criadoEm, nome, nomeArquivo, UUID.randomUUID());
	}
	
}
