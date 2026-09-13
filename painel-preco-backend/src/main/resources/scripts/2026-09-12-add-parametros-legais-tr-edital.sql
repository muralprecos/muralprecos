-- Parâmetros jurídicos do TR/Edital que hoje não têm campo no intake e por
-- isso aparecem sempre como "[A SER PREENCHIDO PELO ÓRGÃO]" no documento
-- gerado, mesmo com o processo totalmente preenchido. Todos opcionais.
ALTER TABLE mural.processo_contratacao
    ADD COLUMN IF NOT EXISTS local_execucao_servicos VARCHAR(255),
    ADD COLUMN IF NOT EXISTS horario_execucao_servicos VARCHAR(255),
    ADD COLUMN IF NOT EXISTS prazo_inicio_execucao_dias INTEGER,
    ADD COLUMN IF NOT EXISTS marco_inicio_execucao VARCHAR(30),
    ADD COLUMN IF NOT EXISTS prazo_recebimento_provisorio_dias INTEGER,
    ADD COLUMN IF NOT EXISTS prazo_recebimento_definitivo_dias INTEGER,
    ADD COLUMN IF NOT EXISTS prazo_pagamento_dias INTEGER,
    ADD COLUMN IF NOT EXISTS exige_garantia_contratual BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS percentual_garantia_contratual NUMERIC(5,2),
    ADD COLUMN IF NOT EXISTS garantia_servico_descricao TEXT,
    ADD COLUMN IF NOT EXISTS permite_subcontratacao BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS percentual_maximo_subcontratacao NUMERIC(5,2),
    ADD COLUMN IF NOT EXISTS exige_uniforme BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS especificacao_uniforme TEXT,
    ADD COLUMN IF NOT EXISTS indice_reajuste VARCHAR(50),
    ADD COLUMN IF NOT EXISTS periodicidade_reajuste_meses INTEGER,
    ADD COLUMN IF NOT EXISTS percentual_multa_moratoria NUMERIC(5,2),
    ADD COLUMN IF NOT EXISTS percentual_multa_compensatoria NUMERIC(5,2),
    ADD COLUMN IF NOT EXISTS prazo_assinatura_contrato_dias_uteis INTEGER,
    ADD COLUMN IF NOT EXISTS prazo_validade_proposta_dias INTEGER,
    ADD COLUMN IF NOT EXISTS intervalo_minimo_lances VARCHAR(100),
    ADD COLUMN IF NOT EXISTS meio_impugnacao_esclarecimento VARCHAR(255);
