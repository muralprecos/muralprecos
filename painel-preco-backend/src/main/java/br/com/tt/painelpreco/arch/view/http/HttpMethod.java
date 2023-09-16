package br.com.tt.painelpreco.arch.view.http;

import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.client.methods.HttpRequestBase;

import br.com.tt.painelpreco.util.ReflectionUtil;

public enum HttpMethod {
	
	POST(HttpPost.class), GET(HttpGet.class), PUT(HttpPut.class);

	private Class<? extends HttpRequestBase> clazz;

	HttpMethod(Class<? extends HttpRequestBase> clazz) {
		this.clazz = clazz;
	}
	
	@SuppressWarnings("unchecked")
	public <T extends HttpRequestBase> T getInstance() {
		return (T) ReflectionUtil.newInstance(clazz);
	}

	boolean isPUT() {
		return HttpMethod.PUT.equals(this);
	}
}