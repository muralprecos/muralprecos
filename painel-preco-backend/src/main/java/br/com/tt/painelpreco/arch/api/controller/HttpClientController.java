package br.com.tt.painelpreco.arch.api.controller;

import org.springframework.beans.factory.annotation.Autowired;

import br.com.tt.painelpreco.arch.view.http.Body;
import br.com.tt.painelpreco.arch.view.http.Header;
import br.com.tt.painelpreco.arch.view.http.HttpClient;
import br.com.tt.painelpreco.arch.view.http.HttpResponse;
import br.com.tt.painelpreco.arch.view.http.QueryParam;
import br.com.tt.painelpreco.util.StringUtil;
import lombok.AccessLevel;
import lombok.Getter;

public abstract class HttpClientController extends AbstractController {

	@Getter(AccessLevel.NONE)
	@Autowired
	private HttpClient httpClient;

	private String configUri(String uri) {
		return uri.startsWith("http") ? uri : StringUtil.concatWithStr(getApiBaseUrl(), uri, "/");
	}

	public String getApiBaseUrl() {
		return "";
	}

	public HttpResponse requestGet(Header header, Body body, QueryParam queryParam, String uri) {
		return httpClient.requestGet(header, body, queryParam, configUri(uri));
	}

	public HttpResponse requestPost(Header header, Body body, QueryParam queryParam, String uri) {
		return httpClient.requestPost(header, body, queryParam, configUri(uri));
	}

	public HttpResponse requestPut(Header header, Body body, QueryParam queryParam, String uri) {
		return httpClient.requestPut(header, body, queryParam, configUri(uri));
	}

	public HttpResponse requestDelete(Header header, Body body, QueryParam queryParam, String uri) {
		return httpClient.requestDelete(header, body, queryParam, configUri(uri));
	}

}
