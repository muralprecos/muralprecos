-- Índice para acelerar a query findPendentesImportacaoFornecedor e joins de dashboard
CREATE INDEX IF NOT EXISTS idx_item_licitacao_fornecedor_id
    ON mural.item_licitacao (fornecedor_id);

-- Índice para acelerar aggregations por fornecedor (ranking, por-porte etc.)
CREATE INDEX IF NOT EXISTS idx_item_licitacao_valor
    ON mural.item_licitacao (valor);

-- Índice para filtrar por periodo via licitacao
CREATE INDEX IF NOT EXISTS idx_licitacao_data_abertura
    ON mural.licitacao (data_abertura);
