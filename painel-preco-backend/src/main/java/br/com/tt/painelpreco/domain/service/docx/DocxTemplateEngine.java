package br.com.tt.painelpreco.domain.service.docx;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.apache.poi.xwpf.usermodel.XWPFTable;
import org.apache.poi.xwpf.usermodel.XWPFTableCell;
import org.apache.poi.xwpf.usermodel.XWPFTableRow;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.CTRow;
import org.springframework.stereotype.Component;

/**
 * Motor de preenchimento de templates .docx por substituição de texto
 * (tokens {{FACTS:CHAVE}} / {{CLAUSE:CHAVE}}) e clonagem de linha de tabela.
 *
 * Contorna o problema conhecido do Apache POI de o Word dividir o texto de um
 * mesmo trecho visual em múltiplos &lt;w:r&gt; (runs): a busca por token usa
 * {@link XWPFParagraph#getText()} (que já concatena todos os runs, ignorando
 * o limite entre eles); ao encontrar um token, o parágrafo inteiro tem seus
 * runs removidos e substituídos por um único run novo com o texto final,
 * reaplicando a formatação (negrito, itálico, fonte, tamanho, cor) do
 * primeiro run original — garante substituição correta independentemente de
 * como o Word fragmentou o texto internamente.
 */
@Component
public class DocxTemplateEngine {

	/** Substitui todos os tokens encontrados em parágrafos do corpo e em células de tabela. */
	public void substituirEmDocumento(Iterable<XWPFParagraph> paragrafos, Iterable<XWPFTable> tabelas,
			Map<String, String> substituicoes) {
		for (XWPFParagraph paragrafo : paragrafos) {
			substituirEmParagrafo(paragrafo, substituicoes);
		}
		for (XWPFTable tabela : tabelas) {
			substituirEmTabela(tabela, substituicoes);
		}
	}

	public void substituirEmTabela(XWPFTable tabela, Map<String, String> substituicoes) {
		for (XWPFTableRow linha : tabela.getRows()) {
			for (XWPFTableCell celula : linha.getTableCells()) {
				for (XWPFParagraph paragrafo : celula.getParagraphs()) {
					substituirEmParagrafo(paragrafo, substituicoes);
				}
				for (XWPFTable aninhada : celula.getTables()) {
					substituirEmTabela(aninhada, substituicoes);
				}
			}
		}
	}

	/** @return true se algum token foi substituído neste parágrafo. */
	public boolean substituirEmParagrafo(XWPFParagraph paragrafo, Map<String, String> substituicoes) {
		String textoOriginal = paragrafo.getText();
		if (textoOriginal == null || textoOriginal.isEmpty()) {
			return false;
		}

		String textoFinal = textoOriginal;
		boolean alterado = false;
		for (Map.Entry<String, String> entrada : substituicoes.entrySet()) {
			if (textoFinal.contains(entrada.getKey())) {
				textoFinal = textoFinal.replace(entrada.getKey(), entrada.getValue() == null ? "" : entrada.getValue());
				alterado = true;
			}
		}

		if (!alterado) {
			return false;
		}

		substituirTextoDoParagrafo(paragrafo, textoFinal);
		return true;
	}

	/**
	 * Remove todos os runs do parágrafo e insere um único run com o texto
	 * final, reaplicando a formatação do primeiro run original.
	 */
	public void substituirTextoDoParagrafo(XWPFParagraph paragrafo, String novoTexto) {
		// Captura a formatação ANTES de remover o run — depois de removido, o
		// objeto XML subjacente fica órfão e qualquer leitura (isBold(),
		// getFontFamily() etc.) lança XmlValueDisconnectedException.
		FormatacaoRun formatacao = paragrafo.getRuns().isEmpty() ? null
				: FormatacaoRun.capturar(paragrafo.getRuns().get(0));

		for (int i = paragrafo.getRuns().size() - 1; i >= 0; i--) {
			paragrafo.removeRun(i);
		}

		XWPFRun novoRun = paragrafo.createRun();
		if (formatacao != null) {
			formatacao.aplicar(novoRun);
		}

		String[] linhas = novoTexto.split("\n", -1);
		for (int i = 0; i < linhas.length; i++) {
			if (i > 0) {
				novoRun.addBreak();
			}
			novoRun.setText(linhas[i]);
		}
	}

