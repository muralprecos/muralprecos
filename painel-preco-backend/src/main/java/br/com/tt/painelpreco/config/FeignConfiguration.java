package br.com.tt.painelpreco.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import feign.Retryer;

@Configuration
public class FeignConfiguration {
	
	@Bean
    public Retryer retryer() {
		// Começa com 100ms, dobra a cada falha até o máximo de 2 segundos, tenta 5 vezes
        return new Retryer.Default(1000L, 10000L, 10);
    }

}
