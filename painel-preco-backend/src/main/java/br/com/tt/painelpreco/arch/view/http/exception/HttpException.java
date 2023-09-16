package br.com.tt.painelpreco.arch.view.http.exception;

import java.util.Arrays;

import br.com.tt.painelpreco.arch.exception.ArchException;

public class HttpException extends ArchException {
	
	private static final long serialVersionUID = 1L;
	
	private static final Integer[] ACCESS_ERROR_CODE = {401, 403};
	
	int statusCode = -1;
	
	public HttpException(String message) {
		super(message);
	}
	
	public HttpException(int statusCode, String message) {
		super(message);
		this.statusCode = statusCode;
	}

	public int getStatusCode() {
		return statusCode;
	}

	public boolean isAcessoNegado() {
		return Arrays.asList(ACCESS_ERROR_CODE).contains(statusCode);
	}

}
