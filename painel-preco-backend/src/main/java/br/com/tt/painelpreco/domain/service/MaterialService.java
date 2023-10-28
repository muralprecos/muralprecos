package br.com.tt.painelpreco.domain.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import br.com.tt.painelpreco.domain.model.Material;
import br.com.tt.painelpreco.domain.repository.MaterialRepository;

@Service
public class MaterialService {
	
	@Autowired
	private MaterialRepository materialRepository;

	public Page<Material> listaTodos(Pageable pageable) {
		return materialRepository.findAll(pageable);
	}
	
	public Page<Material> listaByFilter(Specification<Material> filtro, Pageable pageable) {
		return materialRepository.findAll(filtro, pageable);
	}

}
