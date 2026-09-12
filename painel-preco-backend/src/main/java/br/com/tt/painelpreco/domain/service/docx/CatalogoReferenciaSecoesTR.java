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
 * Trechos de apoio extraídos do modelo oficial da AGU para o Termo de
 * Referência (gerado uma vez por script, ver {@code templates/agu/README.md}),
 * já sem os blocos de alternativas "OU"/"Opcional" do modelo. Serve como
 * contexto de terminologia/estrutura para a redação por IA de cada seção
 * ({@link DocxSecaoDraftService}) — nunca é copiado literalmente para o
 * documento final.
 */
@Component
public class CatalogoReferenciaSecoesTR {

	private static final String ARQUIVO = "templates/agu/referencia-secoes-tr.json";

	private final Map<String, Map<String, String>> catalogo;

	public CatalogoReferenciaSecoesTR(ObjectMapper mapper) {
		try (InputStream is = new ClassPathResource(ARQUIVO).getInputStream()) {
			this.catalogo = mapper.readValue(is, new TypeReference<Map<String, Map<String, String>>>() {
			});
		} catch (IOException e) {
			throw new ArchException("Falha ao carregar a referência de seções do TR: " + e.getMessage(), e);
		}
	}

	/** @return o trecho de referência da AGU para a chave, ou string vazia se a seção não tiver referência (ex.: seção 100% resolvida por cláusula/fato). */
	public String referenciaDe(String chaveSecao) {
		Map<String, String> secao = catalogo.get(chaveSecao);
		return secao == null ? "" : secao.getOrDefault("referencia", "");
	}

}
