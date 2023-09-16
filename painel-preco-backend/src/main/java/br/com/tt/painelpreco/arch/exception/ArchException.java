package br.com.tt.painelpreco.arch.exception;

public class ArchException extends RuntimeException {

	private static final long serialVersionUID = 1L;
	
	
	public ArchException() {
		super();
	}

	public ArchException(String message) {
		super(message);
	}

	public ArchException(Throwable cause) {
		super(cause);
	}

	public ArchException(String message, Throwable cause) {
		super(message, cause);
	}
	
}
