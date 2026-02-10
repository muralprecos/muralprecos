package br.com.tt.painelpreco;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

import br.com.tt.painelpreco.config.StartupIndexer;
import br.com.tt.painelpreco.pncp.domain.service.ColetaDadosPncpService;

//@EnableCaching
@EnableScheduling
@EnableFeignClients
@SpringBootApplication
public class PainelPrecoApplication {

	public static void main(String[] args) {
		SpringApplication.run(PainelPrecoApplication.class, args);
	}
	
	@Bean
    public CommandLineRunner initIndexes(StartupIndexer initializer) {
        return args -> {
            initializer.init(false);
        };
    }
	
	@Bean
    public CommandLineRunner run(ColetaDadosPncpService pncpService) {
        return args -> {
            pncpService.getDados(true);
        };
    }

}
