-- Tabela normalizada para situação do processo de compra (situacaoCompraId/situacaoCompraNome da API PNCP)
CREATE TABLE IF NOT EXISTS mural.situacao_compra (
    id_situacao_compra INTEGER PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

-- Adiciona FK em licitacao (populada pelo serviço de backfill via leitura dos JSONs)
ALTER TABLE mural.licitacao
    ADD COLUMN IF NOT EXISTS situacao_compra_id INTEGER;

ALTER TABLE mural.licitacao
    ADD CONSTRAINT fk_licitacao_situacao_compra
        FOREIGN KEY (situacao_compra_id) REFERENCES mural.situacao_compra(id_situacao_compra);

CREATE INDEX IF NOT EXISTS idx_licitacao_situacao_compra_id
    ON mural.licitacao(situacao_compra_id);
