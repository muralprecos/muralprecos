# Modelos oficiais da AGU

Baixados de https://www.gov.br/agu/pt-br/composicao/cgu/cgu/modelos/licitacoesecontratos/14133/pregao-e-concorrencia em 23/08/2026.

| Arquivo | Modelo original | Versão AGU |
|---|---|---|
| `tr-unico-agu.docx` | Termo de Referência único (compras, serviços e obras) | mai/2026 |
| `edital-agu.docx` | Edital Pregão e Concorrência — menor preço e maior desconto | nov/2025 |

Tokens `{{FACTS:CHAVE}}` (preenchimento determinístico) e `{{CLAUSE:CHAVE}}`
(seleção de cláusula por IA) foram inseridos manualmente nesses arquivos nos
pontos identificados na leitura da estrutura do documento — ver
`domain/service/docx/DocxTemplateEngine`. Ao atualizar para uma versão mais
recente da AGU, os tokens precisam ser reinseridos manualmente na nova versão.

## `edital-agu.docx` — grupos de cláusula "OU" resolvidos

Catálogo em `clausulas-edital.json`, seleção por `DocxClauseSelectionService.preencherClausulasEdital`:

- `DIVISAO_ITENS` (item 2 do Edital): apenas as alternativas "por item" e
  "item único" do modelo original foram mantidas — as alternativas de
  "grupo(s)"/lote(s) foram removidas do template porque este sistema não
  modela agrupamento de itens em lotes.
- `TRATAMENTO_ME_EPP` (item 11): concedido/não concedido, a partir do novo
  campo `ProcessoContratacao.tratamentoFavorecidoMeEpp` (default `true`,
  conforme a regra geral do art. 4º-I da Lei nº 14.133/2021).
- `ORCAMENTO_SIGILO` (item 20): reaproveita o mesmo campo booleano
  `orcamentoSigiloso` já usado no TR, com texto próprio do Edital.

Campos de cabeçalho (capa) preenchidos deterministicamente via
`{{FACTS:*}}`: `MODALIDADE_NOME`, `ORGAO_UASG`, `OBJETO`,
`VALOR_TOTAL_ESTIMADO`, `CRITERIO_JULGAMENTO_NOME`,
`TRATAMENTO_ME_EPP_SIM_NAO`, `ORGAO_NOME`, `ORGAO_ENDERECO`.

**Fora do escopo desta versão** (mantidos com os colchetes originais da AGU,
sem token): número do edital, data/hora da sessão pública, modo de disputa,
margem de preferência, e os dois grupos "OU" que exigem dado de dedicação
exclusiva de mão de obra (regime de tributação Simples Nacional e cota de
mulheres vítimas de violência doméstica) — nenhum desses é coletado no
intake atual de `ProcessoContratacao`.
