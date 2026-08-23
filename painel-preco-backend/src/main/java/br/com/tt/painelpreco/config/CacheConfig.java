package br.com.tt.painelpreco.config;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean("cacheKeyGenerator")
    public KeyGenerator cacheKeyGenerator() {
        return new CacheCustomKeyGenerator();
    }
}
