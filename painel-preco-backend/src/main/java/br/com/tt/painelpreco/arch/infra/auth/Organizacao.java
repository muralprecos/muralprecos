package br.com.tt.painelpreco.arch.infra.auth;

import java.time.LocalDateTime;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.PrePersist;
import javax.persistence.Table;

import org.hibernate.annotations.Type;

import br.com.tt.painelpreco.util.IOUtil;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Data
@Entity
@Table(name = "organizacao", schema = "mural")
public class Organizacao {

	public static final byte[] LOGO_PADRAO = IOUtil.loadArrayByteInClassPath("static/images/logo.png");

	@Id
	@Column(name = "id_organizacao")
	private Integer id;

	@EqualsAndHashCode.Include
	private UUID uuid;

	private String nome;

	@Lob
	@Type(type = "org.hibernate.type.BinaryType")
	private byte[] logo;

	@Column(length = 18)
	private String cnpj;

	@Column(length = 15)
	private String numero;

	@Column(name = "ativo")
	private Boolean ativo = true;

	@Column(name = "data_criacao")
	private LocalDateTime dataCriacao;

	public Organizacao() {
	}

	public Organizacao(String id, String nome) {
		if (id != null)
			this.uuid = UUID.fromString(id);
		this.nome = nome;
	}

	public byte[] getLogo() {
		return this.logo != null ? this.logo : LOGO_PADRAO;
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

}
