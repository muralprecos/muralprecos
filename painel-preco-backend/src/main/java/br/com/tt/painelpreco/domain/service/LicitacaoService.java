package br.com.tt.painelpreco.domain.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import br.com.tt.painelpreco.domain.model.Licitacao;
import br.com.tt.painelpreco.domain.repository.LicitacaoRepository;
import br.com.tt.painelpreco.util.JPAUtil;

@Service
public class LicitacaoService {
	
	@Autowired
	private LicitacaoRepository licitacaoRepository;

	public Page<Licitacao> listaTodas(Pageable pageable) {
		return licitacaoRepository.findAll(pageable);
	}

	public Page<Licitacao> listaByFilter(Specification<Licitacao> filtro, Pageable pageable) {
		return licitacaoRepository.findAll(filtro, pageable);
	}
	
	public Page<BigDecimal> listaAllAnos(String ano, Pageable pageable) {
		return licitacaoRepository.findAllAnos(JPAUtil.likeExpression(ano), pageable);
	}
	
	public List<Integer> listaAllAnos() {
		return licitacaoRepository.findAllAnos();
	}
	
	public void save(Licitacao licitacao) {
		if (!licitacaoRepository.existsByNumeroPncp(licitacao.getNumeroPncp())) {
			licitacaoRepository.save(licitacao);
		}
	}

	public void saveAll(Collection<Licitacao> licitacoes) {
		licitacaoRepository.saveAll(licitacoes);
	}

	public List<Licitacao> findAllByNumeroPncpIn(List<String> numerosPncp) {
		if (numerosPncp == null)
			return new ArrayList<Licitacao>();
		
		return licitacaoRepository.findAllByNumeroPncpIn(numerosPncp.toArray(new String[0]));
	}

}
