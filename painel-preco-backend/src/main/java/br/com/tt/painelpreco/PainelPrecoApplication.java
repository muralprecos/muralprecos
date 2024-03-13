package br.com.tt.painelpreco;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@EnableCaching
@SpringBootApplication
public class PainelPrecoApplication {

	public static void main(String[] args) {
		SpringApplication.run(PainelPrecoApplication.class, args);
	}

}
