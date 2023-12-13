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
# configurar o https://react-hook-form.com/get-started 
# configurar o envio de formulários;
# a partir dos parâmetros do formulário, verificamos a melhor forma de integrar o autocomplete aninhado
# verificar padrão adotado pelo projeto https://github.com/wangly19/nextui-design-pro/blob/main/app/next/views/login/form.tsx


- Orgao (caso superior seja selecionado, filtrar os menores por ele)
	http://muraldeprecos.com/api/v1/orgaos/dfd49cc0-4f86-11ee-8095-0242ac120003/suborgaos?page=0&size=50

- Filtro de Busca				tela
	http://muraldeprecos.com/api/v1/itens-licitacao?page=0&size=10&ano=2014&objeto=caneca&orgaoSuperiorId=dfd49cc0-4f86-11ee-8095-0242ac120003&orgaoId=dfd9cb00-4f86-11ee-8095-0242ac120003&ugId=1219baf0-4f49-11ee-8580-0242ac120003&modalidadeCompraId=af19387e-4f23-11ee-8580-0242ac120003&periodoCompraId=181&formaCompraId=74640e76-5288-11ee-bb72-0242ac120003&esferaId=d821480c-5288-11ee-bb72-0242ac120003&descricao=IMPRESSAO%20ELETRONICA%20-%20LASER%20/%20JATO%20TINTA&descricaoComplementar=Impress%C3%A3o%20em%20Canecas%20eco%20sustent%C3%A1vel%20com%20a%20referida%20caneca%20inclusa%20destinada%20%C3%A0%20realiza%C3%A7%C3%A3o%20do%20XX%20International%20Otter%20Congress%20no%20per%C3%ADodo%20de%2011%20a%2017%20de%20agosto%20do%20corrente%20ano.&materialId=76b5a082-74ba-11ee-87d4-0242ac110002&porteFornecedor=c0c84a38-5289-11ee-bb72-0242ac120003&fornecedorId=139df19e-5268-11ee-9eb3-0242ac120003



# Pendente de Aprimoramentos:

- Cidade: (aninhado com estado)	autocomplete * texto
	https://muraldeprecos.com/api/v1/unidades-federativas/e1b494b4-4f86-11ee-8095-0242ac120003/municipios?page=0&size=20&nome=salv
		- Filtrar por nome do municipio

++++ Ano, Objeto e Descrição -> { nome }
- Ano Compra 		alterar para padrão uuid / nome (atualmente está "ano")
	http://muraldeprecos.com/api/v1/anos-compra?ano=2017&page=0&size=2
- Objeto da Compra, 				autocomplete * texto
	http://muraldeprecos.com/api/v1/licitacoes?page=0&size=10&objeto=limpeza
- Descrição do Item, 				autocomplete * texto
	http://muraldeprecos.com/api/v1/itens-licitacao?page=0&size=10&descricao=deter
- Descrição Complementar 	autocomplete * texto
	http://muraldeprecos.com/api/v1/itens-licitacao?page=0&size=10&descricaoComplementar=deter


# Prox Passos:

- Tela de Login 				tela

- Adicionar itens de licitação para um carrinho;

- Listar itens no carrinho para finalizar cotação;

- Histórico de cotações;


###### Aprimoramentos:
- 




######
- Exemplo de busca para apresentar parte dos dados
http://muraldeprecos.com/api/v1/itens-licitacao?page=0&size=10&descricaoComplementar=deter&fields=content[descricao,unidadeFornecimento]





+++++++++++
-[OK] No endpoint de anos-compra substituir "ano" por "nome";
	http://muraldeprecos.com/api/v1/anos-compra?ano=2017&page=0&size=2

-[OK] No endpoint unidades-federativas, atualizar o nome, pois está repetindo a sigla; e retirar o estado -3;
	-O estado -3 não pode ser retirado, pois existem licitações em município "Inválido". Assim, alteramos o nome/sigla de "-3" para "Não informado" e sigla para "NI";
	-Oportunamente, forçamos ordenação por nome.
	
	http://muraldeprecos.com/api/v1/unidades-federativas
	
-[OK] No endpoint de unidades-federativas está filtrando pelo Estado, mas ignorando a filtragem pelo nome do município.
	http://muraldeprecos.com/api/v1/unidades-federativas/e1b49932-4f86-11ee-8095-0242ac120003/municipios?nome=pa&page=0&size=20
	
-[OK] Alterar os endpoints de objeto, descricao e descricao complementar para retornar apenas o respectivo atributo com o label "nome".
	-No JSON o atributo "superior" foi suprimido, para evitar referência cíclica.
	http://muraldeprecos.com/api/v1/licitacoes?page=0&size=10&objeto=limpeza&only=true
	http://muraldeprecos.com/api/v1/itens-licitacao?page=0&size=10&descricao=limpeza&only=true
	http://muraldeprecos.com/api/v1/itens-licitacao?page=0&size=10&descricaoComplementar=limpeza&only=true

