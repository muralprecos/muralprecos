package br.com.tt.painelpreco.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import javax.xml.bind.DatatypeConverter;

public class MessageDigestUtil {
	
	public static String getHashMD5(byte[] file) {
		String hash = null;
		try {
			MessageDigest md = MessageDigest.getInstance("MD5");
			md.update(file);
			byte[] digest = md.digest();
			
			hash = DatatypeConverter.printHexBinary(digest).toLowerCase();
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		}
		return hash;
	}

}
