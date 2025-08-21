package br.com.tt.painelpreco.util;

import org.apache.commons.lang3.StringUtils;

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

	public static String lpad(String str, int size, char charPad) {
		return StringUtils.leftPad(str, size, charPad);
	}
	
	public static String substring(String str, int begin, int size) {
		return str.substring(begin, begin + size);
	}

}
