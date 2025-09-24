package br.com.tt.painelpreco.config;

import javax.annotation.PostConstruct;
import javax.persistence.EntityManagerFactory;

import org.springframework.context.annotation.Configuration;

@Configuration
public class HibernateSearchConfig {

    private final EntityManagerFactory entityManagerFactory;

    public HibernateSearchConfig(EntityManagerFactory entityManagerFactory) {
        this.entityManagerFactory = entityManagerFactory;
    }

    @PostConstruct
    public void configureHibernateSearch() {
        entityManagerFactory.getProperties().put(
            "hibernate.search.backends.default.directory.root",
            "/lucene/mural"
        );
        entityManagerFactory.getProperties().put(
        	"hibernate.search.backends.default.directory.type",
            "filesystem"
        );
    }
}
