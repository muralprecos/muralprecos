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



## TODO:

- verificar padrão adotado pelo projeto https://github.com/wangly19/nextui-design-pro/blob/main/app/next/views/login/form.tsx

- Integrar com REDUX (possibilita carregar dados e migrar entre páginas sem ter que refazer a requisição) 
	https://redux.js.org/usage/nextjs;

- Alterar tabs para breadcrumbs;

- Aprimoramentos de layout:
	- Ao realizar busca, não apagar os campos;
	- Apresentar filtros buscados;

- Adicionar itens de licitação para um carrinho;
	https://nextui.org/docs/components/badge
	https://nextui.org/docs/components/table#async-pagination

- Listar itens no carrinho para finalizar cotação;

- Na listagem de itens de licitação, adicionar um componente de paginação para retornar novos itens;


- Histórico de cotações;

- Tela de Login (e informação de login na área superior da tela)
	https://nextui.org/docs/components/avatar
	https://nextui.org/docs/components/popover


# Aprimoramentos Front:

- Nome/Código Material -> apresentar nome e código na listagem do autocomplete;

- Orgao (caso superior seja selecionado, filtrar os menores por ele)
	http://muraldeprecos.com/api/v1/orgaos/dfd49cc0-4f86-11ee-8095-0242ac120003/suborgaos?page=0&size=50

- Verificar TODOs



# Aprimoramentos Back:

- Filtrar textos de descrição, descrição complementar e objeto para não retornar textos iguais;

+++++++++++
-Identificar quais dados devem ser apresentados na listagem do itens de compra bem como no detalhamento do item;
-[BACKLOG-V1] Implementar relatório de cotação;
-[BACKLOG-V1] Implementar endpoint de finalização de cotação;
-[BACKLOG-V2] No endpoint de unidades-federativas, criar parâmetro top10=true, para carregar os top 10 munícipios (que possuem mais licitações no estado) quando se selecionar um estado.

Print de tela de exemplo:
https://github.com/orgs/TTSolutionsPI/projects/1?pane=issue&itemId=33720481