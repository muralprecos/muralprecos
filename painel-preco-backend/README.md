
# Painel  de  Preços API:

  

API do Painel  de  Preço  da [TT Soluções PI](http://ttsolucoes.com).

  

<p align="center">

<img src="http://img.shields.io/static/v1?label=STATUS&message=EM%20DESENVOLVIMENTO&color=GREEN&style=for-the-badge"/>

</p>

  

## Como  executar (ambiente  de  desenvolvimento)?

  

### Pré-requisitos:

  

Ter o **Docker** e **Docker-compose**  instalado  na  máquina. Segue link de  instruções  oficiais  de  instalação: [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/).

Recomenda-se também o uso do STS (Spring Tool Suite) ou IntelliJ IDEA. O ambiente deve ser configurado para funcionar com Java 11 e maven. 
 

### 1. Clone o projeto:

  

Clone o projeto  por  meio do comando  abaixo:

  

```shell

git clone git@github.com:TTSolutionsPI/painel-preco-backend.git

```

### 2. Configfure as variáves  de  ambiente:

  

Com base no **.env-example** na raiz do projeto, crie um novo arquivo chamado  **.env**, também localizado  na  raiz do projeto (observar  que  esse  arquivo é oculto). Caso utilize o Keycloak localmente, atualizar o  **SSO_AUTH_SERVER**  para o endereço local da  sua  máquina;

  

### 3. Crie  um Personal access tokens no Github:

  

Caso  ainda  não  tenha, crie  um  **Personal access tokens (classic)** no **Github**, para  que  seja  possível  se  autenticar, via **docker**, para  baixar a imagem  *docker* do **Painel  de  Preço** do *GitHub Container Registry* [(ghcr.io)](http://ghcr.io). Se for o caso, para  isso, acesse as [configurações  de  desenvolvedor](https://github.com/settings/tokens), clique em  **Personal access tokens** > **Tokens (classic)**, gere  um  *token* e copie  seu  conteúdo.

  

No terminal, digite:

  

```shell

docker login ghcr.io

```

  

Forneça  seu  **usuário do Github** e, em  **password**, cole o **token**  gerado  nos  passos  acima.

  

Se  receber a mensagem  *Login Succeeded* é sinal  que  deu  tudo  certo.

  

  

### 4. Crie o volume ("partição virtual") de  dados  que  será  utilizado  pelo  *PostgreSQL*:

  

Esse  passo é necessário  para  não  perdemos  os  dados  sempre  que  pararmos o *container*. Segue o comando  suficiente  para  isso:

  

```shell

docker volume create postgres

```


### 5. Gere um build do projeto:

Para que suba uma versão atualizada do projeto, é gerar o novo .jar que será utilizado no Dockerfile. Para isso, deve-se gerar um build com maven do projeto, então configure seu workspace com jdk11 e execute os seguintes objetivos com o maven:

```
mvn clean package -DskipTests
```

**OBS:** antes  de  gerar o build, alguns  ajustes  podem  ser  necessários no **ambiente  de  desenvolvimento**:

 1. Comentar indexador do Lucine (**StartupIndexer.java**):

> //Search.session(em).massIndexer().start();

 2. Desabilitar o flyway (**application.properties**):

> spring.flyway.baseline-on-migrate=false

> spring.flyway.enabled=false
  

### 6. Suba os serviços:

  
Em **ambiente de produção** deve ser:

  

```shell

docker compose up --build -d

```
  
  
Em **ambiente de desenvolvimento**, suba os serviços necessários (postgres, keycloak e redis) para executar o projeto. Use o seguinte comando:
  

```shell

docker compose -f docker-compose.dev.yml up -d

```

Em seguida, execute o Spring Boot Application no próprio Eclipse STS, por meio da classe PainelPrecoApplication.java.

OBS: alguns parâmetros precisarão ser ajustados no application.properties no ambiente de desenvolvimento, como SSO_AUTH_SERVER (se for usar o Keycloak de produção) e SSO_SECRET;

  

### 7. Restaure o backup do banco:

  

Após a inicialização do serviço, **apenas  na  primeira  execução** é necessário  restaurar o backup do banco de dados. Isso  pode  ser  feito  por  meio do comando  abaixo:

```shell
docker exec -i painel-preco-backend-postgres-1 psql -U postgres muralpreco < muralpreco.sql
```

**OBS:** o arquivo  **muralpreco.sql** encontra-se [neste link](https://drive.google.com/file/d/1-qK9EHqiOevIgt7H2TxUKimqyzvRQks1/view?usp=drive_link) para baixá-lo.

Caso utilize um Keycloak próprio, deve importar as configurações. Solicite o json das configurações para importação local pelo endereço [http://localhost:8280](http://localhost:8280), clique em  *Administration Console* (usuário e senha: **admin**) e siga  os  passos  apresentados  em [Importing a Realm](https://howtodoinjava.com/devops/keycloak-export-import-realm/#2-importing-a-realm), para  importar as configurações  de  segurança.
  

### 8. Teste  os  *endpoints*:

  

Se  chegou  até  aqui é para  estar  tudo  certo. Então, vamos  confirmar  isso.

  

A documentação  da API está  disponível  em: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html).
  

De  forma  resumida, todos  os  *endpoints*  estão  protegidos, exigindo, pois, *token*  de  autenticação, exceto o *endpoint*  de  obtenção do *token*, qual  seja: [http://localhost:8080/serverapi/v1/auth/logon](http://localhost:8080/serverapi/v1/auth/logon).

  

Por  fim, listamos  abaixo, os  *requests*  para  todos  os  endpoints  em  linha  de  comando:

  

```shell

--AUTENTICAÇÃO

  

curl --location 'http://localhost:8080/serverapi/v1/auth/logon' \

--header 'Content-Type: application/x-www-form-urlencoded' \

--data-urlencode 'client_id=painel-preco' \

--data-urlencode 'client_secret=igppBRpGuISpN0Vgk86Ef2yQDTWGaH8G' \

--data-urlencode 'grant_type=password' \

--data-urlencode 'username=admin' \

--data-urlencode 'password=admin'

```

  

```shell

--ESFERA (Federal, Estadual  ou Municipal)

  

curl --location 'http://localhost:8080/serverapi/v1/esferas' \

--header 'Authorization: Bearer ACCESS_TOKEN'

```

  

```shell

--FORMAS DE COMPRA

  

curl --location 'http://localhost:8080/serverapi/v1/formas-compra' \

--header 'Authorization: Bearer ACCESS_TOKEN'

```

  

```shell

--FORNECEDORES

  

curl --location 'http://localhost:8080/serverapi/v1/fornecedores?page=1&size=10' \

--header 'Authorization: Bearer ACCESS_TOKEN'

```

  

```shell

--LICITAÇÃO

  

curl --location 'http://localhost:8080/serverapi/v1/licitacoes?page=0&size=10&ano=2023&objeto=detergente&orgaoSuperiorId=dfd49cc0-4f86-11ee-8095-0242ac120003&orgaoId=dfd6d832-4f86-11ee-8095-0242ac120003&ugId=115715d6-4f49-11ee-8580-0242ac120003&modalidadeCompraId=af1939f0-4f23-11ee-8580-0242ac120003&periodoCompraId=181&descricao=ATADURA&fornecedorId=12ed47d6-5268-11ee-9eb3-0242ac120003' \

--header 'Authorization: Bearer ACCESS_TOKEN'

```

  

```shell

--MATERIAL

  

curl --location 'http://localhost:8080/serverapi/v1/materiais?page=1&size=10' \

--header 'Authorization: Bearer ACCESS_TOKEN'

```

  

```shell

--MODALIDADE COMPRA

  

curl --location 'http://localhost:8080/serverapi/v1/modalidades-compra' \

--header 'Authorization: Bearer ACCESS_TOKEN'

```

  

```shell

--PERÍODO COMPRA

  

curl --location 'http://localhost:8080/serverapi/v1/periodos-compra' \

--header 'Authorization: Bearer ACCESS_TOKEN'

```

  

```shell

--PORTES DE FORNECEDOR

  

curl --location 'http://localhost:8080/serverapi/v1/portes-fornecedor' \

--header 'Authorization: Bearer ACCESS_TOKEN'

```

  

```shell

--SITUAÇÃO LICITAÇÃO

  

curl --location 'http://localhost:8080/serverapi/v1/situacoes-licitacao' \

--header 'Authorization: Bearer ACCESS_TOKEN'

```

  

```shell

--UNIDADE FEDERATIVA (UF)

  

curl --location 'http://localhost:8080/serverapi/v1/unidades-federativas' \

--header 'Authorization: Bearer ACCESS_TOKEN'

```

  

```shell

--MUNICÍPIOS DE UMA UF

  

curl --location 'http://localhost:8080/serverapi/v1/unidades-federativas/bead8df4-4c20-11ee-9954-0242ac120003/municipios?page=2&size=20' \

--header 'Authorization: Bearer ACCESS_TOKEN'

```

  

```shell

--UNIDADE GESTORA

  

curl --location 'http://localhost:8080/serverapi/v1/unidades-gestoras?page=2&size=10' \

--header 'Authorization: Bearer ACCESS_TOKEN'

```

  

```shell

--ÓRGÃO

  

curl --location 'http://localhost:8080/serverapi/v1/orgaos?page=2&size=50' \

--header 'Authorization: Bearer ACCESS_TOKEN'

```

  

```shell

--SUB ÓRGÃO

  

curl --location 'http://localhost:8080/serverapi/v1/orgaos/5c9fc00a-4c16-11ee-9954-0242ac120003/suborgaos?page=2&size=50' \

--header 'Authorization: Bearer ACCESS_TOKEN'

```


### 9. Enviar novas imagens para o Container Registry:


Para criar uma nova imagem e enviar ao GHCR, execute o comando abaixo especificando a versão:


```shell

docker build . -t ghcr.io/ttsolutionspi/painel-precos-backend:$VERSAO
docker push ghcr.io/ttsolutionspi/painel-precos-backend:$VERSAO

```

OBS:
Antigamente o GHCR era "ghcr.io/ttsolutionspi/docker-images/painel-precos-backend:$VERSAO", porém na 1.0.27 migrou para "ghcr.io/ttsolutionspi/painel-precos-backend:$VERSAO".



## Anotações Gerais:
  

**OBS:**  algumns  *endpoints* (listados  abaixo) tem  paginação  que  pode  ser  feita  passando  os  parâmetros: **?page=1&size=20**.

  

* Fornecedor;

* Licitação;

* Material;

* Municípios  de  uma UF;

* Unidade  Gestora;

* Órgão (e sub órgão).

  

## Documentação  de  Referência:

  

* [Docler basics commands](https://docs.docker.com/engine/reference/commandline/docker/);

* [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry);

* [GitHub Personal Access Tokens (APT)](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens);

* [OpenID Connections and Oauth2](https://medium.com/semantixbr/oauth-2-openid-connect-c2429db6e996).