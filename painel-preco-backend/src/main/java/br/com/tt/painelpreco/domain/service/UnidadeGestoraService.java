package br.com.tt.painelpreco.domain.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import br.com.tt.painelpreco.domain.model.UnidadeGestora;
import br.com.tt.painelpreco.domain.repository.UnidadeGestoraRepository;

@Service
public class UnidadeGestoraService {
	
	@Autowired
	private UnidadeGestoraRepository unidadeGestoraRepository;

	public Page<UnidadeGestora> listaTodas(Pageable pageable) {
		return unidadeGestoraRepository.findAll(pageable);
	}

}
