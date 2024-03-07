package br.com.tt.painelpreco.domain.service;

import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import br.com.tt.painelpreco.domain.model.Cotacao;
import br.com.tt.painelpreco.domain.repository.CotacaoRepository;

@Service
public class CotacaoService {
	
	@Autowired
	private CotacaoRepository cotacaoRepository;
	
	public Cotacao save(Cotacao cotacao) {
		cotacao.setUuid(UUID.randomUUID());
		return cotacaoRepository.save(cotacao);
	}

	@Transactional
	public Cotacao findByHashValidacao(String hash) {
		return cotacaoRepository.findByHashValidacao(hash);
	}

	public Page<Cotacao> findAllSemArquivo(Pageable pageable) {
		return cotacaoRepository.findAllSemArquivo(pageable);
	}

	public Cotacao findByUuid(UUID uuid) {
		return cotacaoRepository.findByUuid(uuid);
	}

}
