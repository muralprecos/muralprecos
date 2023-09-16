package br.com.tt.painelpreco.util;

import java.util.Base64;

public class TokenUtil {
	
	public static String base64Enconder(String s) {
		return Base64.getEncoder().encodeToString(s.getBytes());
	}

}
