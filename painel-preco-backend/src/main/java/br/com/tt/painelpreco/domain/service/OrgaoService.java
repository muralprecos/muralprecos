package br.com.tt.painelpreco.domain.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import br.com.tt.painelpreco.domain.model.Orgao;
import br.com.tt.painelpreco.domain.repository.OrgaoRepository;

@Service
public class OrgaoService {
	
	@Autowired
	private OrgaoRepository orgaoRepository;

	public Page<Orgao> listaTodos(Pageable pageable) {
		return orgaoRepository.findAll(pageable);
	}
	
	public Page<Orgao> listaByFilter(Specification<Orgao> filtro, Pageable pageable) {
		return orgaoRepository.findAll(filtro, pageable);
	}
	
	public Page<Orgao> listaTodosSubOrgaos(UUID uuid, Pageable pageable) {
		return new PageImpl<Orgao>(orgaoRepository.findAllSubOrgaos(uuid, pageable));
	}
	
	public void save(Orgao orgao) {
		if (!orgaoRepository.existsByCnpj(orgao.getCnpj())) {
			//orgao.setEsfera(esferaRepository.findByCodigo(orgao.getEsfera().getCodigo()));
			orgaoRepository.save(orgao);
		}
	}

	public Orgao findByCnpj(String cnpj) {
		return orgaoRepository.findByCnpj(cnpj);
	}

	public List<Orgao> findAll() {
		return orgaoRepository.findAll();
	}

}
