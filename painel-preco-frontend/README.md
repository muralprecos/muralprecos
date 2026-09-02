# Pricing Panel V2.0

Este projeto é um painel de precificação desenvolvido para facilitar a gestão e visualização de preços de produtos ou serviços. O objetivo é fornecer uma interface intuitiva para atualização, consulta e análise de preços, integrando-se facilmente com outros sistemas da empresa.

## Funcionalidades

- Visualização de preços atuais
- Atualização de preços em tempo real
- Histórico de alterações de preços
- Filtros e busca por produto ou categoria
- Integração com sistemas externos via API

## Estrutura do Projeto

```
pricing-panel/
├── public/                 # Arquivos estáticos (imagens, favicon, etc.)
├── src/
│   ├── components/         # Componentes reutilizáveis da interface
│   ├── pages/              # Páginas principais da aplicação
│   ├── services/           # Serviços de integração (APIs, etc.)
│   ├── hooks/              # Hooks customizados
│   ├── utils/              # Funções utilitárias
│   ├── App.js              # Componente principal da aplicação
│   └── index.js            # Ponto de entrada da aplicação
├── package.json            # Dependências e scripts do projeto
└── README.md               # Documentação do projeto
```

## Como Executar

1. Instale as dependências:

```bash
npm install
```

2. Inicie o projeto:

```bash
npm run dev
```

Para sinalizar o ambiente na interface, use `NEXT_PUBLIC_APP_ENV`:

```bash
NEXT_PUBLIC_APP_ENV=development npm run dev
```

Ou com docker:

```bash
docker compose -f docker-compose.dev.yml up
```

Forçar recriar com docker:

```bash
docker compose -f docker-compose.dev.yml down -v && docker compose -f docker-compose.dev.yml up
```

## Ambientes

O projeto diferencia o ambiente exibido na interface por meio da variável `NEXT_PUBLIC_APP_ENV`.

| Uso | NODE_ENV | NEXT_PUBLIC_APP_ENV | Comportamento |
| --- | --- | --- | --- |
| Desenvolvimento local | `development` | `development` | Exibe aviso no login e selo `dev` no cabeçalho |
| Homologação | `production` | `homolog` | Mantém comportamento de produção e exibe aviso no login e selo `hmg` |
| Produção | `production` | `production` | Sem aviso e sem selo adicional |

### Google Analytics (GA4)

O rastreamento via Google Analytics (GA4) é integrado via `@next/third-parties/google` no `RootLayout`. O ID de medição é lido dinamicamente da variável de ambiente de servidor `GA_MEASUREMENT_ID`:

1. **No `.env` local ou Portainer (Runtime):** Defina `GA_MEASUREMENT_ID=G-XXXXXXXXXX`. Por ser lido em servidor Node.js (Server Component), alterações entram em vigor imediatamente ao reiniciar o contêiner, sem necessidade de recompilar o bundle.
2. **No CI/CD (GitHub Actions):**
   - **Homologação (`.github/workflows/homolog.yml`):** Injeta `GA_MEASUREMENT_ID=${{ vars.GA_MEASUREMENT_ID_HMG }}`.
   - **Produção (`.github/workflows/main.yml`):** Injeta `GA_MEASUREMENT_ID=${{ vars.GA_MEASUREMENT_ID_PROD }}`.

Caso a variável `GA_MEASUREMENT_ID` não esteja definida, o script do Google Analytics não é carregado no cliente.

`NODE_ENV` deve permanecer com valores padrão do Next.js (`development` ou `production`). Não use `NODE_ENV=homolog`, pois isso altera a semântica do framework e faria o projeto tratar a sessão como não-produtiva.

Exemplo de build local para homologação:

```bash
NEXT_PUBLIC_APP_ENV=homolog GA_MEASUREMENT_ID=G-HOMOLOG123 npm run build
```

## Deploy

Check configs in docker-compose.yml file. Default target is production, but can be "dev" or "builder" (only generate the build files, without execute the server). You can change the exposed ports too, by default uses port number 3000.

```bash
docker build . -t painel-precos-frontend-local:latest
docker build . -t ghcr.io/ttsolutionspi/painel-precos-frontend:latest
docker push ghcr.io/ttsolutionspi/painel-precos-frontend:latest
docker-compose up
```

Para gerar uma imagem homolog localmente:

```bash
docker build --build-arg NEXT_PUBLIC_APP_ENV=homolog -t painel-precos-frontend-homolog:latest .
```

## Development Without CORS

To run project localhost and don't get CORS error, execute this command on terminal:

open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security

Execute Chrome with CORS:

Mac: open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/Users/matheuscampanha/Documents/chrome_files/chrome_dev_test" --disable-web-security
Linux: google-chrome --disable-web-security --user-data-dir="/tmp/"
