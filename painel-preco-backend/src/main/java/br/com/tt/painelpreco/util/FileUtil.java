package br.com.tt.painelpreco.util;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import org.apache.commons.io.IOUtils;

import br.com.tt.painelpreco.arch.exception.ArchException;

public class FileUtil {
	
	public static File getAbsoluteTmpFile(String subDir, String fileName) {
		String fileInputPath = fileName;
		if (subDir != null)
			fileInputPath = subDir + fileName;
		
		try {
		    InputStream exeInputStream = FileUtil.class.getClassLoader().getResourceAsStream(fileInputPath);
		    
		    String tmpDir = "/tmp/";
		    if (subDir != null)
		    	tmpDir += subDir;
		    
		    createDirectoryIfNotExist(tmpDir);
		    
		    String fileOutputPath = tmpDir + fileName;		    
			OutputStream exeOutputStream = new FileOutputStream(fileOutputPath);
			IOUtils.copy(exeInputStream, exeOutputStream);
			 
			return new File(fileOutputPath); 
		} catch (IOException e) {
			throw new ArchException("Ocorreu um erro ao ler o arquivo " + fileInputPath + ". Causa:" + e.getMessage());
		}
	}
	
	private static void createDirectoryIfNotExist(String path) {
		File dir = new File(path);
		
	    if (!dir.exists())
	    	dir.mkdirs();
	}
	
	public static String getAbsoluteTmpPath(String subDir, String fileName) {
		return getAbsoluteTmpFile(subDir, fileName).getAbsolutePath();
	}
	
	public static String getPathImage(String string) {
		return getAbsoluteTmpPath(ResourceUtil.IMAGE_FOLDER, string);
	}

}
