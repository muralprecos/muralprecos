package br.com.tt.painelpreco.domain.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.tt.painelpreco.domain.model.SituacaoLicitacao;
import br.com.tt.painelpreco.domain.repository.SituacaoLicitacaoRepository;

@Service
public class SituacaoLicitacaoService {
	
	@Autowired
	private SituacaoLicitacaoRepository situacaoLicitacaoRepository;

	public List<SituacaoLicitacao> listaTodas() {
		return situacaoLicitacaoRepository.findAll();
	}
	
	public void save(SituacaoLicitacao situacaoLicitacao) {
		if (!situacaoLicitacaoRepository.existsById(situacaoLicitacao.getId())) {
			situacaoLicitacaoRepository.save(situacaoLicitacao);
		}
	}

	public SituacaoLicitacao findById(Integer id) {
		return situacaoLicitacaoRepository.findById(id).orElse(null);
	}

	public List<SituacaoLicitacao> findAll() {
		return situacaoLicitacaoRepository.findAll();
	}

}
