---
description: "Use when troubleshooting local backend execution, Docker compose dependencies, database restore, Keycloak setup, or Maven build issues for painel-preco-backend."
name: "Backend Local Ops"
---
# Backend Local Ops

- Prefer existing README runbook commands before introducing new scripts.
- Confirm `.env` values before changing application config.
- Use minimal operational changes and keep production settings untouched.
- For local troubleshooting, check service order: postgres -> redis -> keycloak -> backend.
- If a change is operational only, avoid touching domain code.
