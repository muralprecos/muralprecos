package br.com.tt.painelpreco.domain.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import br.com.tt.painelpreco.domain.model.LicitacaoObj;
import br.com.tt.painelpreco.domain.repository.LicitacaoObjRepository;
import br.com.tt.painelpreco.util.JPAUtil;

@Service
public class LicitacaoObjService {
	
	@Autowired
	private LicitacaoObjRepository licitacaoObjRepository;
	
	public Page<LicitacaoObj> listaByObjeto(String objeto, Pageable pageable) {
		return licitacaoObjRepository.findAllByObjeto(JPAUtil.likeExpression(objeto), pageable);
	}

}
