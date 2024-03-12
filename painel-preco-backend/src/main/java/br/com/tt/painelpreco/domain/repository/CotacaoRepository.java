package br.com.tt.painelpreco.domain.repository;

import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import br.com.tt.painelpreco.domain.model.Cotacao;

public interface CotacaoRepository extends JpaRepository<Cotacao, Integer>, JpaSpecificationExecutor<Cotacao> {

	@Transactional
	Cotacao findByHashValidacao(String hash);
	
	@Query("SELECT new Cotacao(uuid, nome, nomeArquivo, stringBusca, hashValidacao, criadoEm) FROM Cotacao c ORDER BY c.criadoPor, c.criadoEm")
	Page<Cotacao> findAllSemArquivo(Pageable pageable);

	@Transactional
	Cotacao findByUuid(UUID uuid);

	@Query(value = "SELECT ARRAY_AGG(il.descricao) AS stringBusca FROM mural.item_licitacao il WHERE il.uuid IN (:itens)", nativeQuery = true)
	String findStringBuscaByItens(UUID[] itens);
	
}
