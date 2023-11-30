package br.com.tt.painelpreco.domain.service;

import java.math.BigDecimal;
import java.util.List;

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

}
