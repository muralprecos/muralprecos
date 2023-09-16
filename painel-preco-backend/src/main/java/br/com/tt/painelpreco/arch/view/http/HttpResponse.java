package br.com.tt.painelpreco.arch.view.http;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

import org.apache.http.StatusLine;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.tt.painelpreco.arch.api.dto.DTO;
import br.com.tt.painelpreco.arch.api.dto.PageableDTO;
import br.com.tt.painelpreco.arch.exception.ArchException;
import br.com.tt.painelpreco.arch.view.http.exception.HttpException;
import br.com.tt.painelpreco.util.IOUtil;
import br.com.tt.painelpreco.util.ReflectionUtil;
import br.com.tt.painelpreco.util.SpringUtil;
import lombok.extern.log4j.Log4j2;

@Log4j2
public class HttpResponse {
	
	private static final String TOKEN_AUTHORIZATION_KEY = "code";
	
	public static final String ACCESS_TOKEN_KEY = "access_token";
	
	private JSONObject response;
	
	private ObjectMapper mapper;
	
	public HttpResponse() {
		init();
	}
	
	public HttpResponse(CloseableHttpResponse response) {
		init();
		String responseStr = null;
        try {
        	checkResponseError(response);
        	responseStr = IOUtil.toString(response.getEntity().getContent());
        	this.response = new JSONObject(responseStr);
        } catch (NullPointerException e) {
        	// Nothing. Http status code 201. No content.
        } catch (HttpException he) {
        	throw he;
        } catch (JSONException e) {
        	try {
	        	JSONArray jsonArray = new JSONArray(responseStr);
	        	this.response = jsonArray.getJSONObject(0);
	        	// TODO: parametrizar response para tratar e retornar JSONObject e JSONArray de acordo com o retorno do endpoint
        	} catch (Exception e1) {
        		throw new ArchException(e1);
			}
		} catch (IOException e) {
			throw new ArchException(e);
			
		}
	}
	
	private void init() {
		this.mapper = SpringUtil.getBean(ObjectMapper.class);
	}

	private void checkResponseError(CloseableHttpResponse response) throws HttpException, IOException {
		StatusLine statusLine = response.getStatusLine();
		int statusCode = statusLine.getStatusCode();
		if (!Integer.toString(statusLine.getStatusCode()).startsWith("20"))
			throw new HttpException(statusCode, "An error occurred while processing the request. Status code: " + statusCode
					+ "; reason phrase: " + statusLine.getReasonPhrase() + "; response: " + EntityUtils.toString(response.getEntity(), StandardCharsets.UTF_8));
	}
	
	@SuppressWarnings("unchecked")
	public <T> T getResponse() {
		return (T) response;
	}
	
	@SuppressWarnings("unchecked")
	public <T> T getProperty(String key) {
		return (T) response.get(key);
	}
	
	public boolean isNoContent() {
		return response == null;
	}

	public String getCodeAuthorization() {
		return getProperty(TOKEN_AUTHORIZATION_KEY);
	}
	
	public String getAccessToken() {
		return getProperty(ACCESS_TOKEN_KEY);
	}
	
	public <T extends DTO> T toDTO(T dto) {
		if (isNoContent())
			return dto;
		
		response.keys().forEachRemaining(key -> {
				ReflectionUtil.invokeModifierMethod(dto, key, response.get(key));
			}
		);

		// TODO criar recursividade para setar atributos "complexos" ou usar modelMapper
		return dto;
	}
	
	public <T extends DTO> T toDTO(Class<T> dtoClass) {
		return classToDTO(dtoClass);
	}
	
	public <T extends PageableDTO<?>> T toPageableDTO(Class<T> dtoClass) {
		return classToDTO(dtoClass);
	}
	
	private <T extends DTO> T classToDTO(Class<T> dtoClass) {
		try {
			return mapper.readValue(this.response.toString(), dtoClass);
		} catch (JsonProcessingException e) {
			log.error("Ocorreu um erro ao tentar converter response para DTO." + e.getMessage(), e);
			throw new ArchException(e);
		}
	}
	
}
