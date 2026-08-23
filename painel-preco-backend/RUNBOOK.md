# Runbook — Painel de Preços

Backend e frontend são repositórios git independentes, lado a lado dentro de uma raiz comum:
```
/home/euclydes/repos/tt/painel-preco/
├── painel-preco-backend     (este repo)
└── painel-preco-frontend
```

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
