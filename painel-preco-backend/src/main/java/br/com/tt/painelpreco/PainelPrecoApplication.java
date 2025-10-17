package br.com.tt.painelpreco;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;

import br.com.tt.painelpreco.config.StartupIndexer;
import br.com.tt.painelpreco.pncp.api.PncpService;

//@EnableCaching
@EnableFeignClients
@SpringBootApplication
public class PainelPrecoApplication {

	public static void main(String[] args) {
		SpringApplication.run(PainelPrecoApplication.class, args);
	}
	
	@Bean
    public CommandLineRunner initIndexes(StartupIndexer initializer) {
        return args -> {
            initializer.init(true);
        };
    }
	
	@Bean
    public CommandLineRunner run(PncpService pncpService) {
        return args -> {
            pncpService.obterDadosLicitacao();
        };
    }

}
