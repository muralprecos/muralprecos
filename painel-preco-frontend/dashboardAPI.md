# **Documentação da API – Painel de Preços**

## **Autenticação**

### **POST `/auth/logon`**

Obtém o token de acesso da aplicação.

**Parâmetros (body):**

```json
{
  "client_id": "mural-preco",
  "client_secret": "XPTO",
  "grant_type": "password",
  "username": "[EMAIL_ADDRESS]",
  "password": "[PASSWORD]"
}
```

**Retorno esperado:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Uso na Dashboard:**

- Necessário para autenticar todas as chamadas subsequentes (`Authorization: Bearer <token>`).

---

## **Esfera**

### **GET `/esferas`**

Lista os tipos de esferas administrativas (federal, estadual, municipal, etc.).

**Retorno (exemplo):**

```json
[
  { "id": "1", "nome": "Federal" },
  { "id": "2", "nome": "Estadual" }
]
```

**Uso na Dashboard:**

- Preencher filtros por esfera de licitação.

---

## **Unidade de Fornecimento**

### **GET `/unidades-fornecimento?nome=litro`**

Busca unidades de fornecimento filtradas por nome.

**Retorno (exemplo):**

```json
[
  { "id": "abc", "nome": "Litro" },
  { "id": "def", "nome": "Metro" }
]
```

**Uso na Dashboard:**

- População de dropdowns em telas de pesquisa.

---

## **Fornecedores**

### **GET `/fornecedores?page=0&size=10`**

Lista fornecedores paginados.

**Retorno (exemplo):**

```json
{
  "content": [
    { "id": "f1", "nome": "Fornecedor A", "cnpj": "00.000.000/0001-00" },
    { "id": "f2", "nome": "Fornecedor B", "cnpj": "00.000.000/0002-00" }
  ],
  "totalElements": 100
}
```

**Uso na Dashboard:**

- Mostrar ranking de fornecedores com maior número de licitações.

---

## **Licitação**

### **GET `/licitacoes?page=0&size=10&ufId=<id>`**

Lista licitações com filtros.

**Retorno (exemplo):**

```json
{
  "content": [
    {
      "numero": "12345",
      "objeto": "Serviços de Limpeza",
      "unidadeGestora": "Ministério X",
      "valorTotal": 150000,
      "dataAbertura": "2025-06-10"
    }
  ],
  "totalPages": 5
}
```

**Uso na Dashboard:**

- **KPIs:** Número de licitações por mês.
- **Tabela:** Últimas licitações abertas.

---

## **Materiais**

### **GET `/materiais?page=0&size=50`**

Lista os materiais cadastrados.

**Retorno (exemplo):**

```json
{
  "content": [
    { "id": "m1", "nome": "Papel A4" },
    { "id": "m2", "nome": "Tinta Laser" }
  ]
}
```

**Uso na Dashboard:**

- Exibir categorias de itens mais cotados.

---

## **Itens de Licitação**

### **GET `/itens-licitacao?page=0&size=20&descricao=papel`**

Busca itens de licitação por descrição.

**Retorno (exemplo):**

```json
{
  "content": [
    {
      "id": "i1",
      "descricao": "Papel A4",
      "quantidade": 500,
      "valorUnitario": 0.5,
      "valorTotal": 250
    }
  ]
}
```

**Uso na Dashboard:**

- Mostrar os **itens com maior volume de compras**.
- Calcular médias de preços.

---

## **Cotação**

### **POST `/cotacoes`**

Gera uma nova cotação com lista de itens.

**Body:**

```json
{
  "itens": ["item-id-1", "item-id-2"]
}
```

**Retorno (exemplo):**

```json
{
  "id": "c123",
  "hashValidacao": "31a70add8daefc5ec49c704b619c6424",
  "valorTotal": 3200.5,
  "data": "2025-07-18"
}
```

### **GET `/cotacoes?page=0&size=20`**

Lista cotações já realizadas.

**Retorno (exemplo):**

```json
{
  "content": [
    { "id": "c1", "valorTotal": 1200, "data": "2025-06-01" },
    { "id": "c2", "valorTotal": 300, "data": "2025-06-02" }
  ]
}
```

**Uso na Dashboard:**

- Mostrar histórico de cotações (gráfico de evolução de valores).
- Validar cotações via hash.

---

## **Órgãos e Unidades Gestoras**

### **GET `/orgaos?nome=ministerio`**

Lista órgãos superiores filtrados por nome.

**GET `/unidades-gestoras?nome=universidade`**
Lista unidades gestoras.

**Retorno (exemplo):**

```json
[
  { "id": "o1", "nome": "Ministério da Saúde" },
  { "id": "o2", "nome": "Universidade Federal X" }
]
```

**Uso na Dashboard:**

- Filtro por órgão/unidade em relatórios.

---

# **Como Usar na Dashboard**

Com base nos endpoints, você pode criar:

### **KPIs Principais**

- **Total de licitações do mês:** `/licitacoes` com filtro de data.
- **Total de cotações geradas:** `/cotacoes`.
- **Valor médio por cotação:** calcular a média de `valorTotal` das cotações.

### **Gráficos**

- **Evolução do número de licitações por mês:** `/licitacoes` agrupado por data.
- **Top 5 fornecedores:** `/fornecedores` com ordenação.

### **Widgets**

- **Últimas cotações realizadas:** `/cotacoes`.
- **Itens mais cotados:** `/itens-licitacao`.
