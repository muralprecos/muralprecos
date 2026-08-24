package br.com.tt.painelpreco;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;
import org.springframework.core.annotation.Order;
import org.springframework.scheduling.annotation.EnableScheduling;

import br.com.tt.painelpreco.config.StartupIndexer;
import br.com.tt.painelpreco.pncp.domain.service.ColetaDadosPncpService;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.CacheManager;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;

@EnableCaching
@EnableScheduling
@EnableFeignClients
@SpringBootApplication
public class PainelPrecoApplication {

	@Value("${pncp.api.coletor.startup}")
	private Boolean coletorStartup;

	@Value("${pncp.api.coletor.licitacoesOnly}")
	private Boolean licitacoesOnly;

	@Value("${lucene.startup}")
	private Boolean luceneStartup;

	public static void main(String[] args) {
		SpringApplication.run(PainelPrecoApplication.class, args);
	}

	@Bean
	@Order(1) // Executará primeiro
	public CommandLineRunner initColetor(ColetaDadosPncpService pncpService) {
		return args -> {
			pncpService.getDados(coletorStartup, licitacoesOnly);
		};
	}

	@Bean
	@Order(2) // Executará após a coleta
	public CommandLineRunner initIndexes(StartupIndexer initializer) {
		return args -> {
			initializer.init(luceneStartup);
		};
	}

	@Bean
	public CacheManager cacheManager() {
		return new ConcurrentMapCacheManager(
				"keycloakUsers", "keycloakUserRoles", "keycloakGroups", "keycloakRoles", "keycloakToken",
				"ata-kpis", "ata-por-situacao", "ata-evolucao", "ata-top-objetos", "ata-alertas-vencimento",
				"fornecedor-kpis", "fornecedor-ranking", "fornecedor-porte", "fornecedor-evolucao");
	}

}
