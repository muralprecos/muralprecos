package br.com.tt.painelpreco.arch.view.http;

import org.springframework.stereotype.Component;

@Component
public class HttpClient {
	
	public HttpResponse requestGet(Header header, Body body, QueryParam queryParam, String url) {
        return request(HttpMethod.GET, header, body, queryParam, url);
    }
	
	public HttpResponse requestPost(Header header, Body body, QueryParam queryParam, String url) {
        return request(HttpMethod.POST, header, body, queryParam, url);
    }
	
	public HttpResponse requestPut(Header header, Body body, QueryParam queryParam, String url) {
        return request(HttpMethod.PUT, header, body, queryParam, url);
    }
	
	public HttpResponse request(HttpMethod httpMethod, Header header, Body body, QueryParam queryParam, String uri) {
        return HttpRequest.create(httpMethod)
        		.setUri(uri)
        		.add(header)
        		.add(body)
        		.add(queryParam)
        		.execute();
    }

}
