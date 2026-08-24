-- Novo domínio: geração assistida por IA de ETP, Termo de Referência e Edital
-- a partir de uma cotação salva (mural.cotacao).

-- Pré-requisito: mural.cotacao hoje NÃO persiste os UUIDs dos itens pesquisados
-- (só um label truncado em string_busca) — sem isso, não há como montar o
-- snapshot de itens a partir de uma cotação já salva no histórico. Coluna
-- aditiva, nullable, sem impacto no fluxo Jasper/PDF existente.
ALTER TABLE mural.cotacao ADD COLUMN IF NOT EXISTS itens_uuid TEXT;

CREATE TABLE IF NOT EXISTS mural.processo_contratacao (
    id_processo_contratacao        SERIAL PRIMARY KEY,
    uuid                            UUID NOT NULL,
    cotacao_id                      INTEGER NOT NULL REFERENCES mural.cotacao(id_cotacao),
    objeto                          TEXT,
    justificativa_necessidade       TEXT,
    modalidade_pretendida           VARCHAR(30),
    criterio_julgamento             VARCHAR(30),
    regime_execucao                 VARCHAR(30),
    prazo_vigencia_meses            INTEGER,
    prazo_vigencia_fundamento_legal VARCHAR(30),
    tipo_objeto_continuo            BOOLEAN,
    orcamento_sigiloso              BOOLEAN NOT NULL DEFAULT FALSE,
    registro_precos                 BOOLEAN NOT NULL DEFAULT FALSE,
    dotacao_gestao_unidade          VARCHAR(255),
    dotacao_fonte_recursos          VARCHAR(255),
    dotacao_programa_trabalho       VARCHAR(255),
    dotacao_elemento_despesa        VARCHAR(255),
    dotacao_plano_interno           VARCHAR(255),
    dotacao_postergada              BOOLEAN NOT NULL DEFAULT FALSE,
    orgao_nome                      VARCHAR(255),
    orgao_cnpj                      VARCHAR(20),
    orgao_endereco                  VARCHAR(500),
    orgao_esfera                    VARCHAR(30),
    orgao_uasg                      VARCHAR(20),
    orgao_telefone                  VARCHAR(20),
    status                          VARCHAR(30) NOT NULL DEFAULT 'INTAKE',
    criado_por                      INTEGER NOT NULL REFERENCES mural.usuario(id_usuario),
    criado_em                       TIMESTAMP NOT NULL DEFAULT NOW(),
    atualizado_em                   TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_processo_contratacao_uuid ON mural.processo_contratacao(uuid);
CREATE INDEX IF NOT EXISTS idx_processo_contratacao_cotacao_id ON mural.processo_contratacao(cotacao_id);

-- Snapshot imutável dos itens pesquisados no momento da criação do processo
-- (item_licitacao_origem_uuid NÃO é FK: o snapshot precisa sobreviver a
-- mudanças futuras na linha de origem em mural.item_licitacao).
CREATE TABLE IF NOT EXISTS mural.item_processo_contratacao (
    id_item_processo_contratacao   SERIAL PRIMARY KEY,
    processo_contratacao_id        INTEGER NOT NULL REFERENCES mural.processo_contratacao(id_processo_contratacao) ON DELETE CASCADE,
    item_licitacao_origem_uuid     UUID,
    numero_item                    VARCHAR(10),
    descricao                      TEXT,
    descricao_complementar         TEXT,
    unidade_fornecimento           VARCHAR(100),
    quantidade                     BIGINT,
    valor_unitario                 NUMERIC(18,4),
    valor_total                    NUMERIC(18,4),
    fornecedor_nome                VARCHAR(255),
    fornecedor_documento           VARCHAR(20),
    licitacao_numero_pncp          VARCHAR(50),
    licitacao_modalidade           VARCHAR(100),
    licitacao_uf                   VARCHAR(2)
);
CREATE INDEX IF NOT EXISTS idx_item_processo_contratacao_processo_id ON mural.item_processo_contratacao(processo_contratacao_id);

-- Um registro por versão gerada (append-only — nunca sobrescreve; cada
-- "gerar novamente" cria uma nova linha com versao incrementada).
CREATE TABLE IF NOT EXISTS mural.artefato_gerado (
    id_artefato_gerado      SERIAL PRIMARY KEY,
    uuid                     UUID NOT NULL,
    processo_contratacao_id INTEGER NOT NULL REFERENCES mural.processo_contratacao(id_processo_contratacao) ON DELETE CASCADE,
    tipo                     VARCHAR(10) NOT NULL,
    versao                   INTEGER NOT NULL,
    status                   VARCHAR(20) NOT NULL DEFAULT 'RASCUNHO',
    nome_arquivo             VARCHAR(255),
    docx                     OID,
    modelo_base              VARCHAR(255),
    modelo_llm               VARCHAR(100),
    prompt_version           VARCHAR(50),
    gerado_em                TIMESTAMP NOT NULL DEFAULT NOW(),
    gerado_por               INTEGER REFERENCES mural.usuario(id_usuario),
    revisado_em              TIMESTAMP,
    revisado_por             INTEGER REFERENCES mural.usuario(id_usuario),
    UNIQUE (processo_contratacao_id, tipo, versao)
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_artefato_gerado_uuid ON mural.artefato_gerado(uuid);
CREATE INDEX IF NOT EXISTS idx_artefato_gerado_processo_id ON mural.artefato_gerado(processo_contratacao_id);

-- Auditoria por seção/token processado em cada geração.
CREATE TABLE IF NOT EXISTS mural.artefato_secao_log (
    id_artefato_secao_log   SERIAL PRIMARY KEY,
    artefato_gerado_id      INTEGER NOT NULL REFERENCES mural.artefato_gerado(id_artefato_gerado) ON DELETE CASCADE,
    secao_chave             VARCHAR(100) NOT NULL,
    origem                  VARCHAR(30) NOT NULL,
    clausula_selecionada    VARCHAR(100),
    facts_enviados          TEXT,
    resposta_bruta          TEXT,
    criado_em               TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_artefato_secao_log_artefato_id ON mural.artefato_secao_log(artefato_gerado_id);
