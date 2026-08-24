package br.com.tt.painelpreco.llm.config;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;

import feign.FeignException;
import feign.Request;
import feign.RetryableException;
import feign.Retryer;
import feign.codec.ErrorDecoder;

/**
 * Configuração isolada do LlmClient — passada via
 * {@code @FeignClient(configuration = ...)}, NÃO é uma classe
 * {@code @Configuration} escaneada globalmente. Isso é proposital: mantém o
 * LlmClient fora dos beans globais de {@code config.FeignConfiguration}
 * (retry e throttle de 300ms calibrados para o polling do PNCP, inadequados
 * para chamadas de LLM, que são naturalmente mais lentas e mais caras de
 * repetir sem necessidade).
 */
public class LlmFeignConfiguration {

	@Value("${llm.api.connect-timeout-ms:10000}")
	private int connectTimeoutMs;

	@Value("${llm.api.read-timeout-ms:180000}")
	private int readTimeoutMs;

	@Bean
	public Retryer retryer() {
		// Poucas tentativas, espaçadas: uma chamada de LLM já é lenta por natureza.
		return new Retryer.Default(2000L, 20000L, 3);
	}

	@Bean
	public ErrorDecoder errorDecoder() {
		return (methodKey, response) -> {
			if (response.status() == 429) {
				Date retryAfter = new Date(System.currentTimeMillis() + 30_000);
				return new RetryableException(429, "429 Too Many Requests",
						response.request().httpMethod(), retryAfter, response.request());
			}
			if (response.status() >= 500) {
				Date retryAfter = new Date(System.currentTimeMillis() + 5_000);
				return new RetryableException(response.status(), response.status() + " Server Error",
						response.request().httpMethod(), retryAfter, response.request());
			}
			return FeignException.errorStatus(methodKey, response);
		};
	}

	@Bean
	public Request.Options options() {
		return new Request.Options(connectTimeoutMs, readTimeoutMs);
	}

}
