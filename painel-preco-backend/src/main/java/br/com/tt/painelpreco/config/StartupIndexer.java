package br.com.tt.painelpreco.config;

import javax.persistence.EntityManager;
import javax.transaction.Transactional;

import org.hibernate.search.mapper.orm.Search;
import org.springframework.stereotype.Component;

@Component
public class StartupIndexer {
	
	private EntityManager em;

	public StartupIndexer(EntityManager em) {
		this.em = em;
	}
	
	@Transactional
	public void init(boolean startup) {
		if (startup)
			Search.session(em).massIndexer().start();
	}

}