-[OK] Na pesquisa de licitação não está filtrando por UF e município;
	-Checar filtro pela UF e Município.
	
	http://muraldeprecos.com/api/v1/itens-licitacao? page=0&size=10&ano=2014&objeto=caneca&orgaoSuperiorId=dfd49cc0-4f86-11ee-8095-0242ac120003&orgaoId=dfd9cb00-4f86-11ee-8095-0242ac120003&ugId=1219baf0-4f49-11ee-8580-0242ac120003&modalidadeCompraId=af19387e-4f23-11ee-8580-0242ac120003&periodoCompraId=181&formaCompraId=74640e76-5288-11ee-bb72-0242ac120003&esferaId=d821480c-5288-11ee-bb72-0242ac120003&descricao=IMPRESSAO ELETRONICA - LASER / JATO TINTA&descricaoComplementar=Impressão em Canecas eco sustentável com a referida caneca inclusa destinada à realização do XX International Otter Congress no período de 11 a 17 de agosto do corrente ano.&materialId=76b5a082-74ba-11ee-87d4-0242ac110002&porteFornecedor=c0c84a38-5289-11ee-bb72-0242ac120003&fornecedorId=139df19e-5268-11ee-9eb3-0242ac120003&ufId=e1b499be-4f86-11ee-8095-0242ac120003&municipioId=e6a509bc-5266-11ee-9eb3-0242ac120003

	http://muraldeprecos.com/api/v1/licitacoes?page=0&size=10&ano=2014&objeto=caneca&orgaoSuperiorId=dfd49cc0-4f86-11ee-8095-0242ac120003&orgaoId=dfd9cb00-4f86-11ee-8095-0242ac120003&ugId=1219baf0-4f49-11ee-8580-0242ac120003&modalidadeCompraId=af19387e-4f23-11ee-8580-0242ac120003&periodoCompraId=181&formaCompraId=74640e76-5288-11ee-bb72-0242ac120003&esferaId=d821480c-5288-11ee-bb72-0242ac120003&descricao=IMPRESSAO ELETRONICA - LASER / JATO TINTA&descricaoComplementar=Impressão em Canecas eco sustentável com a referida caneca inclusa destinada à realização do XX International Otter Congress no período de 11 a 17 de agosto do corrente ano.&materialId=76b5a082-74ba-11ee-87d4-0242ac110002&porteFornecedor=c0c84a38-5289-11ee-bb72-0242ac120003&fornecedorId=139df19e-5268-11ee-9eb3-0242ac120003&ufId=e1b499be-4f86-11ee-8095-0242ac120003&municipioId=e6a509bc-5266-11ee-9eb3-0242ac120003

-[OK] Implementar endpoint de detalhamento do item de compra;
	http://muraldeprecos.com/api/v1/itens-licitacao/1ab3be84-9924-11ee-96b8-0242ac140002

-Identificar quais dados devem ser apresentados na listagem do itens de compra bem como no detalhamento do item;
	https://muraldeprecos.com/api/v1/itens-licitacao?%20page=0&size=10&ano=2014&objeto=caneca&orgaoSuperiorId=dfd49cc0-4f86-11ee-8095-0242ac120003&orgaoId=dfd9cb00-4f86-11ee-8095-0242ac120003&ugId=1219baf0-4f49-11ee-8580-0242ac120003&modalidadeCompraId=af19387e-4f23-11ee-8580-0242ac120003&periodoCompraId=181&formaCompraId=74640e76-5288-11ee-bb72-0242ac120003&esferaId=d821480c-5288-11ee-bb72-0242ac120003&descricao=IMPRESSAO%20ELETRONICA%20-%20LASER%20/%20JATO%20TINTA&descricaoComplementar=Impress%C3%A3o%20em%20Canecas%20eco%20sustent%C3%A1vel%20com%20a%20referida%20caneca%20inclusa%20destinada%20%C3%A0%20realiza%C3%A7%C3%A3o%20do%20XX%20International%20Otter%20Congress%20no%20per%C3%ADodo%20de%2011%20a%2017%20de%20agosto%20do%20corrente%20ano.&materialId=76b5a082-74ba-11ee-87d4-0242ac110002&porteFornecedor=c0c84a38-5289-11ee-bb72-0242ac120003&fornecedorId=139df19e-5268-11ee-9eb3-0242ac120003&ufId=e1b499be-4f86-11ee-8095-0242ac120003&municipioId=e6a509bc-5266-11ee-9eb3-0242ac120003&fields=content[descricao,quantidade,valor,licitacao.municipio.uf.sigla,licitacao.dataResultadoCompra]
	
	-[BACKLOG-V1] Implementar relatório de cotação;
-[BACKLOG-V1] Implementar endpoint de finalização de cotação;
-[BACKLOG-V2] No endpoint de unidades-federativas, criar parâmetro top10=true, para carregar os top 10 munícipios (que possuem mais licitações no estado) quando se selecionar um estado.



Print de tela de exemplo:
https://github.com/orgs/TTSolutionsPI/projects/1?pane=issue&itemId=33720481