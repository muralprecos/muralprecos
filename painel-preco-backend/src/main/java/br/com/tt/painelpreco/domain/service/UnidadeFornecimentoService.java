package br.com.tt.painelpreco.domain.service;

import java.util.List;
import java.util.Set;

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
	
	public void save(UnidadeFornecimento unidadeFornecimento) {
		if (!unidadeFornecimentoRepository.existsByNome(unidadeFornecimento.getNome())) {
			unidadeFornecimentoRepository.save(unidadeFornecimento);
		}
	}

	public void saveAll(Set<UnidadeFornecimento> unidadesFornecimento) {
		List<UnidadeFornecimento> unidadesFornecimentoDB = unidadeFornecimentoRepository.findAll();
		unidadesFornecimentoDB.forEach(unidadeDB -> {
			if (unidadesFornecimento.contains(unidadeDB)) {
				unidadesFornecimento.remove(unidadeDB);
			}
		});
		
//		List<UnidadeFornecimento> unidadesFornecimentoUnique = unidadesFornecimento.stream().collect(Collectors.toList());
//		unidadesFornecimento.forEach(unidadeFornecimento -> {
//			if (unidadeFornecimentoRepository.existsByNome(unidadeFornecimento.getNome())) {
//				unidadesFornecimentoUnique.remove(unidadeFornecimento);
//			}
//		});
		
		unidadeFornecimentoRepository.saveAll(unidadesFornecimento);
	}

	public UnidadeFornecimento findByNome(String nome) {
		return unidadeFornecimentoRepository.findFirstByNome(nome);
	}

	public List<UnidadeFornecimento> findAll() {
		return unidadeFornecimentoRepository.findAll();
	}

}
