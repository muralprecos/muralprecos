package br.com.tt.painelpreco.util;

import org.springframework.context.ApplicationContext;

import br.com.tt.painelpreco.config.ApplicationContextProvider;

public class SpringUtil {
	
	public static ApplicationContext getApplicationContext() {
		return ApplicationContextProvider.getApplicationContext();
	}
	
	public static <T> T getBean(Class<T> beanClass) {
		return SpringUtil.getApplicationContext().getBean(beanClass);
	}
	
	@SuppressWarnings("unchecked")
	public static <T> T getBean(String beanName) {
		return (T) SpringUtil.getApplicationContext().getBean(beanName);
	}

}
