package br.com.tt.painelpreco.arch.api.controller;

import java.io.InputStream;
import java.lang.reflect.Field;
import java.security.Principal;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.keycloak.KeycloakPrincipal;
import org.keycloak.KeycloakSecurityContext;
import org.keycloak.adapters.springsecurity.token.KeycloakAuthenticationToken;
import org.keycloak.representations.AccessToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import br.com.tt.painelpreco.arch.api.dto.DTO;
import br.com.tt.painelpreco.arch.exception.ArchException;
import br.com.tt.painelpreco.arch.infra.auth.Usuario;
import br.com.tt.painelpreco.util.ReflectionUtil;
import br.com.tt.painelpreco.util.ReportUtil;
import net.sf.jasperreports.engine.JasperReport;

public abstract class AbstractController {
	
	private static final List<String> POSSIBLE_IP_HEADERS = List.of(
			"X-Real-IP",
			"X-Forwarded-For",
			"HTTP_FORWARDED",
			"HTTP_FORWARDED_FOR",
			"HTTP_X_FORWARDED",
			"HTTP_X_FORWARDED_FOR",
			"HTTP_CLIENT_IP",
			"HTTP_VIA",
			"HTTP_X_CLUSTER_CLIENT_IP",
			"Proxy-Client-IP",
			"WL-Proxy-Client-IP",
			"REMOTE_ADDR"
		  );
	
	@Autowired
	private ApplicationContext context;
	
	@Autowired
	HttpServletRequest request;
	
	@Autowired
	private ReportUtil reportUtil;
	
	@Value("${app.domain}")
	private String appDomain;
	
	public Map<String, Object> dtoToMap(DTO dto) {
		Map<String, Object> parameters = new HashMap<>();

		Field[] fields = ReflectionUtil.getFields(dto.getClass());
		for (Field field : fields) {
			try {
				field.setAccessible(true);
				parameters.put(field.getName(), field.get(dto));
			} catch (IllegalArgumentException | IllegalAccessException e) {
				throw new ArchException(e);
			}
		}
		
		return parameters;
	}
	
	@SuppressWarnings("unchecked")
	public <T> T getBean(String nome) {
		return (T) context.getBean(nome);
	}
	
	public HttpSession getSession() {
		ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
		return attr.getRequest().getSession(true);
	}
	
	public void addAttrSession(String key, Object attr) {
		getSession().setAttribute(key, attr);
	}
	
	@SuppressWarnings("unchecked")
	public <T> T getAttrSession(String key) {
		return (T) getSession().getAttribute(key);
	}
	
	public Principal getPrincipal() {
	    KeycloakAuthenticationToken authentication = (KeycloakAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
	    return (Principal) authentication.getPrincipal();
	}
	
	@SuppressWarnings("unchecked")
	public KeycloakPrincipal<KeycloakSecurityContext> getUserToken() {
		try {
			return (KeycloakPrincipal<KeycloakSecurityContext>) getPrincipal();
		} catch (ClassCastException e) {
			throw new ArchException("Usuário não foi autenticado no keycloak", e);
		}
	
	}
	
	public Map<String, Object> getUserAttributes() {
		return getUserToken().getKeycloakSecurityContext().getToken().getOtherClaims();
	}
	
	@SuppressWarnings("unchecked")
	public <T> T getUserAtribute(String key) {
		return (T) getUserAttributes().get(key);
	}
	
	public KeycloakSecurityContext getKeyCloakContext() {
		return getUserToken().getKeycloakSecurityContext();
	}
	
	public AccessToken getAccessToken() {
		return getKeyCloakContext().getToken();
	}
	
	public Usuario getUsuario() {
		try {
			return new Usuario(getAccessToken().getPreferredUsername(), getAccessToken().getGivenName(), getAccessToken().getEmail());
		} catch (NullPointerException e) {
			return new Usuario();
			// TODO: handle exception
		}
	}
	
	public String getRemoteAddress() {
		return getIpAddressFromHeader(request);
	}
	
	private String getIpAddressFromHeader(HttpServletRequest request) {
	    for (String ipHeader : POSSIBLE_IP_HEADERS) {
	      String headerValue = Collections.list(request.getHeaders(ipHeader)).stream()
	          .filter(StringUtils::hasLength)
	          .findFirst()
	          .orElse(null);
	 
	      if (headerValue != null) {
	        return headerValue;
	      }
	    }
	 
	    return request.getRemoteAddr();
	}
	
	public JasperReport getReport(String fileName) {
		return reportUtil.getReport(fileName);
	}
	
	public String getReportRelativePath(String fileName) {
		return reportUtil.getReportRelativePath(fileName);
	}
	
	public String getDefaultLogoPath() {
		return reportUtil.getDefaultLogoPath();
	}
	
	public InputStream getDefaultLogo() {
		return reportUtil.getDefaultLogo();
	}
	
	public void reportExportPDF(String reportFileName, Map<String, Object> params, HttpServletResponse response, String fileNamePDF) {
		reportUtil.downloadReportWithPDF(reportFileName, params, response, fileNamePDF);
	}
	
	public byte[] reportExportPDF(String reportFileName, Map<String, Object> params) {
		return reportUtil.downloadReportWithPDF(reportFileName, params);
	}
	
	public void downloadPDF(byte[] report, HttpServletResponse response, String fileNamePDF ) {
		reportUtil.downloadPDF(report, response, fileNamePDF);
	}
	
	public String getAppDomain() {
		return appDomain;
	}

}
