package br.com.tt.painelpreco.util;

public class ResourceUtil {
	
	public static final String REPORT_FOLDER = "META-INF/reports/";
	public static final String IMAGE_FOLDER = "static/images/";
	
	private static String file(String folder, String fileName) {
		return folder + fileName;
	}
	
	public static String report(String fileName) {
		return file(REPORT_FOLDER, fileName);
	}
	
	public static String image(String fileName) {
		return file(IMAGE_FOLDER, fileName);
	}

}
