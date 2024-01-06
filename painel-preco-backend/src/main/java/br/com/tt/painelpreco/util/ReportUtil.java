package br.com.tt.painelpreco.util;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.Connection;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;

import br.com.tt.painelpreco.arch.exception.ArchException;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;

@Component
public class ReportUtil {
	
	private static final String HEADER_ATTACHMENT_FILENAME = "attachment; filename=";
	private static final String HEADER_CONTENT_TYPE_DOWNLOAD = "application/pdf";
	
	@Autowired
	protected DataSource localDataSource;
	
	public void downloadReportWithPDF(String reportFileName, Map<String, Object> parameters, HttpServletResponse response, String fileNamePDF) {
		try {
			Connection con = localDataSource.getConnection();
			InputStream report = Thread.currentThread().getContextClassLoader().getResourceAsStream(String.format("META-INF/reports/%s.jasper", reportFileName));
			JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameters, con);
			JasperExportManager.exportReportToPdfStream(jasperPrint, getOsForDownload(response, String.format("%s.pdf", fileNamePDF)));
		} catch (Exception e) {
			e.printStackTrace();
			throw new ArchException("Ocorreu um erro ao gerar o relatório. Causa: " + e.getMessage());
		}
	}
	
	private OutputStream getOsForDownload(HttpServletResponse response, String fileName) throws IOException {
		response.setContentType(ReportUtil.HEADER_CONTENT_TYPE_DOWNLOAD);
		response.setHeader(HttpHeaders.CONTENT_DISPOSITION, ReportUtil.HEADER_ATTACHMENT_FILENAME + fileName);
		
		return response.getOutputStream();
	}

}