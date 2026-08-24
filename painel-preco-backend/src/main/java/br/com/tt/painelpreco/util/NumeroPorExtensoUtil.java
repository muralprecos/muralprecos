package br.com.tt.painelpreco.util;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Conversão determinística de valores monetários para extenso em PT-BR
 * (ex.: R$ 1.234,56 -&gt; "hum mil, duzentos e trinta e quatro reais e
 * cinquenta e seis centavos"). Nunca gerado por IA: valor monetário em
 * documento auditável não pode carregar ambiguidade de modelo de linguagem.
 */
public final class NumeroPorExtensoUtil {

	private static final String[] UNIDADES = {
			"", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove"
	};

	private static final String[] DEZ_A_DEZENOVE = {
			"dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"
	};

	private static final String[] DEZENAS = {
			"", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"
	};

	private static final String[] CENTENAS = {
			"", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos",
			"seiscentos", "setecentos", "oitocentos", "novecentos"
	};

	private static final String[][] ESCALA = {
			{ "", "" },
			{ "mil", "mil" },
			{ "milhão", "milhões" },
			{ "bilhão", "bilhões" },
			{ "trilhão", "trilhões" },
	};

	private NumeroPorExtensoUtil() {
	}

	public static String porExtensoReais(BigDecimal valor) {
		if (valor == null) {
			return "";
		}
		BigDecimal absoluto = valor.abs().setScale(2, RoundingMode.HALF_UP);
		long reais = absoluto.longValue();
		int centavos = absoluto.subtract(BigDecimal.valueOf(reais)).movePointRight(2)
				.setScale(0, RoundingMode.HALF_UP).intValue();

		StringBuilder sb = new StringBuilder();
		if (valor.signum() < 0) {
			sb.append("menos ");
		}

		if (reais == 0 && centavos == 0) {
			return "zero reais";
		}

		if (reais > 0) {
			sb.append(extensoInteiro(reais));
			sb.append(reais == 1 ? " real" : " reais");
		}

		if (centavos > 0) {
			if (reais > 0) {
				sb.append(" e ");
			}
			sb.append(extensoInteiro(centavos));
			sb.append(centavos == 1 ? " centavo" : " centavos");
		}

		return sb.toString();
	}

	private static String extensoInteiro(long numero) {
		if (numero == 0) {
			return "zero";
		}

		StringBuilder resultado = new StringBuilder();
		String numeroStr = Long.toString(numero);
		int grupos = (int) Math.ceil(numeroStr.length() / 3.0);
		int[] blocos = new int[grupos];
		for (int i = 0; i < grupos; i++) {
			int fim = numeroStr.length() - i * 3;
			int inicio = Math.max(0, fim - 3);
			blocos[i] = Integer.parseInt(numeroStr.substring(inicio, fim));
		}

		for (int i = grupos - 1; i >= 0; i--) {
			int bloco = blocos[i];
			if (bloco == 0) {
				continue;
			}
			String extensoBloco = extensoAteNoveCentosNoventaENove(bloco);
			if (i == 1 && bloco == 1) {
				extensoBloco = "";
			}
			resultado.append(extensoBloco);
			if (i > 0) {
				resultado.append(" ").append(bloco == 1 ? ESCALA[i][0] : ESCALA[i][1]);
			}
			if (i > 0) {
				resultado.append(precisaVirgulaOuE(blocos, i));
			}
		}

		return resultado.toString().replaceAll("\\s+", " ").trim().replaceAll("\\s+,", ",");
	}

	/** Decide se deve inserir ", " ou " e " entre o bloco atual e o próximo (convenção PT-BR). */
	private static String precisaVirgulaOuE(int[] blocos, int indiceAtual) {
		boolean restanteTemValor = false;
		for (int i = indiceAtual - 1; i >= 0; i--) {
			if (blocos[i] != 0) {
				restanteTemValor = true;
				break;
			}
		}
		if (!restanteTemValor) {
			return "";
		}
		int proximoBloco = blocos[indiceAtual - 1];
		// "e" quando o último bloco é < 100 e não é múltiplo de 100 isolado (regra simplificada e comum em geradores PT-BR)
		if (indiceAtual == 1 && proximoBloco > 0 && proximoBloco < 100) {
			return " e";
		}
		return ", ";
	}

	private static String extensoAteNoveCentosNoventaENove(int numero) {
		if (numero == 100) {
			return "cem";
		}
		StringBuilder sb = new StringBuilder();
		int centena = numero / 100;
		int resto = numero % 100;

		if (centena > 0) {
			sb.append(CENTENAS[centena]);
		}

		if (resto > 0) {
			if (centena > 0) {
				sb.append(" e ");
			}
			if (resto < 10) {
				sb.append(UNIDADES[resto]);
			} else if (resto < 20) {
				sb.append(DEZ_A_DEZENOVE[resto - 10]);
			} else {
				int dezena = resto / 10;
				int unidade = resto % 10;
				sb.append(DEZENAS[dezena]);
				if (unidade > 0) {
					sb.append(" e ").append(UNIDADES[unidade]);
				}
			}
		}

		return sb.toString();
	}

}
