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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


Executar Chrome com CORS:
open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security

Icons:
https://www.svgrepo.com/collection/solar-linear-icons/
https://www.svgrepo.com/collection/solar-bold-icons/
https://www.svgrepo.com/collection/solar-outline-icons/

## TODO:
NavBar
https://nextui.org/docs/components/navbar

Forms Tailwind
https://tailwind-elements.com/docs/standard/forms/form-templates/

Flex Layout Aux:
https://angrytools.com/css-flex/
https://flexbox.tech/

Criar Thema NextUI
https://nextui.org/docs/customization/create-theme

Introdução de manipulação de estados com NextUI:
- https://blog.logrocket.com/getting-started-nextui-next-js/

Customização de tailwind com react:
- https://blog.logrocket.com/theming-react-components-tailwind-css/


## DOCUMENTAÇÕES IMPORTANTES:
https://nextui.org/docs/guide/introduction


## FERRAMENTAS / TUTORIAIS AUXILIARES:
https://www.cssportal.com/css-flexbox-generator/
https://tobiasahlin.com/blog/common-flexbox-patterns/


## TODO:
-- PROX ETAPAS:
OK Unidade de Fornecimento, 		autocomplete * texto
	http://muraldeprecos.com/api/v1/unidades-fornecimento?page=0&size=10&nome=litro
OK Nome do Material (PDM),		autocomplete * texto
OK Código Material,				autocomplete * texto
	- Nome do Material (PDM) (consulta com like pelo nome ou código no parametro nome)
	http://muraldeprecos.com/api/v1/materiais?size=10&page=0&nome=deter
	http://muraldeprecos.com/api/v1/materiais?size=10&page=0&nome=112011
OK UASG			autocomplete (nome)
	http://muraldeprecos.com/api/v1/unidades-gestoras?nome=universidade&page=0&size=10
OK Situação Licitação:	select (está com informações dos estados)
	http://muraldeprecos.com/api/v1/situacoes-licitacao
Ok Órgão		autocompete (nome + ehsuperior = true e all)
	http://muraldeprecos.com/api/v1/orgaos?nome=ministerio&ehSuperior=true&page=0&size=10


TODO:
- Estados:						autocomplete * texto
- Cidade: (aninhado com estado)	autocomplete * texto
- Objeto da Compra, 				autocomplete * texto
	http://muraldeprecos.com/api/v1/licitacoes?page=0&size=10&objeto=limpeza
- Descrição do Item, 				autocomplete * texto
	http://muraldeprecos.com/api/v1/itens-licitacao?page=0&size=10&descricao=deter
- Descrição Complementar 	autocomplete * texto
	http://muraldeprecos.com/api/v1/itens-licitacao?page=0&size=10&descricaoComplementar=deter
- Orgao (caso superior seja selecionado, filtrar os menores por ele)

- Filtro de Busca				tela
- Tela de Login 				tela




== MELHORIAS NO BACK
- Ano Compra 		alterar para padrão uuid / nome
	http://muraldeprecos.com/api/v1/anos-compra?ano=2017&page=0&size=2