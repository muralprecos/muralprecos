-- Adiciona colunas ativo e data_criacao na tabela usuario
ALTER TABLE mural.usuario ADD COLUMN IF NOT EXISTS ativo BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE mural.usuario ADD COLUMN IF NOT EXISTS data_criacao TIMESTAMP;

-- Remove cnpj e numero da tabela organizacao (dados ficam apenas no Keycloak)
ALTER TABLE mural.organizacao DROP COLUMN IF EXISTS cnpj;
ALTER TABLE mural.organizacao DROP COLUMN IF EXISTS numero;
