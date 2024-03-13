package br.com.tt.painelpreco.util;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.Serializable;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;

import br.com.tt.painelpreco.arch.exception.ArchException;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.util.JRLoader;

@Component
public class ReportUtil {
	
	private static final String DEFAULT_EXTENSION_REPORT = ".jasper";
	private static final String REPORT_NAME_TEMPLATE = ResourceUtil.REPORT_FOLDER + "%s" + DEFAULT_EXTENSION_REPORT;
	private static final String HEADER_ATTACHMENT_FILENAME = "attachment; filename=";
	private static final String HEADER_CONTENT_TYPE_DOWNLOAD = "application/pdf";
	
	private static Map<String, Serializable> DEFAULTS_PARAMETERS = new HashMap<>();
	
	static {
		DEFAULTS_PARAMETERS.put("logo", FileUtil.getPathImage("logo.png"));
	}
	
	@Autowired
	protected DataSource localDataSource;
	
	public void downloadReportWithPDF(String reportFileName, Map<String, Object> parameters, HttpServletResponse response, String fileNamePDF) {
		try {
			Connection con = localDataSource.getConnection();
			InputStream report = Thread.currentThread().getContextClassLoader().getResourceAsStream(String.format(REPORT_NAME_TEMPLATE, reportFileName));
			
			ReportUtil.fillDefaultsParameters(parameters);
			
			JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameters, con);
			JasperExportManager.exportReportToPdfStream(jasperPrint, getOsForDownload(response, String.format("%s.pdf", fileNamePDF)));
		} catch (Exception e) {
			e.printStackTrace();
			throw new ArchException("Ocorreu um erro ao gerar o relatório. Causa: " + e.getMessage());
		}
	}
	
	public byte[] downloadReportWithPDF(String reportFileName, Map<String, Object> parameters) {
		try {
			Connection con = localDataSource.getConnection();
			InputStream report = Thread.currentThread().getContextClassLoader().getResourceAsStream(String.format(REPORT_NAME_TEMPLATE, reportFileName));
			
			ReportUtil.fillDefaultsParameters(parameters);
			
			JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameters, con);
			return JasperExportManager.exportReportToPdf(jasperPrint);
		} catch (Exception e) {
			e.printStackTrace();
			throw new ArchException("Ocorreu um erro ao gerar o relatório. Causa: " + e.getMessage());
		}
	}
	
	private static void fillDefaultsParameters(Map<String, Object> parameters) {
		for (String param : DEFAULTS_PARAMETERS.keySet()) {
			if (!parameters.containsKey(param))
				parameters.put(param, DEFAULTS_PARAMETERS.get(param));
		}
	}
	
	public JasperReport getReport(String fileName) {
		JasperReport report = null;
		try {
			report = (JasperReport) JRLoader.loadObject(Thread.currentThread().getContextClassLoader().getResourceAsStream(String.format(REPORT_NAME_TEMPLATE, fileName)));
		} catch (JRException e) {
			e.printStackTrace();
			throw new ArchException("Ocorreu um erro ao abrir o relatório. Causa: " + e.getMessage());
		}
		return report;
	}
	
	public void downloadPDF(byte[] report, HttpServletResponse response, String fileNamePDF) {
		try {
			getOsForDownload(response, String.format("%s.pdf", fileNamePDF)).write(report);
		} catch (IOException e) {
			e.printStackTrace();
			throw new ArchException("Ocorreu um erro ao baixar o relatório. Causa: " + e.getMessage());
		}
	}
	
	private OutputStream getOsForDownload(HttpServletResponse response, String fileName) throws IOException {
		response.setContentType(ReportUtil.HEADER_CONTENT_TYPE_DOWNLOAD);
		response.setHeader(HttpHeaders.CONTENT_DISPOSITION, ReportUtil.HEADER_ATTACHMENT_FILENAME + fileName);
		
		return response.getOutputStream();
	}

}