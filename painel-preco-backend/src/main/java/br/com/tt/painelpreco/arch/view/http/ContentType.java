package br.com.tt.painelpreco.arch.view.http;

public enum ContentType {
	
	APPLICATION_JSON(org.apache.http.entity.ContentType.APPLICATION_JSON.toString(), org.apache.http.entity.ContentType.APPLICATION_JSON),
	APPLICATION_FORM_URLENCODED(org.apache.http.entity.ContentType.APPLICATION_FORM_URLENCODED.toString(), org.apache.http.entity.ContentType.APPLICATION_FORM_URLENCODED);

	private String name;
	private org.apache.http.entity.ContentType apacheContentType;

	ContentType(String name, org.apache.http.entity.ContentType apacheContentType) {
		this.name = name;
		this.apacheContentType = apacheContentType;
	}
	
	public String getName() {
		return name;
	}
	
	public org.apache.http.entity.ContentType getApacheContentType() {
		return apacheContentType;
	}

}
