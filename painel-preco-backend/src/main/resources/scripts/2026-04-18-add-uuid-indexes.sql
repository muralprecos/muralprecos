-- Índices para acelerar lookups por UUID nos principais domínios
-- Necessário para o fallback JPA no endpoint GET /api/v1/itens-licitacao/{uuid}
-- e também beneficia outros findByUuid chamados no sistema.

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_item_licitacao_uuid
    ON mural.item_licitacao (uuid);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_licitacao_uuid
    ON mural.licitacao (uuid);
