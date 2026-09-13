package br.com.tt.painelpreco.domain.repository;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import br.com.tt.painelpreco.domain.model.ItemLicitacao;
import br.com.tt.painelpreco.domain.repository.projection.FornecedorEvolucaoProjection;
import br.com.tt.painelpreco.domain.repository.projection.FornecedorKpiProjection;
import br.com.tt.painelpreco.domain.repository.projection.FornecedorPorteProjection;
import br.com.tt.painelpreco.domain.repository.projection.FornecedorRankingProjection;
import org.springframework.data.repository.query.Param;

public interface ItemLicitacaoRepository extends JpaRepository<ItemLicitacao, Integer>, JpaSpecificationExecutor<ItemLicitacao> {
	
	@EntityGraph("itemLicitacao.withDetails")
	ItemLicitacao findByUuid(UUID uuid);
	
	List<ItemLicitacao> findAllByUuidIn(List<UUID> uuids);
	
	@EntityGraph(attributePaths = {"unidadeFornecimento"})
	Page<ItemLicitacao> findAll(Specification<ItemLicitacao> spec, Pageable pageable);

	@Query("SELECT DISTINCT new ItemLicitacao(il.descricao) FROM ItemLicitacao il WHERE UPPER(il.descricao) LIKE UPPER(:descricao) ORDER BY il.descricao")
	Page<ItemLicitacao> findAllByDescricao(String descricao, Pageable pageable);
	
	@Query("SELECT DISTINCT new ItemLicitacao(il.descricaoComplementar) FROM ItemLicitacao il WHERE UPPER(il.descricaoComplementar) LIKE UPPER(:descricaoComplementar) ORDER BY il.descricaoComplementar")
	Page<ItemLicitacao> findAllByDescricaoComplementar(String descricaoComplementar, Pageable pageable);

	@Query("SELECT il FROM ItemLicitacao il WHERE il.fornecedor IS NULL AND il.licitacao IS NOT NULL ORDER BY il.id")
	List<ItemLicitacao> findPendentesImportacaoFornecedor();

	// Projeção leve para coleta de fornecedor (NULL + Padrão), com keyset pagination.
	// Inclui fornecedor_id = 1 (Padrão / "Não Informado") que nunca foi consultado na API.
	@Query(value = "SELECT id_item_licitacao, numero_controle_pncp, numero_item "
			+ "FROM mural.item_licitacao "
			+ "WHERE (fornecedor_id IS NULL OR fornecedor_id = 1) "
			+ "  AND licitacao_id IS NOT NULL "
			+ "  AND id_item_licitacao > :lastId "
			+ "  AND (ultima_tentativa_fornecedor IS NULL OR ultima_tentativa_fornecedor < CURRENT_DATE) "
			+ "ORDER BY id_item_licitacao "
			+ "LIMIT :pageSize",
			nativeQuery = true)
	List<Object[]> findPendentesRawPage(@Param("lastId") long lastId, @Param("pageSize") int pageSize);

	// Mantida para compatibilidade (usada em outros pontos)
	@Query(value = "SELECT id_item_licitacao, numero_controle_pncp, numero_item "
			+ "FROM mural.item_licitacao "
			+ "WHERE fornecedor_id IS NULL AND licitacao_id IS NOT NULL "
			+ "ORDER BY id_item_licitacao",
			nativeQuery = true)
	List<Object[]> findPendentesRaw();

	@Query(value =
		"SELECT " +
		"    COUNT(DISTINCT f.id_fornecedor) AS totalFornecedores, " +
		"    COUNT(il.id_item_licitacao)     AS totalContratos, " +
		"    COALESCE(SUM(il.valor), 0)      AS valorTotal, " +
		"    COUNT(DISTINCT CASE WHEN l.data_abertura BETWEEN :inicioMes AND :fimMes THEN f.id_fornecedor END) AS fornecedoresMes, " +
		"    COUNT(DISTINCT CASE WHEN l.data_abertura BETWEEN :inicioMesAnterior AND :fimMesAnterior THEN f.id_fornecedor END) AS fornecedoresMesAnterior, " +
		"    COALESCE(SUM(CASE WHEN l.data_abertura BETWEEN :inicioMes AND :fimMes THEN il.valor ELSE 0 END), 0) AS valorMes, " +
		"    COALESCE(SUM(CASE WHEN l.data_abertura BETWEEN :inicioMesAnterior AND :fimMesAnterior THEN il.valor ELSE 0 END), 0) AS valorMesAnterior " +
		"FROM mural.item_licitacao il " +
		"JOIN mural.fornecedor f ON f.id_fornecedor = il.fornecedor_id " +
		"LEFT JOIN mural.porte_fornecedor pf ON pf.id_porte_fornecedor = f.porte_fornecedor_id " +
		"JOIN mural.licitacao l  ON l.id_licitacao  = il.licitacao_id " +
		"WHERE (CAST(:dataInicio AS date) IS NULL OR l.data_abertura >= CAST(:dataInicio AS date)) " +
		"  AND (CAST(:dataFim AS date) IS NULL OR l.data_abertura <= CAST(:dataFim AS date)) " +
		"  AND (:nome IS NULL OR f.nome ILIKE CONCAT('%', CAST(:nome AS text), '%')) " +
		"  AND (:documento IS NULL OR f.documento = :documento) " +
		"  AND (:porte IS NULL OR pf.nome = :porte)",
		nativeQuery = true)
	FornecedorKpiProjection getFornecedorKpiData(
		@Param("inicioMes") Date inicioMes,
		@Param("fimMes") Date fimMes,
		@Param("inicioMesAnterior") Date inicioMesAnterior,
		@Param("fimMesAnterior") Date fimMesAnterior,
		@Param("dataInicio") Date dataInicio,
		@Param("dataFim") Date dataFim,
		@Param("nome") String nome,
		@Param("documento") String documento,
		@Param("porte") String porte
	);

