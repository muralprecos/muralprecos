package br.com.tt.painelpreco.config;

import java.util.Date;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import feign.FeignException;
import feign.RequestInterceptor;
import feign.RetryableException;
import feign.Retryer;
import feign.codec.ErrorDecoder;

@Configuration
public class FeignConfiguration {

    @Bean
    public Retryer retryer() {
        // Começa com 1s, dobra até 10s, tenta até 10 vezes
        return new Retryer.Default(1000L, 10000L, 10);
    }

    @Bean
    public ErrorDecoder errorDecoder() {
        return (methodKey, response) -> {
            if (response.status() == 429) {
                Date retryAfter = new Date(System.currentTimeMillis() + 60_000);
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
    public RequestInterceptor rateLimitInterceptor() {
        return template -> {
            try {
                Thread.sleep(300);
            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
            }
        };
    }

}
