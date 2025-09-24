package br.com.tt.painelpreco.config;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.transaction.Transactional;

import org.hibernate.search.mapper.orm.Search;
import org.springframework.stereotype.Component;
import org.springframework.transaction.support.TransactionTemplate;

import br.com.tt.painelpreco.domain.model.ControleIndexacao;
import br.com.tt.painelpreco.domain.model.ItemLicitacao;
import br.com.tt.painelpreco.domain.repository.ControleIndexacaoRepository;
import br.com.tt.painelpreco.domain.repository.ItemLicitacaoRepository;

@Component
public class StartupIndexer {
	
	private final EntityManagerFactory emf;
	private final TransactionTemplate transactionTemplate;
	private final ControleIndexacaoRepository controleIndexacaoRepository;
	private final ItemLicitacaoRepository itemLicitacaoRepository;

	public StartupIndexer(EntityManagerFactory emf, TransactionTemplate transactionTemplate, ControleIndexacaoRepository controleIndexacaoRepository, ItemLicitacaoRepository itemLicitacaoRepository) {
		this.emf = emf;
		this.transactionTemplate = transactionTemplate;
		this.controleIndexacaoRepository = controleIndexacaoRepository;
		this.itemLicitacaoRepository = itemLicitacaoRepository;
	}
	
	@Transactional
	public void init(boolean startup) {
		if (startup) {
			System.out.println("Iniciando indexação em massa...");
			EntityManager em = emf.createEntityManager();
			
			ControleIndexacao controleIndexacao = controleIndexacaoRepository.findByEntidade("ItemLicitacao");
			
			Long tam = em.createQuery("SELECT count(id) FROM ItemLicitacao", Long.class).getSingleResult();
			
			int batchSize = 100;
			int offset = 1;
			
			List<ItemLicitacao> batch = em.createQuery("SELECT i FROM ItemLicitacao i WHERE i.id > :ultimoItemId ORDER BY i.id ASC", ItemLicitacao.class)
					.setParameter("ultimoItemId", controleIndexacao.getUltimoIndiceId())
					.setFirstResult(offset)
					.setMaxResults(batchSize)
					.getResultList();
					
			
			while (true) {
				final EntityManager em = emf.createEntityManager();
				try {
					final Long currentOffset = lastProcessedOffset;
					
					// Transação 1: Busca o lote de registros usando OFFSET e LIMIT
					List<ItemLicitacao> batch = transactionTemplate.execute(status -> {
						return em.createQuery("SELECT i FROM ItemLicitacao i ORDER BY i.id ASC", ItemLicitacao.class)
								.setFirstResult(currentOffset.intValue())
								.setMaxResults(batchSize)
								.getResultList();
					});
	
					if (batch == null || batch.isEmpty()) {
						System.out.println("Indexação concluída: nenhum novo registro encontrado.");
						break;
					}
					
					// Transação 2: Processa a indexação (uso intensivo de memória)
					transactionTemplate.execute(status -> {
						System.out.printf("Iniciando indexação do lote com offset %d%n", currentOffset);
						
						for (ItemLicitacao item : batch) {
							Search.session(em).indexingPlan().addOrUpdate(item);
						}
						
						// Força a sincronização e a liberação de memória
						em.flush();
						em.clear();
						
						return null;
					});
					
					// Transação 3: Salva o progresso
					Long newOffset = currentOffset + batch.size();
					transactionTemplate.execute(status -> {
						IndexingProgress progress = progressRepository.findByEntityName("ItemLicitacao").orElseGet(() -> {
							IndexingProgress newProgress = new IndexingProgress();
							newProgress.setEntityName("ItemLicitacao");
							return newProgress;
						});
						progress.setLastProcessedOffset(newOffset);
						progressRepository.save(progress);
						return null;
					});
					
					System.out.printf("Lote indexado com sucesso. Offset salvo: %d%n", newOffset);
	
					lastProcessedOffset = newOffset;
					
				} finally {
					if (em != null && em.isOpen()) {
						em.close();
					}
				}
			}
			System.out.println("Processo de indexação finalizado.");
		}
	}

}
