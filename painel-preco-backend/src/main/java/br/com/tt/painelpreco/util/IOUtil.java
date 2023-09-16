package br.com.tt.painelpreco.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import br.com.tt.painelpreco.arch.exception.ArchException;

public class IOUtil {
	
	public static String toString(InputStream is) {
        BufferedReader br = new BufferedReader(new InputStreamReader(is));
        StringBuffer sb = new StringBuffer();
        String line = null;
        try {
			while ((line = br.readLine()) != null) {
			    sb.append(line);
			}
		} catch (IOException e) {
			throw new ArchException(e);
		} finally {
			try {
				br.close();
				is.close();
			} catch (IOException e) {
				throw new ArchException(e);
			}
		}
        return sb.toString();
	}

}
