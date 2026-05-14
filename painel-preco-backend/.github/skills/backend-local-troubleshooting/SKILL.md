---
name: backend-local-troubleshooting
description: 'Diagnose and fix local backend run issues in painel-preco-backend. Use for Maven build failures, docker compose dependency issues, DB connection errors, and Keycloak misconfiguration.'
argument-hint: 'Observed error, command used, and environment details (.env, docker services)'
user-invocable: true
---

# Backend Local Troubleshooting

## When to Use
- Local app does not start.
- Maven build or test commands fail.
- Backend cannot connect to postgres/redis/keycloak.

## Procedure
1. Capture exact failing command and first actionable error.
2. Confirm required services are up in local compose.
3. Validate key environment variables from `.env`.
4. Isolate whether failure is infra, config, or code.
5. Apply smallest fix in the correct layer.
6. Re-run only necessary verification command.

## Validation Checklist
- Root cause is identified, not only symptom hidden.
- Fix does not alter production behavior unintentionally.
- Startup and basic endpoint flow recover.
