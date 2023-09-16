package br.com.tt.painelpreco.arch.api.dto;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public abstract class PageableDTO<T extends DTO> extends DTO {
	
	protected Pageable pageable;
	protected int totalPages;
	protected boolean last;
	protected int totalElements;
	protected int number;
	protected Sort sort;
	protected int size;
	protected boolean first;
	protected int numberOfElements;
	protected boolean empty = true;
    
    public abstract List<T> getContent();
    public abstract void setContent(List<T> content);

}
