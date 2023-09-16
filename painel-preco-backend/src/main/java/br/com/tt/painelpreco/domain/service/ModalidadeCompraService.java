package br.com.tt.painelpreco.domain.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.tt.painelpreco.domain.model.ModalidadeCompra;
import br.com.tt.painelpreco.domain.repository.ModalidadeCompraRepository;

@Service
public class ModalidadeCompraService {
	
	@Autowired
	private ModalidadeCompraRepository modalidadeCompraRepository;

	public List<ModalidadeCompra> listaTodas() {
		return modalidadeCompraRepository.findAll();
	}

}
