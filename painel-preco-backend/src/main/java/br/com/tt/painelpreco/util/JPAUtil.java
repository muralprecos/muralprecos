package br.com.tt.painelpreco.util;

public class JPAUtil {
	
	public static String likeExpression(String main) {
		return StringUtil.aroundBy(main, "%");
	}

}
