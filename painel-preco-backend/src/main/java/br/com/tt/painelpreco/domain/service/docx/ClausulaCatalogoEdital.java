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
 * Catálogo das alternativas "OU" pré-aprovadas pela AGU no Edital, extraídas
 * manualmente do modelo oficial (ver {@code templates/agu/README.md}). A IA
 * só ESCOLHE um destes textos literais — nunca redige um novo.
 */
@Component
public class ClausulaCatalogoEdital {

	private static final String ARQUIVO = "templates/agu/clausulas-edital.json";

	private final Map<String, Map<String, String>> catalogo;

	public ClausulaCatalogoEdital(ObjectMapper mapper) {
		try (InputStream is = new ClassPathResource(ARQUIVO).getInputStream()) {
			this.catalogo = mapper.readValue(is, new TypeReference<Map<String, Map<String, String>>>() {
			});
		} catch (IOException e) {
			throw new ArchException("Falha ao carregar o catálogo de cláusulas do Edital: " + e.getMessage(), e);
		}
	}

	public Map<String, String> opcoesDe(String chaveClausula) {
		Map<String, String> opcoes = catalogo.get(chaveClausula);
		if (opcoes == null) {
			throw new ArchException("Chave de cláusula desconhecida no catálogo: " + chaveClausula);
		}
		return opcoes;
	}

	public String textoDe(String chaveClausula, String opcaoId) {
		String texto = opcoesDe(chaveClausula).get(opcaoId);
		if (texto == null) {
			throw new ArchException("Opção '" + opcaoId + "' não existe para a cláusula " + chaveClausula);
		}
		return texto;
	}

}
