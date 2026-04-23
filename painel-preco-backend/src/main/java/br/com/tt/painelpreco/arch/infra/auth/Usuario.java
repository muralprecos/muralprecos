package br.com.tt.painelpreco.arch.infra.auth;

import java.time.LocalDateTime;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;
import javax.persistence.Table;

import br.com.tt.painelpreco.util.StringUtil;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Data
@Entity
@Table(name = "usuario", schema = "mural")
public class Usuario {
	
	private static final String CABECALHO_PADRAO = "TT Soluções & Consultoria - Unidade de Compras e Licitações";

	private static final byte[] LOGO_PADRAO = Organizacao.LOGO_PADRAO;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id_usuario")
	private Integer id;
	
	@EqualsAndHashCode.Include
	private UUID uuid;

	private String login;

	private String nome;
	
	private String email;

	@Column(name = "ativo")
	private Boolean ativo = true;

	@Column(name = "data_criacao")
	private LocalDateTime dataCriacao;

	@Column(name = "detalhes_ultima_sincronizacao", columnDefinition = "TEXT")
	private String detalhesUltimaSincronizacao;

	@Column(name = "data_ultima_sincronizacao")
	private LocalDateTime dataUltimaSincronizacao;

	@Column(name = "usuario_sincronizacao_id")
	private Integer usuarioSincronizacaoId;
	
	@ManyToOne
	@JoinColumn(name = "organizacao_id")
	private Organizacao organizacao;
	
	public Usuario() {}
	
	public Usuario(String login, String nome, String email, Organizacao organizacao) {
		this.login = login;
		this.nome = nome;
		this.email = email;
		this.organizacao = organizacao;
	}

	@PrePersist
	protected void onCreate() {
		if (dataCriacao == null) {
			dataCriacao = LocalDateTime.now();
		}
		if (ativo == null) {
			ativo = true;
		}
	}

	public String getCabecalho() {
		String nome = this.getOrganizacaoNome();
		if (!StringUtil.isEmpty(nome))
			return nome;
		
		return CABECALHO_PADRAO;
	}

	private String getOrganizacaoNome() {
		return this.organizacao == null ? null : organizacao.getNome();
	}

	public byte[] getLogo() {
		return this.getOrganizacaoLogo();
	}

	private byte[] getOrganizacaoLogo() {
		return this.organizacao != null ? organizacao.getLogo() : LOGO_PADRAO;
	}

}
