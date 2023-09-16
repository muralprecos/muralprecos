package br.com.tt.painelpreco.domain.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.tt.painelpreco.domain.model.Esfera;
import br.com.tt.painelpreco.domain.repository.EsferaRepository;

@Service
public class EsferaService {
	
	@Autowired
	private EsferaRepository esferaRepository;

	public List<Esfera> listaTodas() {
		return esferaRepository.findAll();
	}

}
