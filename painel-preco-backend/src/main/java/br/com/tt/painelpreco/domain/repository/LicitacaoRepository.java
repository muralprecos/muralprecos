package br.com.tt.painelpreco.domain.repository;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import br.com.tt.painelpreco.domain.repository.projection.DadosMensaisProjection;
import br.com.tt.painelpreco.domain.repository.projection.DashboardKpiProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import br.com.tt.painelpreco.domain.model.Licitacao;
import org.springframework.data.repository.query.Param;

public interface LicitacaoRepository extends JpaRepository<Licitacao, Integer>, JpaSpecificationExecutor<Licitacao> {
	
	@Query(value = "SELECT a.ano FROM (SELECT DISTINCT EXTRACT(YEAR FROM l.data_resultado_compra) AS ano FROM mural.licitacao l) AS a where CAST(a.ano AS CHARACTER VARYING) ILIKE :ano ORDER BY 1", nativeQuery = true,
			countQuery = "SELECT COUNT(a.ano) FROM (SELECT DISTINCT EXTRACT(YEAR FROM l.data_resultado_compra) AS ano FROM mural.licitacao l) AS a where CAST(a.ano AS CHARACTER VARYING) ILIKE :ano ORDER BY 1")
	Page<BigDecimal> findAllAnos(String ano, Pageable pageable);

	@Query(value = "SELECT a.ano FROM (SELECT DISTINCT EXTRACT(YEAR FROM l.data_resultado_compra) AS ano FROM mural.licitacao l) AS a ORDER BY 1", nativeQuery = true)
	List<Integer> findAllAnos();

    @Query(value = "SELECT " +
            "COUNT(CASE WHEN l.data_resultado_compra >= :inicioMesAtual AND l.data_resultado_compra <= :fimMesAtual THEN 1 END) AS licitacoesMes, " +
            "COUNT(CASE WHEN l.data_resultado_compra >= :inicioMesAnterior AND l.data_resultado_compra <= :fimMesAnterior THEN 1 END) AS licitacoesMesAnterior, " +
            "AVG(CASE WHEN l.data_resultado_compra >= :inicioMesAtual AND l.data_resultado_compra <= :fimMesAtual THEN l.valor END) AS valorMedio, " + // <-- NOVO
            "AVG(l.valor) AS valorMedioGeral " +
            "FROM mural.licitacao l", nativeQuery = true)
    DashboardKpiProjection getLicitacoesKpiData(@Param("inicioMesAtual") Date inicioMesAtual, @Param("fimMesAtual") Date fimMesAtual,
                                                @Param("inicioMesAnterior") Date inicioMesAnterior, @Param("fimMesAnterior") Date fimMesAnterior);

    @Query(value = "SELECT " +
            "TO_CHAR(l.data_resultado_compra, 'MM/YYYY') AS mesAno, " +
            "COUNT(l.id_licitacao) AS volumeLicitacoes, " +
            "SUM(l.valor) AS valorCotacoes " +
            "FROM mural.licitacao l " +
            // A query agora espera DUAS datas
            "WHERE l.data_resultado_compra BETWEEN :inicioPeriodo AND :fimPeriodo " +
            "GROUP BY TO_CHAR(l.data_resultado_compra, 'YYYY-MM'), mesAno " +
            "ORDER BY TO_CHAR(l.data_resultado_compra, 'YYYY-MM')", nativeQuery = true)
    List<DadosMensaisProjection> getLicitacaoMensalVolume(
            @Param("inicioPeriodo") Date inicioPeriodo,
            @Param("fimPeriodo") Date fimPeriodo
    );
}
