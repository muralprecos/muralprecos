CREATE TABLE IF NOT EXISTS mural.ata_registro_preco (
    id_ata_registro_preco BIGSERIAL PRIMARY KEY,
    uuid                  UUID DEFAULT gen_random_uuid(),
    numero_ata            INTEGER,
    ano                   INTEGER,
    sequencial            INTEGER,
    numero_controle_pncp  VARCHAR(50) UNIQUE,
    data_assinatura       TIMESTAMP,
    data_vigencia_inicio  TIMESTAMP,
    data_vigencia_fim     TIMESTAMP,
    situacao_id           INTEGER,
    situacao_nome         VARCHAR(100),
    licitacao_id          BIGINT REFERENCES mural.licitacao(id_licitacao)
);

CREATE INDEX IF NOT EXISTS idx_ata_licitacao_id
    ON mural.ata_registro_preco (licitacao_id);

-- Índice para filtrar atas ativas no dashboard (vigenciaFim >= hoje)
CREATE INDEX IF NOT EXISTS idx_ata_vigencia_fim
    ON mural.ata_registro_preco (data_vigencia_fim);
