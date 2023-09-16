package br.com.tt.painelpreco.domain.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.tt.painelpreco.domain.model.FormaCompra;
import br.com.tt.painelpreco.domain.repository.FormaCompraRepository;

@Service
public class FormaCompraService {
	
	@Autowired
	private FormaCompraRepository formaCompraRepository;

	public List<FormaCompra> listaTodas() {
		return formaCompraRepository.findAll();
	}

}
