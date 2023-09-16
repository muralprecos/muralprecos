package br.com.tt.painelpreco.arch.view.http;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.http.entity.StringEntity;
import org.json.JSONObject;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Body extends TinyTypeMap {
	
	public static final Body DEFAULT = null;

	private JSONObject json;

	public Body() {}
	
	public Body(JSONObject json) {
		this.json = json;
	}
	
	public StringEntity getStringEntity(ContentType contextType) {
		return new StringEntity(getString(contextType), contextType.getApacheContentType());
	}
	
	public String getString(ContentType contextType) {
		if (this.json != null)
			return this.json.toString();
		
		String body = "";
		Map<String, Object> map = super.map();
		if (contextType != null && contextType.equals(ContentType.APPLICATION_FORM_URLENCODED)) {
			body = map.entrySet()
						.stream()
						.map(
							e -> e.getKey() + "=" + URLEncoder.encode((String) e.getValue(), StandardCharsets.UTF_8)
						).collect(Collectors.joining("&"));
			
		} else {
			JSONObject json = new JSONObject();
			map.forEach((key, value) -> json.put(key, value));
			body = json.toString();
		}
		return body;
	}

}