	/** Snapshot da formatação de um run, capturado antes de o run original ser removido. */
	private static final class FormatacaoRun {
		private final boolean bold;
		private final boolean italic;
		private final String fontFamily;
		private final int fontSize;
		private final String color;
		private final org.apache.poi.xwpf.usermodel.UnderlinePatterns underline;

		private FormatacaoRun(boolean bold, boolean italic, String fontFamily, int fontSize, String color,
				org.apache.poi.xwpf.usermodel.UnderlinePatterns underline) {
			this.bold = bold;
			this.italic = italic;
			this.fontFamily = fontFamily;
			this.fontSize = fontSize;
			this.color = color;
			this.underline = underline;
		}

		static FormatacaoRun capturar(XWPFRun run) {
			return new FormatacaoRun(run.isBold(), run.isItalic(), run.getFontFamily(), run.getFontSize(),
					run.getColor(), run.getUnderline());
		}

		void aplicar(XWPFRun destino) {
			destino.setBold(bold);
			destino.setItalic(italic);
			if (fontFamily != null) {
				destino.setFontFamily(fontFamily);
			}
			if (fontSize != -1) {
				destino.setFontSize(fontSize);
			}
			if (color != null) {
				destino.setColor(color);
			}
			destino.setUnderline(underline);
		}
	}

	/**
	 * Localiza a linha da tabela que contém o marcador informado (ex.:
	 * "{{FACTS:ITEM_NUMERO}}"), clona-a uma vez para cada elemento de
	 * {@code linhasDeDados} (preservando os tokens em cada cópia) e em
	 * seguida preenche cada cópia com os valores da respectiva linha de
	 * dados. Se o marcador não for encontrado, não faz nada (o template não
	 * tem essa tabela ou já foi processado).
	 */
	public void preencherTabelaRepetida(XWPFTable tabela, String marcadorLinha, List<Map<String, String>> linhasDeDados) {
		if (linhasDeDados.isEmpty()) {
			return;
		}

		int indiceModelo = localizarLinhaComMarcador(tabela, marcadorLinha);
		if (indiceModelo < 0) {
			return;
		}

		XWPFTableRow linhaModelo = tabela.getRow(indiceModelo);

		// Clona a linha-modelo (N-1) vezes ANTES de preencher qualquer uma —
		// assim cada clone ainda carrega os tokens originais intactos, e não
		// os valores já preenchidos de uma linha anterior.
		List<XWPFTableRow> clones = new ArrayList<>();
		for (int i = 1; i < linhasDeDados.size(); i++) {
			clones.add(clonarLinha(tabela, linhaModelo, indiceModelo + i));
		}

		substituirEmTabelaLinha(linhaModelo, linhasDeDados.get(0));
		for (int i = 0; i < clones.size(); i++) {
			substituirEmTabelaLinha(clones.get(i), linhasDeDados.get(i + 1));
		}
	}

	private void substituirEmTabelaLinha(XWPFTableRow linha, Map<String, String> substituicoes) {
		for (XWPFTableCell celula : linha.getTableCells()) {
			for (XWPFParagraph paragrafo : celula.getParagraphs()) {
				substituirEmParagrafo(paragrafo, substituicoes);
			}
		}
	}

	private int localizarLinhaComMarcador(XWPFTable tabela, String marcador) {
		for (int i = 0; i < tabela.getRows().size(); i++) {
			XWPFTableRow linha = tabela.getRow(i);
			for (XWPFTableCell celula : linha.getTableCells()) {
				if (celula.getText() != null && celula.getText().contains(marcador)) {
					return i;
				}
			}
		}
		return -1;
	}

	/**
	 * Clona uma linha de tabela para a posição indicada. Não usa
	 * {@link XWPFTable#addRow(XWPFTableRow, int)}: esse método copia o
	 * conteúdo para dentro do elemento vivo da árvore via
	 * {@code CTTbl.setTrArray}, mas mantém o objeto {@link XWPFTableRow}
	 * retornado apontando para o {@link CTRow} órfão original — qualquer
	 * edição feita depois nesse objeto não apareceria no documento final.
	 * Em vez disso, usamos diretamente o elemento retornado por
	 * {@code insertNewTr}, que é o nó realmente vivo na árvore.
	 *
	 * Nota: isso não atualiza a lista interna {@code XWPFTable#tableRows}
	 * (que é imutável do lado de fora) — por isso, após chamar este método,
	 * o preenchimento da linha clonada deve ser feito através do objeto
	 * retornado aqui, nunca via {@code tabela.getRow(posicaoDestino)}.
	 */
	private XWPFTableRow clonarLinha(XWPFTable tabela, XWPFTableRow linhaOrigem, int posicaoDestino) {
		CTRow linhaViva = tabela.getCTTbl().insertNewTr(posicaoDestino);
		linhaViva.set(linhaOrigem.getCtRow().copy());
		return new XWPFTableRow(linhaViva, tabela);
	}

