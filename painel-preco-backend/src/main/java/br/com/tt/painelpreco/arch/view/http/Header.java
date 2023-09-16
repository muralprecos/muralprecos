package br.com.tt.painelpreco.arch.view.http;

import br.com.tt.painelpreco.util.TokenUtil;

public class Header extends TinyTypeMap {
	
	private ContentType contentType;
	
	public Header addAuth(AuthorizationType authorizationType, String clientId, String clientSecret) {
		return addAuth(authorizationType, ContentType.APPLICATION_JSON, clientId, clientSecret);
	}
	
	public Header addAuth(AuthorizationType authorizationType, ContentType contentType, String clientId, String clientSecret) {
		String senha = clientId + ":" + clientSecret;
		String authorizationToken = TokenUtil.base64Enconder(senha);
		add(AUTHORIZATION_KEY, authorizationType.getName() + authorizationToken);
		setContentType(contentType);
		
		return this;
	}
	
	public Header addAuth(AuthorizationType authorizationType, String accessToken) {
		return addAuth(authorizationType, ContentType.APPLICATION_JSON, accessToken);
	}
	
	public Header addAuth(AuthorizationType authorizationType, ContentType contentType, String accessToken) {
		add(AUTHORIZATION_KEY, AuthorizationType.BEARER.getName() + accessToken);
		setContentType(contentType);
		
		return this;
	}
	
	public Header setContentType(ContentType contentType) {
		this.contentType = contentType;
		add(Header.CONTENT_TYPE_KEY, contentType.getName());
		
		return this;
	}

	public ContentType getContentType() {
		return contentType;
	}

}
