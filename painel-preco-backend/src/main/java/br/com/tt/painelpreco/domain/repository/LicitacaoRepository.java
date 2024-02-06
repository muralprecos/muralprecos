package br.com.tt.painelpreco.domain.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import br.com.tt.painelpreco.domain.model.Licitacao;

public interface LicitacaoRepository extends JpaRepository<Licitacao, Integer>, JpaSpecificationExecutor<Licitacao> {
	
	@Query(value = "SELECT a.ano FROM (SELECT DISTINCT EXTRACT(YEAR FROM l.data_resultado_compra) AS ano FROM mural.licitacao l) AS a where CAST(a.ano AS CHARACTER VARYING) ILIKE :ano ORDER BY 1", nativeQuery = true,
			countQuery = "SELECT COUNT(a.ano) FROM (SELECT DISTINCT EXTRACT(YEAR FROM l.data_resultado_compra) AS ano FROM mural.licitacao l) AS a where CAST(a.ano AS CHARACTER VARYING) ILIKE :ano ORDER BY 1")
	Page<BigDecimal> findAllAnos(String ano, Pageable pageable);

	@Query(value = "SELECT a.ano FROM (SELECT DISTINCT EXTRACT(YEAR FROM l.data_resultado_compra) AS ano FROM mural.licitacao l) AS a ORDER BY 1", nativeQuery = true)
	List<Integer> findAllAnos();
	
}
