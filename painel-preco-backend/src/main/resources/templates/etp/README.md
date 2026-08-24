# Modelo de Estudo Técnico Preliminar (autoral)

A AGU não publica modelo `.docx` de ETP (esse estágio é tratado pelo ETP
Digital, sistema federal em compras.gov.br, fora do escopo deste projeto).
`etp-base.docx` foi construído por nós a partir da estrutura padrão de 14
tópicos já consolidada na administração pública federal (baseada na
IN SEGES/ME nº 58/2022 e sucessoras — guia regulatório público, não
proprietário de nenhum órgão específico).

Tokens usados:
- `{{FACTS:CHAVE}}` — preenchimento determinístico (objeto, itens, valor).
- `{{DRAFT:CHAVE}}` — redação restrita por IA: a IA escreve o texto, mas
  só com base nos fatos fornecidos explicitamente; nunca inventa dado
  ausente (nesse caso, escreve literalmente `[A SER PREENCHIDO PELO ÓRGÃO]`).
  Ver `domain/service/docx/DocxNarrativeDraftService`.

Tópicos com redação por IA: 1 (necessidade), 5 (levantamento de mercado),
6 (descrição da solução), 8 (parcelamento), 11 (resultados pretendidos),
14 (posicionamento conclusivo). Os demais tópicos são preenchimento
determinístico ou texto procedimental fixo (ex.: PCA, impactos
ambientais) — ver o próprio `etp-base.docx` para o texto exato.