	// ── Sinalização de lacunas não resolvidas pelo template ────────────────────

	/**
	 * Padrões de lacuna que os modelos AGU deixam para preenchimento manual e que
	 * NÃO são cobertos pelo sistema de tokens {@code {{FACTS:*}}}/{@code {{CLAUSE:*}}}
	 * (percentuais de multa/garantia, prazos em dias/meses, índices de reajuste etc. —
	 * são decisões jurídicas/administrativas específicas de cada contratação, que o
	 * sistema não conhece e não deve adivinhar). Em vez de deixar o texto cru
	 * ("XX% (xxxxx por cento)", "XX (xxxxx) dias") ou uma instrução de colchete
	 * discreta ("[indicar o índice]"), sinaliza com "⚠" para ficar visualmente
	 * inequívoco que é um ponto de decisão pendente, não um erro de geração.
	 *
	 * NÃO mexe em sequências de sublinhado ("____"): são linhas de assinatura em
	 * branco, propositalmente vazias, não lacunas de dado.
	 */
	private static final List<Pattern> PADROES_LACUNA = List.of(
			// "XX% (xxxxx por cento)" — percentual não definido
			Pattern.compile("X{1,3}%\\s*\\(x{3,7}\\s*por\\s*cento\\)", Pattern.CASE_INSENSITIVE),
			// "XX (xxxxx) dias/meses/dias úteis" — prazo não definido
			Pattern.compile("X{1,4}\\s*\\(x{3,7}\\)\\s*(dias\\s*úteis|dias|meses)", Pattern.CASE_INSENSITIVE),
			// Sequência solta de 3+ "X" fora dos padrões acima (ex.: "prazo de XXXXXXX",
			// "processo nº xxxxx.xxxxxx/xxxx-xx" — case-insensitive: o modelo usa tanto
			// maiúsculo quanto minúsculo para essa convenção de lacuna). \b nos dois lados
			// evita falso positivo em algarismo romano legítimo citado em lei (ex.: "inciso
			// XXXIII" não deve virar "⚠ XXXIII" — sem \b final, "XXX" casaria dentro dele).
			Pattern.compile("\\bX{3,}\\b", Pattern.CASE_INSENSITIVE),
			// Instruções entre colchetes do próprio modelo AGU (convenção do modelo para
			// "escolher"/"preencher"): preserva o texto original, só adiciona o sinalizador.
			Pattern.compile("\\[[^\\[\\]\\{\\}]{1,300}\\]")
	);

	/** Sinaliza, em todos os parágrafos do corpo e das tabelas, as lacunas pendentes do template. */
	public void sinalizarLacunasPendentes(Iterable<XWPFParagraph> paragrafos, Iterable<XWPFTable> tabelas) {
		for (XWPFParagraph paragrafo : paragrafos) {
			sinalizarLacunasNoParagrafo(paragrafo);
		}
		for (XWPFTable tabela : tabelas) {
			for (XWPFTableRow linha : tabela.getRows()) {
				for (XWPFTableCell celula : linha.getTableCells()) {
					for (XWPFParagraph paragrafo : celula.getParagraphs()) {
						sinalizarLacunasNoParagrafo(paragrafo);
					}
					for (XWPFTable aninhada : celula.getTables()) {
						sinalizarLacunasPendentes(List.of(), List.of(aninhada));
					}
				}
			}
		}
	}

	private void sinalizarLacunasNoParagrafo(XWPFParagraph paragrafo) {
		String textoOriginal = paragrafo.getText();
		if (textoOriginal == null || textoOriginal.isEmpty()) {
			return;
		}

		String textoFinal = textoOriginal;
		for (Pattern padrao : PADROES_LACUNA) {
			Matcher matcher = padrao.matcher(textoFinal);
			StringBuilder saida = new StringBuilder();
			int fimAnterior = 0;
			while (matcher.find()) {
				saida.append(textoFinal, fimAnterior, matcher.start());
				saida.append("⚠ ").append(matcher.group());
				fimAnterior = matcher.end();
			}
			saida.append(textoFinal.substring(fimAnterior));
			textoFinal = saida.toString();
		}

		if (!textoFinal.equals(textoOriginal)) {
			substituirTextoDoParagrafo(paragrafo, textoFinal);
		}
	}

