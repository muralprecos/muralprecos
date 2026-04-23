-- Adiciona colunas de auditoria de sincronização Keycloak nas tabelas usuario e organizacao
ALTER TABLE mural.usuario ADD COLUMN IF NOT EXISTS detalhes_ultima_sincronizacao TEXT;
ALTER TABLE mural.usuario ADD COLUMN IF NOT EXISTS data_ultima_sincronizacao TIMESTAMP;
ALTER TABLE mural.usuario ADD COLUMN IF NOT EXISTS usuario_sincronizacao_id INTEGER;

ALTER TABLE mural.organizacao ADD COLUMN IF NOT EXISTS detalhes_ultima_sincronizacao TEXT;
ALTER TABLE mural.organizacao ADD COLUMN IF NOT EXISTS data_ultima_sincronizacao TIMESTAMP;
ALTER TABLE mural.organizacao ADD COLUMN IF NOT EXISTS usuario_sincronizacao_id INTEGER;
