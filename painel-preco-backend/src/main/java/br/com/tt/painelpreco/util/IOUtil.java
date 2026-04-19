package br.com.tt.painelpreco.util;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.stream.Stream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

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
	
	public static void zipDirectory(String sourceDirPath, String zipFilePath) throws IOException {
        Path sourceDir = Paths.get(sourceDirPath);
        Path zipFile = Paths.get(zipFilePath);

        if (!Files.isDirectory(sourceDir)) {
            throw new IllegalArgumentException("Source directory does not exist or is not a directory");
        }

        // Use try-with-resources to ensure streams are closed automatically
        try (FileOutputStream fos = new FileOutputStream(zipFile.toFile());
             ZipOutputStream zos = new ZipOutputStream(fos);
             Stream<Path> paths = Files.walk(sourceDir)) { // Use Files.walk() for recursive traversal

            paths.forEach(path -> {
                try {
                    // Get the path of the file relative to the source directory
                    Path relativePath = sourceDir.relativize(path);
                    if (!relativePath.toString().isEmpty()) { // Avoid adding the root directory itself as an entry
                        ZipEntry zipEntry = new ZipEntry(relativePath.toString());
                        zos.putNextEntry(zipEntry);

                        if (Files.isRegularFile(path)) {
                            // Copy file content into the zip entry
                            Files.copy(path, zos);
                        }
                        zos.closeEntry();
                    }
                } catch (IOException e) {
                    // In a real application, handle this exception more robustly
                    System.err.println("Error adding file to zip: " + path + " - " + e.getMessage());
                }
            });

            System.out.println("ZIP file created successfully at: " + zipFilePath);

        } catch (IOException e) {
            System.err.println("Error creating ZIP file: " + e.getMessage());
            throw e;
        }
    }

}
