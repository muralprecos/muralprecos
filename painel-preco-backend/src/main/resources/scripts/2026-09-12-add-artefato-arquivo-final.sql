-- Versão final do artefato, enviada manualmente pelo usuário (ex.: depois de revisar/editar
-- o rascunho gerado no Word). Mantida lado a lado com o docx gerado pelo sistema: colunas
-- novas, não substitui nada existente.
ALTER TABLE mural.artefato_gerado
    ADD COLUMN IF NOT EXISTS nome_arquivo_final VARCHAR(255),
    ADD COLUMN IF NOT EXISTS docx_final OID,
    ADD COLUMN IF NOT EXISTS final_enviado_em TIMESTAMP,
    ADD COLUMN IF NOT EXISTS final_enviado_por INTEGER REFERENCES mural.usuario(id_usuario);
