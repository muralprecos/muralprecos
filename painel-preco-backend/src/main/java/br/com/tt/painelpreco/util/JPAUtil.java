package br.com.tt.painelpreco.util;

public class JPAUtil {
	
	public static String likeExpression(String keyword) {
		if (StringUtil.isEmpty(keyword))
			keyword = "";
		
		return StringUtil.aroundBy(keyword.toUpperCase(), "%");
	}

}
