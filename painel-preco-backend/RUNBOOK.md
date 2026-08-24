# Runbook — Painel de Preços

Backend e frontend são repositórios git independentes, lado a lado dentro de uma raiz comum:
```
/home/euclydes/repos/tt/painel-preco/
├── painel-preco-backend     (este repo)
└── painel-preco-frontend
```

## Antes de começar (config necessária, uma vez por ambiente)

**Este projeto NÃO roda migrations automaticamente.** Apesar de o Flyway estar
habilitado (`spring.flyway.enabled=true`) e `spring.jpa.hibernate.ddl-auto=none`,
não existe pasta `db/migration` — o Flyway só cria um baseline vazio no
primeiro start. Todo o schema é gerenciado à mão pelos arquivos em
`src/main/resources/scripts/*.sql`, aplicados manualmente contra o banco.
**Sempre que der `git pull` e houver `.sql` novo em `scripts/`, rode-o antes
de subir o backend:**

```bash
cd /home/euclydes/repos/tt/painel-preco/painel-preco-backend
docker exec -i painel-preco-backend-postgres-1 psql -U postgres -d muralpreco \
  < src/main/resources/scripts/2026-08-23-create-processo-contratacao.sql
docker exec -i painel-preco-backend-postgres-1 psql -U postgres -d muralpreco \
  < src/main/resources/scripts/2026-08-23-add-tratamento-me-epp.sql
```
(Ver `git log --diff-filter=A -- src/main/resources/scripts/` para achar rapidamente quais scripts são novos desde o seu último pull.)

**Variáveis de ambiente novas** (feature de geração de ETP/TR/Edital) — copiar
de `.env-example` para o seu `.env` e preencher `LLM_API_KEY` com uma chave
real (peça a chave de homologação com o time; nunca commitar a chave):
```
LLM_API_KEY=...
LLM_API_BASE_URL=https://api.deepseek.com/v1
LLM_API_MODEL=deepseek-chat
```
Sem isso, os endpoints `/processos-contratacao/*/artefatos/*/gerar` falham
com erro de autenticação contra a API do LLM — o resto da aplicação funciona
normalmente sem essas variáveis.

## Subir a stack

### 1. Infra (postgres, redis, keycloak)
```bash
cd /home/euclydes/repos/tt/painel-preco/painel-preco-backend
docker compose up -d postgres redis keycloak
```

### 2. Backend
```bash
cd /home/euclydes/repos/tt/painel-preco/painel-preco-backend
set -a && . .env && set +a
nohup java -Xmx8g -Xms512m -jar target/painel-preco-1.0.37.jar > /tmp/painel-preco.log 2>&1 &
echo "Backend PID: $!"
```

Aguardar confirmação de startup:
```bash
tail -f /tmp/painel-preco.log | grep -m1 "Started PainelPreco"
```

### 3. Frontend
```bash
cd /home/euclydes/repos/tt/painel-preco/painel-preco-frontend
docker compose -f docker-compose.dev.yml up -d
```

Aguardar confirmação:
```bash
until docker logs painel_precos_app_front_dev 2>&1 | grep -q "Ready"; do sleep 2; done && echo "Frontend pronto"
```

---

## Parar a stack

```bash
# Frontend
cd /home/euclydes/repos/tt/painel-preco/painel-preco-frontend
docker compose -f docker-compose.dev.yml down

# Backend
kill $(ps aux | grep "java.*painel-preco" | grep -v grep | awk '{print $2}')

# Infra
cd /home/euclydes/repos/tt/painel-preco/painel-preco-backend
docker compose down
```

---

## Endpoints

| Serviço   | URL                        |
|-----------|----------------------------|
| Frontend  | http://localhost:3000       |
| Backend   | http://localhost:8080       |
| Keycloak  | http://localhost:8280       |
| Postgres  | localhost:5432 (muralpreco) |
| Redis     | localhost:6379              |

---

## Monitorar coleta (schedule: meia-noite)

```bash
tail -f /tmp/painel-preco.log | grep -E "Coletando|INFO: Mod|ERROR|429|500"
```

## Build do backend (após mudanças no código)

```bash
cd /home/euclydes/repos/tt/painel-preco/painel-preco-backend
mvn package -DskipTests
```
O jar gerado em `target/painel-preco-1.0.37.jar` é o mesmo usado no startup acima.
