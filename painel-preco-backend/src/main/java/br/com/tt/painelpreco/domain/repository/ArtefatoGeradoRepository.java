package br.com.tt.painelpreco.domain.repository;

import java.util.List;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.tt.painelpreco.domain.model.ArtefatoGerado;
import br.com.tt.painelpreco.domain.model.ArtefatoGerado.TipoEnum;
import br.com.tt.painelpreco.domain.model.ProcessoContratacao;

public interface ArtefatoGeradoRepository extends JpaRepository<ArtefatoGerado, Integer> {

	@Transactional
	List<ArtefatoGerado> findByProcessoContratacaoAndTipoOrderByVersaoDesc(ProcessoContratacao processoContratacao, TipoEnum tipo);

	@Transactional
	ArtefatoGerado findFirstByProcessoContratacaoAndTipoOrderByVersaoDesc(ProcessoContratacao processoContratacao, TipoEnum tipo);

	@Transactional
	ArtefatoGerado findByProcessoContratacaoAndTipoAndVersao(ProcessoContratacao processoContratacao, TipoEnum tipo, Integer versao);

	@Transactional
	ArtefatoGerado findByUuid(UUID uuid);

	@Transactional
	List<ArtefatoGerado> findByProcessoContratacao(ProcessoContratacao processoContratacao);

}
