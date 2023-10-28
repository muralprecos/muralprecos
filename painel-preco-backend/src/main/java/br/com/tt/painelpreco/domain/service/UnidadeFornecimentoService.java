package br.com.tt.painelpreco.domain.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import br.com.tt.painelpreco.domain.model.UnidadeFornecimento;
import br.com.tt.painelpreco.domain.repository.UnidadeFornecimentoRepository;

@Service
public class UnidadeFornecimentoService {
	
	@Autowired
	private UnidadeFornecimentoRepository unidadeFornecimentoRepository;

	public Page<UnidadeFornecimento> listaTodos(Pageable pageable) {
		return unidadeFornecimentoRepository.findAll(pageable);
	}
	
	public Page<UnidadeFornecimento> listaByFilter(Specification<UnidadeFornecimento> filtro, Pageable pageable) {
		return unidadeFornecimentoRepository.findAll(filtro, pageable);
	}

}
