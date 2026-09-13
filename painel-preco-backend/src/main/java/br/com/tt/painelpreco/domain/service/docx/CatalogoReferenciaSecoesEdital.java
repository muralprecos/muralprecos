package br.com.tt.painelpreco.domain.service.docx;

import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.tt.painelpreco.arch.exception.ArchException;

/**
 * Trechos de apoio extraídos do modelo oficial da AGU para o Edital (mesmo
 * mecanismo de {@link CatalogoReferenciaSecoesTR}, ver ali para detalhes).
 */
@Component
public class CatalogoReferenciaSecoesEdital {

	private static final String ARQUIVO = "templates/agu/referencia-secoes-edital.json";

	private final Map<String, Map<String, String>> catalogo;

	public CatalogoReferenciaSecoesEdital(ObjectMapper mapper) {
		try (InputStream is = new ClassPathResource(ARQUIVO).getInputStream()) {
			this.catalogo = mapper.readValue(is, new TypeReference<Map<String, Map<String, String>>>() {
			});
		} catch (IOException e) {
			throw new ArchException("Falha ao carregar a referência de seções do Edital: " + e.getMessage(), e);
		}
	}

	public String referenciaDe(String chaveSecao) {
		Map<String, String> secao = catalogo.get(chaveSecao);
		return secao == null ? "" : secao.getOrDefault("referencia", "");
	}

}
