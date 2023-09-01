package br.com.tt.painelpreco.util;

import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ModelConverter {
	
	@Autowired
	private ModelMapper mapper;
	
	@PostConstruct
	public void init() {
		mapper = new ModelMapper();
	}
	
	public <T> T toDTO(Object entity, Class<T> clazz) {
		return mapper.map(entity, clazz);
	}
	
	public <T> List<T> toDTOCollection(List<?> entities, Class<T> clazz) {
		return entities.stream()
						.map(entity -> toDTO(entity, clazz))
						.collect(Collectors.toList());
	}
	
	public <T> T toEntity(Object dto, Class<T> clazz) {
		return mapper.map(dto, clazz);
	}
 
}
