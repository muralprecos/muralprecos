-- Materialized view para ranking de fornecedores (dados agregados de todos os períodos)
-- Permite consultas instantâneas sem joins pesados quando o cache Redis está frio.
-- Refreshed automaticamente ao final de cada ciclo de ingestão.

CREATE MATERIALIZED VIEW IF NOT EXISTS mural.mv_fornecedor_ranking AS
SELECT
    f.documento                        AS documento,
    f.nome                             AS nome,
    COALESCE(pf.nome, 'Nao Informado') AS porte,
    COUNT(il.id_item_licitacao)        AS total_contratos,
    COALESCE(SUM(il.valor), 0)         AS valor_total
FROM mural.item_licitacao il
JOIN mural.fornecedor f
    ON f.id_fornecedor = il.fornecedor_id
LEFT JOIN mural.porte_fornecedor pf
    ON pf.id_porte_fornecedor = f.porte_fornecedor_id
GROUP BY f.documento, f.nome, pf.nome;

-- Índice único necessário para REFRESH CONCURRENTLY (não bloqueia leituras)
CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_fornecedor_ranking_unique
    ON mural.mv_fornecedor_ranking (documento);

-- Índice de ordenação para ranking por valor
CREATE INDEX IF NOT EXISTS idx_mv_fornecedor_ranking_valor
    ON mural.mv_fornecedor_ranking (valor_total DESC);
