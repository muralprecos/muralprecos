# Funcionalidades Gerais do Sistema

## 1. Autenticação e Autorização

- Login de usuários via NextAuth.
- Middleware para proteger rotas e garantir acesso apenas a usuários autorizados.
- Controle de sessão, roles e permissões.

## 2. Cotação de Itens de Licitação

- Tela para realizar cotações, com formulário dinâmico e filtros avançados:
  - Ano, porte da empresa, esfera, modalidade, período, situação, UF, município, órgão, fornecedor, material, unidade de fornecimento.
- Busca de itens de licitação com filtros detalhados.
- Listagem de itens encontrados, com possibilidade de adicionar ao carrinho.

## 3. Carrinho de Cotações

- Adição e remoção de itens ao carrinho.
- Visualização dos itens selecionados.
- Geração de relatório em PDF dos itens do carrinho.
- Limpeza total do carrinho com confirmação.

## 4. Validação de Cotações

- Tela para validar cotações por código/hash.
- Exibição de informações detalhadas da cotação validada, com opção de download do arquivo associado.

## 5. Detalhamento de Itens de Licitação

- Visualização detalhada de cada item, incluindo:
  - Informações gerais do item.
  - Dados da licitação (ano, data de abertura, resultado, processo, situação, valor).
  - Informações do fornecedor.
  - Links úteis relacionados ao item.

## 6. Filtros e Autocompletes

- Filtros por período, região, modalidade, tipo, etc.
- Autocomplete para municípios, órgãos, fornecedores, materiais, unidades gestoras e de fornecimento.
- Filtros pré-definidos (pessoal, institucional) e filtros mais usados.

## 7. Histórico e Listagem

- Listagem de cotações realizadas.
- Histórico de cotações com filtros por data, descrição, organização e usuário.
- Exibição dos filtros aplicados ao salvar histórico.

## 8. Integração com APIs

- Consumo de endpoints para esferas, unidades de fornecimento, fornecedores, licitações, materiais, órgãos, etc.
- Utilização de dados para popular dropdowns, autocompletes e filtros.

## 9. Outras Funcionalidades

- Mensagens de erro e feedback ao usuário (snackbar).
- Controle de loading e estados de requisição.
- Download de arquivos e relatórios.
- Proteção de rotas e tratamento de erros de autenticação.
