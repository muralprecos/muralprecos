package br.com.tt.painelpreco.config;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.bohnman.squiggly.Squiggly;
import com.github.bohnman.squiggly.web.RequestSquigglyContextProvider;
import com.github.bohnman.squiggly.web.SquigglyRequestFilter;

@Configuration
public class SquigglyConfig {
	
	@Bean
	public FilterRegistrationBean<SquigglyRequestFilter> squigglyRequestFilter(ObjectMapper objectMapper) {
		Squiggly.init(objectMapper, new RequestSquigglyContextProvider());
		
//		var urlPatterns = Arrays.asList("/esferas/*", "/licitacoes/*");
		
		var filterRegistrarion = new FilterRegistrationBean<SquigglyRequestFilter>();
		filterRegistrarion.setFilter(new SquigglyRequestFilter());
		filterRegistrarion.setOrder(1);
		
		return filterRegistrarion;
	}

}
