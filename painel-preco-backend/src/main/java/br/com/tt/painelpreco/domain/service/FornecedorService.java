package br.com.tt.painelpreco.domain.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import br.com.tt.painelpreco.domain.model.Fornecedor;
import br.com.tt.painelpreco.domain.model.PorteFornecedor;
import br.com.tt.painelpreco.domain.repository.FornecedorRepository;

@Service
public class FornecedorService {
	
	@Autowired
	private FornecedorRepository fornecedorRepository;

	public Page<Fornecedor> listaTodos(Pageable pageable) {
		return fornecedorRepository.findAll(pageable);
	}
	
	public Page<Fornecedor> listaByFilter(Specification<Fornecedor> filtro, Pageable pageable) {
		return fornecedorRepository.findAll(filtro, pageable);
	}

	public Fornecedor findByDocumento(String documento) {
		return fornecedorRepository.findFirstByDocumento(documento);
	}

	public Fornecedor save(Fornecedor fornecedor) {
		return fornecedorRepository.save(fornecedor);
	}

	public Fornecedor findOrCreate(String documento, String nome, PorteFornecedor porte) {
		Fornecedor existente = fornecedorRepository.findFirstByDocumento(documento);
		if (existente != null) {
			return existente;
		}
		Fornecedor novo = new Fornecedor();
		novo.setDocumento(documento);
		novo.setNome(nome);
		novo.setPorte(porte);
		return fornecedorRepository.save(novo);
	}

}
