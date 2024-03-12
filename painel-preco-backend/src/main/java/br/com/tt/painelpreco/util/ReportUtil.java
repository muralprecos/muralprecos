package br.com.tt.painelpreco.util;

import java.awt.image.BufferedImage;
import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.Connection;
import java.util.Map;

import javax.imageio.ImageIO;
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
	private static final String HEADER_ATTACHMENT_FILENAME = "attachment; filename=";
	private static final String HEADER_CONTENT_TYPE_DOWNLOAD = "application/pdf";
	public static final String DEFAULT_REPORT_PATH = "/META-INF/reports/";
	public static final String DEFAULT_LOGO_PATH = "/static/img/logo.png";
	
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
	
	public byte[] downloadReportWithPDF(String reportFileName, Map<String, Object> parameters) {
		try {
			Connection con = localDataSource.getConnection();
			InputStream report = Thread.currentThread().getContextClassLoader().getResourceAsStream(String.format("META-INF/reports/%s.jasper", reportFileName));
			JasperPrint jasperPrint = JasperFillManager.fillReport(report, parameters, con);
			return JasperExportManager.exportReportToPdf(jasperPrint);
		} catch (Exception e) {
			e.printStackTrace();
			throw new ArchException("Ocorreu um erro ao gerar o relatório. Causa: " + e.getMessage());
		}
	}
	
	public JasperReport getReport(String fileName) {
		InputStream is = (BufferedInputStream) getClass().getResourceAsStream(DEFAULT_REPORT_PATH + fileName + DEFAULT_EXTENSION_REPORT);
		JasperReport report = null;
		try {
			report = (JasperReport) JRLoader.loadObject(is);
		} catch (JRException e) {
			e.printStackTrace();
			throw new ArchException("Ocorreu um erro ao abrir o relatório. Causa: " + e.getMessage());
		}
		return report;
	}
	
	public String getReportRelativePath(String fileName) {
		return ReportUtil.DEFAULT_REPORT_PATH + fileName + DEFAULT_EXTENSION_REPORT;
	}
	
	public String getDefaultLogoPath() {
		return DEFAULT_LOGO_PATH;
	}
	
	public BufferedImage getDefaultLogo() {
		return getImageDefaultPath("logo.png");
	}
	
	public BufferedImage getImageDefaultPath(String imageName) {
		BufferedImage image = null;
		try {
			image =  ImageIO.read(getClass().getResource("/static/img/" + imageName));
		} catch (IOException e) {
			e.printStackTrace();
			throw new ArchException("Ocorreu um erro ao carregar imagem " + imageName + ". Causa: " + e.getMessage());
		}
		return image;
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