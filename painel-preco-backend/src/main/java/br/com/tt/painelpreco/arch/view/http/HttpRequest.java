package br.com.tt.painelpreco.arch.view.http;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import org.apache.http.NameValuePair;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpEntityEnclosingRequestBase;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.TrustSelfSignedStrategy;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.ssl.SSLContexts;

import br.com.tt.painelpreco.arch.exception.ArchException;
import br.com.tt.painelpreco.arch.view.http.exception.HttpException;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class HttpRequest {
	
	public static class Builder {
		
		private HttpRequest instance;
		
		private Builder(HttpMethod httpMethod) {
			instance = new HttpRequest(httpMethod);
		}
		
		public HttpRequest setUri(String uri) {
			try {
				instance.httpRequestBase.setURI(new URI(uri));
			} catch (URISyntaxException e) {
				throw new ArchException(e);
			}
			
			return instance;
		}
		
	}
	
	private CloseableHttpClient httpClient;
	private HttpRequestBase httpRequestBase;
	private ContentType contextType;
	
	private HttpRequest() {}

	private HttpRequest(HttpMethod httpMethod) {
		this.httpRequestBase = httpMethod.getInstance();
	}
	
	public static HttpRequest.Builder create(HttpMethod httpMethod) {
		return new Builder(httpMethod);
	}
	
	@SuppressWarnings("unchecked")
	public <T extends HttpRequestBase> T getHttpRequestBase() {
		return (T) httpRequestBase;
	}

	public HttpRequest add(Header header) {
		contextType = header.getContentType();
		if (header != null)	header.map().forEach((key, value) -> httpRequestBase.addHeader(key, value.toString()));
		
		return this;
	}
	
	public HttpRequest add(Body body) {
		if (body != null) {
			((HttpEntityEnclosingRequestBase) getHttpRequestBase()).setEntity(body.getStringEntity(contextType));
		}
		
		return this;
	}
	
	public HttpRequest add(QueryParam queryParam) {
		if (queryParam != null) {
			List<NameValuePair> nameValuePairs = new ArrayList<>();
			queryParam.map().forEach((key, value) -> {
				String valueStr = null;
				try {
					valueStr = value.toString();
				} catch (NullPointerException e) {}
				nameValuePairs.add(new BasicNameValuePair(key, valueStr));
			});

			if (httpRequestBase instanceof HttpPost) {
				setQueryParamPost(nameValuePairs);
			} else {
				setQueryParamGet(nameValuePairs);
			}
		}
		
		return this;
	}

	private void setQueryParamPost(List<NameValuePair> nameValuePairs) {
		HttpPost httpPost = getHttpRequestBase();
		httpPost.setEntity(new UrlEncodedFormEntity(nameValuePairs, StandardCharsets.UTF_8));
	}

	private void setQueryParamGet(List<NameValuePair> nameValuePairs) {
		HttpRequestBase requestBase = getHttpRequestBase();
		try {
			URI uri = new URIBuilder(requestBase.getURI())
							.addParameters(nameValuePairs)
							.build();
			requestBase.setURI(uri);
		} catch (URISyntaxException e) {
			throw new ArchException(e);
		}
	}
	
	public HttpResponse execute() throws HttpException {
		try {
			logger(httpRequestBase);
			CloseableHttpResponse response = getHttpClient().execute(httpRequestBase);
			return new HttpResponse(response);
		} catch (IOException e) {
			throw new ArchException(e);
		}
	}
	
	private void logger(HttpRequestBase httpRequestBase) {
		String message = "HttpRequest: " + httpRequestBase.toString();
		log.debug(message);
		System.out.println(message);
	}

	private CloseableHttpClient getHttpClient() {
		if (httpClient == null) {
	        RequestConfig requestConfig = RequestConfig.custom()
	        		.setContentCompressionEnabled(true)
	                .setExpectContinueEnabled(true)
	                .build();

	        try {
				return HttpClientBuilder.create()
						.setDefaultRequestConfig(requestConfig)
						// Necessário para rodar no ambiente de homologação do pje, devido o certificado ser autoassinado
						.setSSLSocketFactory(new SSLConnectionSocketFactory(
									SSLContexts.custom()
											.loadTrustMaterial(null, new TrustSelfSignedStrategy())
											.build()
								)
						).build();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return httpClient;
    }

}
