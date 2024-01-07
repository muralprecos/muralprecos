This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Deploy

Check configs in docker-compose.yml file. Default target is production, but can be "dev" or "builder" (only generate the build files, without execute the server). You can change the exposed ports too, by default uses port number 3000.

```bash
docker compose up
docker build . -t ghcr.io/ttsolutionspi/docker-images/painel-precos-frontend:latest --target production
docker push ghcr.io/ttsolutionspi/docker-images/painel-precos-frontend:latest
```

## Development Without CORS

To run project localhost and don't get CORS error, execute this command on terminal:

open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security


## List of Icons

- https://www.svgrepo.com/collection/solar-linear-icons/
- https://www.svgrepo.com/collection/solar-bold-icons/
- https://www.svgrepo.com/collection/solar-outline-icons/


## Important DOCs:

Flex Layout Aux:
- https://angrytools.com/css-flex/
- https://flexbox.tech/
- https://www.cssportal.com/css-flexbox-generator/
- https://tobiasahlin.com/blog/common-flexbox-patterns/

Create Theme NextUI
- https://nextui.org/docs/customization/create-theme

Getting started with new NextUI:
- https://blog.logrocket.com/getting-started-nextui-next-js/

Customizing tailwind-css with react:
- https://blog.logrocket.com/theming-react-components-tailwind-css/



### TODO Work:

https://michaelangelo-io.medium.com/better-logging-with-nextjs-app-directory-60a07c96d146
https://github.com/pinojs/pino
https://github.com/michaelangeloio/michaelangelo.io/blob/main/lib/logger.ts

- Carrinho de visualização integrado para remover do carrinho;

- Adicionar rodapé com versão; (atualizar o popover de usuário)

- Request com signal;

- Resolver hints;

- Criar CI/CD;

- Integrar com REDUX:
	- Manter campos de busca ao realizar cotação;
	- Realizar paginação necessita dos parâmetros buscados também;
	- Apresentar filtros buscados;
	- Alterar tabs para breadcrumbs;

- Carrinho:
	- Adicionar componente modal ao limpar carrinho;
	- Adicionar verificação isloading;

- Evitar o lazy loading de itens (por exemplo, header verificando carrinho e logado);

- Histórico de cotações;

- Tela de cadastro de usuário;

- Adicionar rodapé com referência à TT e versão do sistema;

V1.1

- Estudo: https://nextjs.org/docs/app/building-your-application/caching

- rever oq pode ter renderização no servidor: https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns

- revisar formulário: https://www.youtube.com/watch?v=dDpZfOQBMaU&t=5s&ab_channel=LeeRobinson

- verificar padrão adotado para requisições com type: https://douglasmoura.dev/en-US/using-fetch-with-typescript


# Aprimoramentos Front:

- Nome/Código Material -> apresentar nome e código na listagem do autocomplete;

- Orgao (caso superior seja selecionado, filtrar os menores por ele)
	http://muraldeprecos.com/api/v1/orgaos/dfd49cc0-4f86-11ee-8095-0242ac120003/suborgaos?page=0&size=50

- Verificar TODOs

- Botão de carrinho do detalhe do item condicional para add/remove;


# Aprimoramentos Back:

- Retornar textos de descrição como setlist (descrição complementar, objeto, etc) para não retornar textos iguais;


+++++++++++
-Identificar quais dados devem ser apresentados na listagem do itens de compra bem como no detalhamento do item;
-[BACKLOG-V1] Implementar relatório de cotação;
-[BACKLOG-V1] Implementar endpoint de finalização de cotação;
-[BACKLOG-V2] No endpoint de unidades-federativas, criar parâmetro top10=true, para carregar os top 10 munícipios (que possuem mais licitações no estado) quando se selecionar um estado.

Print de tela de exemplo:
https://github.com/orgs/TTSolutionsPI/projects/1?pane=issue&itemId=33720481