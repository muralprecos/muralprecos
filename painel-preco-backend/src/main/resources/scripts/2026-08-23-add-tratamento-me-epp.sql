ALTER TABLE mural.processo_contratacao
    ADD COLUMN IF NOT EXISTS tratamento_favorecido_me_epp BOOLEAN NOT NULL DEFAULT TRUE;
