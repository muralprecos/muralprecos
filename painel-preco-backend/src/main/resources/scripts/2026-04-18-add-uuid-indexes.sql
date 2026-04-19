-- Índices para acelerar lookups por UUID nos principais domínios
-- Necessário para o fallback JPA no endpoint GET /api/v1/itens-licitacao/{uuid}
-- e também beneficia outros findByUuid chamados no sistema.

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_item_licitacao_uuid
    ON mural.item_licitacao (uuid);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_licitacao_uuid
    ON mural.licitacao (uuid);

ALTER TABLE mural.organizacao ADD COLUMN IF NOT EXISTS ativo BOOLEAN NOT NULL DEFAULT TRUE; 

ALTER TABLE mural.organizacao ADD COLUMN IF NOT EXISTS data_criacao TIMESTAMP;

ALTER TABLE mural.organizacao ADD COLUMN IF NOT EXISTS cnpj varchar(18) NULL;

ALTER TABLE mural.organizacao ADD COLUMN IF NOT EXISTS numero varchar(15) NULL;


