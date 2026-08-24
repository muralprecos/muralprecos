package br.com.tt.painelpreco.domain.repository;

import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import br.com.tt.painelpreco.arch.infra.auth.Usuario;
import br.com.tt.painelpreco.domain.model.ProcessoContratacao;

public interface ProcessoContratacaoRepository extends JpaRepository<ProcessoContratacao, Integer> {

	@Transactional
	ProcessoContratacao findByUuid(UUID uuid);

	Page<ProcessoContratacao> findByCriadoPorOrderByCriadoEmDesc(Usuario criadoPor, Pageable pageable);

}
