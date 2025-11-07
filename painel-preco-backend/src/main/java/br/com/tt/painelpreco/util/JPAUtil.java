package br.com.tt.painelpreco.util;

import java.util.Arrays;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;

public class JPAUtil {
	
	private static final Set<String> stopWords = new HashSet<>(Arrays.asList(
				"A", "À", "O", "E", "É", "DE", "DO", "DOS", "DA", "DAS", "EM", "UM", "UNS",
				"UMA", "UMAS", "OS", "AS", "ÀS", "POR", "PARA", "COM", "NÃO", "QUE", "SE",
				"NA", "NAS", "NO", "NOS"
			));
	
	public static String likeExpression(String keyword) {
		if (StringUtil.isEmpty(keyword))
			keyword = "";
		
		return StringUtil.aroundBy(keyword.toUpperCase(), "%");
	}
	
	public static String likeExpressionSplit(String keyword) {
		keyword = JPAUtil.likeExpression(keyword);
		
		List<String> expression = new LinkedList<>();
		String[] tokens = keyword.split(" ");
		for (int i = 0; i < tokens.length; i++) {
			String token = tokens[i];
			if (!stopWords.contains(token)) {
				expression.add(token);
				if (i + 1 < tokens.length) {
					expression.add("%");
				}
			}
		}
		keyword = "";
		for (String token : expression) {
			keyword += token;
		}
		
		return keyword;
	}

}
