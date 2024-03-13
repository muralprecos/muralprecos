package br.com.tt.painelpreco.config;

import java.lang.reflect.Method;

import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.util.StringUtils;

/**
 * 
 * 
 * Ref.: https://medium.com/simform-engineering/spring-boot-caching-with-redis-1a36f719309f
 * 
 * **/
public class CacheCustomKeyGenerator implements KeyGenerator {
	  @Override
	  public Object generate(Object target, Method method, Object... params) {
	      return target.getClass().getSimpleName() + "_" + method.getName() + "_" + StringUtils.arrayToDelimitedString(params, "_");
	   }
	}