	// ── Remoção de comentários do Word ──────────────────────────────────────────

	// Partes descartadas: os comments*.xml em si, o _rels próprio deles (word/_rels/comments*.xml.rels),
	// e people.xml (lista de autores de comentário — sem uso depois de remover os comentários).
	private static final Pattern COMMENT_PART = Pattern.compile("^word/(_rels/)?comments[^/]*\\.xml(\\.rels)?$");
	private static final Pattern COMMENT_MARKUP = Pattern.compile(
			"<w:comment(RangeStart|RangeEnd|Reference)\\b[^>]*/>");
	private static final Pattern COMMENT_CONTENT_TYPE_OVERRIDE = Pattern.compile(
			"<Override[^>]*PartName=\"/word/(comments[^\"]*|people\\.xml)\"[^>]*/>");
	// Relacionamentos a limpar de word/_rels/document.xml.rels: os que apontam pra comments*.xml
	// (Target="comments.xml" etc.) e o que aponta pra people.xml (parte também descartada).
	private static final Pattern COMMENT_RELATIONSHIP = Pattern.compile(
			"<Relationship[^>]*Target=\"(comments[^\"]*|people\\.xml)\"[^>]*/>");

	/**
	 * Remove os comentários de revisão do Word (bolhas de anotação) de um .docx já
	 * serializado — o modelo AGU do TR/Edital tem dezenas de comentários de
	 * orientação de uso ("ORIENTAÇÕES PARA USO DO MODELO...") que o Apache POI
	 * preserva ao reescrever o documento (não são tocados pela substituição de
	 * texto), e sobrevivem visíveis no arquivo final entregue ao usuário.
	 *
	 * Opera diretamente no ZIP do .docx (em vez da API de comentários do POI):
	 * descarta as partes {@code word/comments*.xml}, remove as referências a elas
	 * em {@code [Content_Types].xml} e {@code word/_rels/document.xml.rels}, e
	 * apaga as marcações {@code <w:commentRangeStart|End|Reference>} de
	 * {@code word/document.xml} (são elementos vazios que só marcam onde um
	 * comentário se ancora — removê-los não altera nenhum texto visível).
	 */
	public byte[] removerComentarios(byte[] docx) {
		try (ZipInputStream zin = new ZipInputStream(new java.io.ByteArrayInputStream(docx));
				ByteArrayOutputStream bos = new ByteArrayOutputStream();
				ZipOutputStream zout = new ZipOutputStream(bos)) {

			ZipEntry entrada;
			while ((entrada = zin.getNextEntry()) != null) {
				String nome = entrada.getName();
				if (COMMENT_PART.matcher(nome).matches() || nome.equals("word/people.xml")) {
					continue; // descarta a parte de comentários (e a lista de autores, sem uso sem comentários)
				}

				byte[] conteudo = zin.readAllBytes();

				if (nome.equals("[Content_Types].xml") || nome.equals("word/_rels/document.xml.rels")) {
					String xml = new String(conteudo, StandardCharsets.UTF_8);
					Pattern padrao = nome.startsWith("word/_rels") ? COMMENT_RELATIONSHIP : COMMENT_CONTENT_TYPE_OVERRIDE;
					xml = padrao.matcher(xml).replaceAll("");
					conteudo = xml.getBytes(StandardCharsets.UTF_8);
				} else if (nome.equals("word/document.xml")) {
					String xml = new String(conteudo, StandardCharsets.UTF_8);
					xml = COMMENT_MARKUP.matcher(xml).replaceAll("");
					conteudo = xml.getBytes(StandardCharsets.UTF_8);
				}

				zout.putNextEntry(new ZipEntry(nome));
				zout.write(conteudo);
				zout.closeEntry();
			}

			zout.finish();
			return bos.toByteArray();
		} catch (IOException e) {
			throw new UncheckedIOException("Falha ao remover comentários do .docx gerado", e);
		}
	}

}
