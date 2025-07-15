package br.com.tt.painelpreco.util;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
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
	
	public static byte[] convertInputStreamToByteArray(InputStream inputStream) throws IOException {
		ByteArrayOutputStream buffer = new ByteArrayOutputStream();
		int nRead;
		byte[] data = new byte[1024];
		while ((nRead = inputStream.read(data, 0, data.length)) != -1) {
			buffer.write(data, 0, nRead);
		}
		buffer.flush();
		return buffer.toByteArray();
	}
	
	public static InputStream loadInputStreamInClassPath(String path) {
		return IOUtil.class.getClassLoader().getResourceAsStream(path);
	}
	
	public static byte[] loadArrayByteInClassPath(String path) {
		try {
			return IOUtil.convertInputStreamToByteArray(IOUtil.loadInputStreamInClassPath(path));
		} catch (IOException e) {
			e.printStackTrace();
			return null;
		}
	}

}
