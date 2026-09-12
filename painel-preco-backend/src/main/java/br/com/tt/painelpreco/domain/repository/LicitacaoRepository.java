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

	boolean existsByNumeroPncp(String numeroPncp);

	@Query(value = "SELECT l FROM Licitacao l WHERE NOT EXISTS (SELECT 1 FROM ItemLicitacao il WHERE il.licitacao = l)")
	List<Licitacao> findPendentesImportacaoItens();

	// Filtra apenas licitações SRP (objeto menciona registro de preços) cujas atas + itens
	// ainda não foram integralmente processados (atas_completo_em IS NULL). Antes, o critério
	// era "nenhuma ata existente ainda", o que marcava a licitação como concluída assim que a
	// primeira ata era salva, mesmo que o processamento tivesse sido interrompido no meio.
	// Reduz de 867K para ~19K licitações, tornando a coleta viável.
	@Query(value =
		"SELECT l.* FROM mural.licitacao l " +
		"WHERE l.atas_completo_em IS NULL " +
		"AND (LOWER(l.objeto) LIKE '%registro%pre%' OR LOWER(l.objeto) LIKE '%sistema%regist%' " +
		"     OR LOWER(l.objeto) LIKE '% srp %' OR LOWER(l.objeto) LIKE '%srp:%')",
		nativeQuery = true)
	List<Licitacao> findPendentesImportacaoAtas();

	// Só os IDs das licitações pendentes: a ingestão de itens carrega e persiste em blocos
	// (uma transação por bloco), então não faz sentido trazer todas as entidades de uma vez.
	@Query(value = "SELECT l.id FROM Licitacao l WHERE NOT EXISTS (SELECT 1 FROM ItemLicitacao il WHERE il.licitacao = l)")
	List<Long> findIdsPendentesImportacaoItens();

	@Query(value = "SELECT l FROM Licitacao l WHERE l.id IN :ids")
	List<Licitacao> findAllByIdIn(@Param("ids") List<Long> ids);

	@Query(value = "SELECT l.* FROM mural.licitacao l WHERE l.numero_controle_pncp = ANY(:numerosPncp)", nativeQuery = true)
	List<Licitacao> findAllByNumeroPncpIn(@Param("numerosPncp") String[] numerosPncp);
}
