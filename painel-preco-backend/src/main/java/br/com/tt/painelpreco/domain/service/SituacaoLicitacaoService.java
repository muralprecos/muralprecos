package br.com.tt.painelpreco.domain.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.tt.painelpreco.domain.model.UnidadeFederativa;
import br.com.tt.painelpreco.domain.repository.UnidadeFederativaRepository;

@Service
public class SituacaoLicitacaoService {
	
	@Autowired
	private UnidadeFederativaRepository unidadeFederativaRepository;

	public List<UnidadeFederativa> listaTodas() {
		return unidadeFederativaRepository.findAll();
	}

}
