package br.com.tt.painelpreco.domain.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import br.com.tt.painelpreco.domain.model.Municipio;
import br.com.tt.painelpreco.domain.repository.MunicipioRepository;

@Service
public class MunicipioService {
	
	@Autowired
	private MunicipioRepository municipioRepository;

	public Page<Municipio> listaTodosByUf(UUID uuid, Pageable pageable) {
		return municipioRepository.findAllByUF(uuid, pageable);
	}

}
