package br.com.tt.painelpreco.config;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;

import org.keycloak.adapters.springsecurity.authentication.KeycloakAuthenticationProvider;
import org.keycloak.adapters.springsecurity.config.KeycloakWebSecurityConfigurerAdapter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.authority.mapping.SimpleAuthorityMapper;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.web.authentication.session.RegisterSessionAuthenticationStrategy;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig extends KeycloakWebSecurityConfigurerAdapter {
	
	private class PublicResource {
		private Set<String> resources = new HashSet<>();
		
		PublicResource(String[] resources) {
			addAll(resources);
		}
		
		void addAll(String[] resources) {
			this.resources.addAll(new HashSet<>(Arrays.asList(resources)));
		}
		
		String[] getAll() {
			return resources.toArray(new String[] {});
		}
	}
	
	private PublicResource publicResource;
	
	@Value("${app.api.resource.public}")
	private String[] defaultPublicsResources;
	
	@PostConstruct
	public void init() {
		try {
			publicResource = new PublicResource(defaultPublicsResources);
		} catch (NullPointerException e) {}
	}

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) {
        KeycloakAuthenticationProvider keycloakAuthenticationProvider = keycloakAuthenticationProvider();
        keycloakAuthenticationProvider.setGrantedAuthoritiesMapper(new SimpleAuthorityMapper());
        auth.authenticationProvider(keycloakAuthenticationProvider);
    }

    @Bean
    @Override
    protected SessionAuthenticationStrategy sessionAuthenticationStrategy() {
        return new RegisterSessionAuthenticationStrategy(new SessionRegistryImpl());
    }
    
//    @SuppressWarnings("deprecation")
//	@Bean
//    @Override
//    protected KeycloakAuthenticationProcessingFilter keycloakAuthenticationProcessingFilter() throws Exception {
//        RequestMatcher requestMatcher =
//                new OrRequestMatcher(
//                        new AntPathRequestMatcher(KeycloakAuthenticationEntryPoint.DEFAULT_LOGIN_URI),
//                        new QueryParamPresenceRequestMatcher(OAuth2Constants.ACCESS_TOKEN),
//                        new IgnoreKeycloakProcessingFilterRequestMatcher()
//                );
//        return new KeycloakAuthenticationProcessingFilter(authenticationManagerBean(), requestMatcher);
//    }

    private class IgnoreKeycloakProcessingFilterRequestMatcher implements RequestMatcher {
        IgnoreKeycloakProcessingFilterRequestMatcher() {
        }

        public boolean matches(HttpServletRequest request) {
            String authorizationHeaderValue = request.getHeader("Authorization");
            return authorizationHeaderValue != null;
        }
    }
    
    /** Template Method Pattern **/
	public String[] getAdditionalPublicResource() {
		return new String[] {};
	}
	
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        super.configure(http);
        
        publicResource.addAll(getAdditionalPublicResource());
        
        http.csrf().disable()
        	.cors()
        	.and().headers().frameOptions().sameOrigin()
        	.and().authorizeRequests()
        	.antMatchers(publicResource.getAll()).permitAll()
        	.anyRequest().authenticated();
    }
    
    @Bean
	CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		
		// Permite qualquer origin, pois a restrição é feita pelos Web Origins cadastrados no client no Keycloak
		configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("*"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
		
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		
		return source;
	}
    
	
}
