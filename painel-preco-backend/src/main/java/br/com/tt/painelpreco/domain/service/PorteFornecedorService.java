package br.com.tt.painelpreco.domain.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.tt.painelpreco.domain.model.PorteFornecedor;
import br.com.tt.painelpreco.domain.repository.PorteFornecedorRepository;

@Service
public class PorteFornecedorService {
	
	@Autowired
	private PorteFornecedorRepository porteFornecedorRepository;

	public List<PorteFornecedor> listaTodos() {
		return porteFornecedorRepository.findAll();
	}

}
