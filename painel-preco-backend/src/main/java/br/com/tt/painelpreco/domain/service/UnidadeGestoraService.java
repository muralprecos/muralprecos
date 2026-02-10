package br.com.tt.painelpreco.domain.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
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
	
	public Page<UnidadeGestora> listaByFilter(Specification<UnidadeGestora> filtro, Pageable pageable) {
		return unidadeGestoraRepository.findAll(filtro, pageable);
	}
	
	public void save(UnidadeGestora unidadeGestora) {
		if (!unidadeGestoraRepository.existsByCnpjAndCodigo(unidadeGestora.getCnpj(), unidadeGestora.getCodigo())) {
			unidadeGestoraRepository.save(unidadeGestora);
		}
	}

	public UnidadeGestora findByCnpjAndCodigo(String cnpj, String codigo) {
		return unidadeGestoraRepository.findByCnpjAndCodigo(cnpj, codigo);
	}

	public List<UnidadeGestora> findAll() {
		return unidadeGestoraRepository.findAll();
	}

}
