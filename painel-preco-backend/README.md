# Painel de Preços API:

API do Painel de Preço da [TT Soluções PI](ttsolucoes.com).

<p align="center">
	<img src="http://img.shields.io/static/v1?label=STATUS&message=EM%20DESENVOLVIMENTO&color=GREEN&style=for-the-badge"/>
</p>

## Como executar (ambiente de desenvolvimento)?

### Pré-requisitos:

Ter o **Docker** e **Docker-compose** instalado na máquina. Segue link de instruções oficiais de instalação: [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/).

### 1. Clone o projeto:

Clone o projeto por meio do comando abaixo:

```shell
git clone git@github.com:TTSolutionsPI/painel-preco-backend.git
```
### 2. Configfure as variáves de ambiente:

Abra o arquivo **.env** localizado na raíz do projeto (observar que esse arquivo é oculto) e substitua o IP da propriedade **SSO_AUTH_SERVER** para o endereço local da sua máquina;

### 3. Crie um Personal access tokens no Github:

Caso ainda não tenha, crie um **Personal access tokens (classic)** no **Github**, para que seja possível se autenticar, via **docker**, para baixar a imagem *docker* do **Painel de Preço** do *GitHub Container Registry* [(ghcr.io)](ghcr.io). Se for o caso, para isso, acesse as [configurações de desenvolvedor](https://github.com/settings/tokens), clique em **Personal access tokens** > **Tokens (classic)**, gere um *token* e copie seu conteúdo.

No terminal, digite:

```shell
docker login ghcr.io
```

Forneça seu **usuário do Github** e, em **password**, cole o **token** gerado nos passos acima.

Se receber a mensagem *Login Succeeded* é sinal que deu tudo certo.


### 4. Crie o volume ("partição virtual") de dados que será utilizado pelo *PostgreSQL*:

Esse passo é necessário para não perdemos os dados sempre que pararmos o *container*. Segue o comando suficiente para isso:

```shell
docker volume create postgres
```

### 5. Suba o serviço:

Na raíz do projeto, executo os comando abaixo:

```shell
docker-compose up
```

**OBS1:** esse comando é o comando que executa o serviço. Assim, é necessário executado sempre que reiniciar o computador.
**OBS2:** para executar em segundo plano, adicionar o parâmetro *-d* após o *up*, ficando como segue:

```shell
docker-compose up -d
```

### 6. Restaure o backup do banco:

Após a inicialização do serviço, apenas na primeira execução é necessário restaurar o backup do banco de dados e importar as configurações do **Keycloak** (serviço de autenticação e autorização que implementa [OpenID Connection e OAuth2](https://medium.com/semantixbr/oauth-2-openid-connect-c2429db6e996)). Isso pode ser feito por meio do comando abaixo:

```shell
docker exec -i painel-preco-backend_postgres_1 psql -U postgres painel_preco  < painel_preco.sql
```

**OBS:** o arquivo **painel_preco.sql** encontra-se no *zip* **backup.zip**. Clique [aqui](http://euclydesmelo.eti.br/backup.zip) para baixá-lo.

### 7. Resture as configurações de segurança:

Por fim, acesse o endereço [http://localhost:8280](http://localhost:8280), clique em *Administration Console* (usuário e senha: **admin**) e siga os passos apresentados em [Importing a Realm](https://howtodoinjava.com/devops/keycloak-export-import-realm/#2-importing-a-realm), para importar as configurações de segurança.

**OBS:** o arquivo backup das configurações (**ttsolutions-realm.json**) encontra-se no *zip* **backup.zip** já baixado no passo 6 (anterior).

### 8. Teste os *endpoints*:

Se chegou até aqui é para estar tudo certo. Então, vamos confirmar isso.

A documentação da API está disponível em: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html).

No *zip* **backup.zip** baixado no passo 6, tem o arquivo **Painel de Preços.postman_collection.json** com os *request* do **Postman** para a API.

De forma resumida, todos os *endpoints* estão protegidos, exigindo, pois, *token* de autenticação, exceto o *endpoint* de obtenção do *token*, qual seja: [http://localhost:8080/api/v1/auth/logon](http://localhost:8080/api/v1/auth/logon).

Por fim, listamos abaixo, os *requests* para todos os endpoints em linha de comando:

```shell
--AUTENTICAÇÃO

curl --location 'http://localhost:8080/api/v1/auth/logon' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'client_id=painel-preco' \
--data-urlencode 'client_secret=igppBRpGuISpN0Vgk86Ef2yQDTWGaH8G' \
--data-urlencode 'grant_type=password' \
--data-urlencode 'username=admin' \
--data-urlencode 'password=admin'
```

```shell
--ESFERA (Federal, Estadual ou Municipal)

curl --location 'http://localhost:8080/api/v1/esferas' \
--header 'Authorization: Bearer ACCESS_TOKEN'
```

```shell
--FORMAS DE COMPRA

curl --location 'http://localhost:8080/api/v1/formas-compra' \
--header 'Authorization: Bearer ACCESS_TOKEN'
```

```shell
--FORNECEDORES

curl --location 'http://localhost:8080/api/v1/fornecedores?page=1&size=10' \
--header 'Authorization: Bearer ACCESS_TOKEN'
```

```shell
--LICITAÇÃO

curl --location 'http://localhost:8080/api/v1/licitacoes?page=0&size=10&ano=2023&objeto=detergente&orgaoSuperiorId=dfd49cc0-4f86-11ee-8095-0242ac120003&orgaoId=dfd6d832-4f86-11ee-8095-0242ac120003&ugId=115715d6-4f49-11ee-8580-0242ac120003&modalidadeCompraId=af1939f0-4f23-11ee-8580-0242ac120003&periodoCompraId=181&descricao=ATADURA&fornecedorId=12ed47d6-5268-11ee-9eb3-0242ac120003' \
--header 'Authorization: Bearer ACCESS_TOKEN'
```

```shell
--MATERIAL

curl --location 'http://localhost:8080/api/v1/materiais?page=1&size=10' \
--header 'Authorization: Bearer ACCESS_TOKEN'
```

```shell
--MODALIDADE COMPRA

curl --location 'http://localhost:8080/api/v1/modalidades-compra' \
--header 'Authorization: Bearer ACCESS_TOKEN'
```

```shell
--PERÍODO COMPRA

curl --location 'http://localhost:8080/api/v1/periodos-compra' \
--header 'Authorization: Bearer ACCESS_TOKEN'
```

```shell
--PORTES DE FORNECEDOR

curl --location 'http://localhost:8080/api/v1/portes-fornecedor' \
--header 'Authorization: Bearer ACCESS_TOKEN'
```

```shell
--SITUAÇÃO LICITAÇÃO

curl --location 'http://localhost:8080/api/v1/situacoes-licitacao' \
--header 'Authorization: Bearer ACCESS_TOKEN'
```

```shell
--UNIDADE FEDERATIVA (UF)

curl --location 'http://localhost:8080/api/v1/unidades-federativas' \
--header 'Authorization: Bearer ACCESS_TOKEN'
```

```shell
--MUNICÍPIOS DE UMA UF

curl --location 'http://localhost:8080/api/v1/unidades-federativas/bead8df4-4c20-11ee-9954-0242ac120003/municipios?page=2&size=20' \
--header 'Authorization: Bearer ACCESS_TOKEN'
```

```shell
--UNIDADE GESTORA

curl --location 'http://localhost:8080/api/v1/unidades-gestoras?page=2&size=10' \
--header 'Authorization: Bearer ACCESS_TOKEN'
```

```shell
--ÓRGÃO

curl --location 'http://localhost:8080/api/v1/orgaos?page=2&size=50' \
--header 'Authorization: Bearer ACCESS_TOKEN'
```

```shell
--SUB ÓRGÃO

curl --location 'http://localhost:8080/api/v1/orgaos/5c9fc00a-4c16-11ee-9954-0242ac120003/suborgaos?page=2&size=50' \
--header 'Authorization: Bearer ACCESS_TOKEN'
```

**OBS:** algumns *endpoints* (listados abaixo) tem paginação que pode ser feita passando os parâmetros: **?page=1&size=20**.

* Fornecedor;
* Licitação;
* Material;
* Municípios de uma UF;
* Unidade Gestora;
* Órgão (e sub órgão).

## Documentação de Referência:

* [Docler basics commands](https://docs.docker.com/engine/reference/commandline/docker/);
* [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry);
* [GitHub Personal Access Tokens (APT)](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens);
* [OpenID Connections and Oauth2](https://medium.com/semantixbr/oauth-2-openid-connect-c2429db6e996).
