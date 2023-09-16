package br.com.tt.painelpreco.util;

public class StringUtil {
	
	public static boolean isNull(String str) {
		return str == null;
	}
	
	public static boolean isEmpty(String str) {
		return isNull(str) || "".equals(str.trim());
	}
	
	public static String aroundBy(String main, String around) {
		return around + main + around;
	}
	
	public static String concatWithStr(String str1, String str2, String character) {
		str1 = (str1.endsWith(character) ? str1.substring(0, str1.lastIndexOf(character)) : str1);
		str2 = (str2.startsWith(character) ? str2.substring(1) : str2);
		return str1 + character + str2;
	}

}