	@Query(value =
		"SELECT " +
		"    f.documento                        AS documento, " +
		"    f.nome                             AS nome, " +
		"    COALESCE(pf.nome, 'Nao Informado') AS porte, " +
		"    COUNT(il.id_item_licitacao)        AS totalContratos, " +
		"    COALESCE(SUM(il.valor), 0)         AS valorTotal " +
		"FROM mural.item_licitacao il " +
		"JOIN mural.fornecedor f ON f.id_fornecedor = il.fornecedor_id " +
		"LEFT JOIN mural.porte_fornecedor pf ON pf.id_porte_fornecedor = f.porte_fornecedor_id " +
		"JOIN mural.licitacao l ON l.id_licitacao = il.licitacao_id " +
		"WHERE (CAST(:dataInicio AS date) IS NULL OR l.data_abertura >= CAST(:dataInicio AS date)) " +
		"  AND (CAST(:dataFim AS date) IS NULL OR l.data_abertura <= CAST(:dataFim AS date)) " +
		"  AND (:nome IS NULL OR f.nome ILIKE CONCAT('%', CAST(:nome AS text), '%')) " +
		"  AND (:documento IS NULL OR f.documento = :documento) " +
		"  AND (:porte IS NULL OR pf.nome = :porte) " +
		"GROUP BY f.documento, f.nome, pf.nome " +
		"ORDER BY valorTotal DESC " +
		"LIMIT :limite",
		nativeQuery = true)
	List<FornecedorRankingProjection> getRankingFornecedores(
		@Param("dataInicio") Date dataInicio,
		@Param("dataFim") Date dataFim,
		@Param("nome") String nome,
		@Param("documento") String documento,
		@Param("porte") String porte,
		@Param("limite") int limite
	);

	@Query(value =
		"SELECT " +
		"    COALESCE(pf.nome, 'Nao Informado') AS porte, " +
		"    COUNT(DISTINCT f.id_fornecedor)    AS totalFornecedores, " +
		"    COUNT(il.id_item_licitacao)        AS totalContratos, " +
		"    COALESCE(SUM(il.valor), 0)         AS valorTotal " +
		"FROM mural.item_licitacao il " +
		"JOIN mural.fornecedor f ON f.id_fornecedor = il.fornecedor_id " +
		"LEFT JOIN mural.porte_fornecedor pf ON pf.id_porte_fornecedor = f.porte_fornecedor_id " +
		"JOIN mural.licitacao l ON l.id_licitacao = il.licitacao_id " +
		"WHERE (CAST(:dataInicio AS date) IS NULL OR l.data_abertura >= CAST(:dataInicio AS date)) " +
		"  AND (CAST(:dataFim AS date) IS NULL OR l.data_abertura <= CAST(:dataFim AS date)) " +
		"  AND (:nome IS NULL OR f.nome ILIKE CONCAT('%', CAST(:nome AS text), '%')) " +
		"  AND (:documento IS NULL OR f.documento = :documento) " +
		"GROUP BY pf.nome " +
		"ORDER BY valorTotal DESC",
		nativeQuery = true)
	List<FornecedorPorteProjection> getDistribuicaoPorPorte(
		@Param("dataInicio") Date dataInicio,
		@Param("dataFim") Date dataFim,
		@Param("nome") String nome,
		@Param("documento") String documento
	);

	@Query(value =
		"SELECT " +
		"    TO_CHAR(l.data_abertura, 'MM/YYYY') AS mesAno, " +
		"    COUNT(DISTINCT f.id_fornecedor)     AS totalFornecedores, " +
		"    COUNT(il.id_item_licitacao)         AS totalContratos, " +
		"    COALESCE(SUM(il.valor), 0)          AS valorTotal " +
		"FROM mural.item_licitacao il " +
		"JOIN mural.fornecedor f ON f.id_fornecedor = il.fornecedor_id " +
		"LEFT JOIN mural.porte_fornecedor pf ON pf.id_porte_fornecedor = f.porte_fornecedor_id " +
		"JOIN mural.licitacao l  ON l.id_licitacao  = il.licitacao_id " +
		"WHERE l.data_abertura BETWEEN :inicioPeriodo AND :fimPeriodo " +
		"  AND (:nome IS NULL OR f.nome ILIKE CONCAT('%', CAST(:nome AS text), '%')) " +
		"  AND (:documento IS NULL OR f.documento = :documento) " +
		"  AND (:porte IS NULL OR pf.nome = :porte) " +
		"GROUP BY TO_CHAR(l.data_abertura, 'YYYY-MM'), TO_CHAR(l.data_abertura, 'MM/YYYY') " +
		"ORDER BY TO_CHAR(l.data_abertura, 'YYYY-MM')",
		nativeQuery = true)
	List<FornecedorEvolucaoProjection> getEvolucaoMensal(
		@Param("inicioPeriodo") Date inicioPeriodo,
		@Param("fimPeriodo") Date fimPeriodo,
		@Param("nome") String nome,
		@Param("documento") String documento,
		@Param("porte") String porte
	);

	// Usados pela ingestão de itens do PNCP para tornar cada tentativa de bloco idempotente:
	// método derivado simples (sem @Modifying de bulk delete) para que o Hibernate Search
	// seja notificado item a item e remova os documentos Lucene correspondentes.
	void deleteByLicitacaoIdIn(List<Long> licitacaoIds);

	boolean existsByLicitacaoIdIn(List<Long> licitacaoIds);

	long countByLicitacaoIdIn(List<Long> licitacaoIds);

}
