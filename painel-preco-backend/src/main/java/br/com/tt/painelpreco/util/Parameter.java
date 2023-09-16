package br.com.tt.painelpreco.util;

import java.util.HashMap;
import java.util.Map;

public class Parameter {
	
	private Map<String , Object> map = new HashMap<>();
	
	public Parameter add(String key, Object value) {
		map.put(key, value);
		return this;
	}
	
	@SuppressWarnings("unchecked")
	public <T> T get(String key) {
		return (T) map.get(key);
	}
	
	public Map<String , Object> map() {
		return map;
	}

}
