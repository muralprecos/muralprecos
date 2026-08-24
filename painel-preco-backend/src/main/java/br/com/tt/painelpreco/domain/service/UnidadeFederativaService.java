package br.com.tt.painelpreco.domain.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.tt.painelpreco.domain.model.UnidadeFederativa;
import br.com.tt.painelpreco.domain.repository.UnidadeFederativaRepository;

@Service
public class UnidadeFederativaService {
	
	@Autowired
	private UnidadeFederativaRepository unidadeFederativaRepository;

	public List<UnidadeFederativa> listaTodas() {
		return unidadeFederativaRepository.findAllByOrderByNome();
	}
	
	public void save(UnidadeFederativa unidadeFederativa) {
		if (!unidadeFederativaRepository.existsBySigla(unidadeFederativa.getSigla())) {
			unidadeFederativaRepository.save(unidadeFederativa);
		}
	}
	
	public List<UnidadeFederativa> findAll() {
		return unidadeFederativaRepository.findAll();
	}

	private final Map<String, Integer[]> cacheIdsRegiao = new java.util.concurrent.ConcurrentHashMap<>();

	private static final Map<String, List<String>> SIGLAS_POR_REGIAO = Map.of(
			"norte", List.of("AC", "AP", "AM", "PA", "RO", "RR", "TO"),
			"nordeste", List.of("AL", "BA", "CE", "MA", "PB", "PE", "PI", "RN", "SE"),
			"centro-oeste", List.of("GO", "MT", "MS", "DF"),
			"sudeste", List.of("ES", "MG", "RJ", "SP"),
			"sul", List.of("PR", "RS", "SC")
	);

	public Integer[] getIdsUFsPorRegiao(String regiao) {
		if (regiao == null) return new Integer[0];
		
		return cacheIdsRegiao.computeIfAbsent(regiao.toLowerCase(), r -> {
			List<String> siglas = SIGLAS_POR_REGIAO.get(r);
			if (siglas == null || siglas.isEmpty()) return new Integer[0];
			
			return findAll().stream()
					.filter(uf -> siglas.contains(uf.getSigla()))
					.map(UnidadeFederativa::getId)
					.toArray(Integer[]::new);
		});
	}

}
