-- Cooldown de retry para itens sem fornecedor resolvido: item que falhou/não resolveu hoje
-- não é reprocessado até o próximo dia (ALTER TABLE sem default é metadata-only, seguro em tabela grande).
ALTER TABLE mural.item_licitacao ADD COLUMN IF NOT EXISTS ultima_tentativa_fornecedor TIMESTAMP NULL;

-- Marca corretamente quando uma licitação teve TODAS as suas atas e itens de ata processados,
-- corrigindo o bug de conclusão parcial (antes, qualquer ata existente já marcava a licitação como concluída).
ALTER TABLE mural.licitacao ADD COLUMN IF NOT EXISTS atas_completo_em TIMESTAMP NULL;

-- Backfill: considera concluído o que já foi processado historicamente (não repara
-- retroativamente eventuais casos de conclusão parcial pré-existentes).
UPDATE mural.licitacao l SET atas_completo_em = NOW()
WHERE atas_completo_em IS NULL
  AND EXISTS (SELECT 1 FROM mural.ata_registro_preco a WHERE a.licitacao_id = l.id_licitacao);
