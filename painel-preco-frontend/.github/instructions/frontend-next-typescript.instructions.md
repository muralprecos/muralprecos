---
description: "Use when editing Next.js + TypeScript code in painel-preco-frontend, including pages, components, services, hooks, store, and utility modules."
name: "Frontend Next TypeScript Rules"
applyTo: "src/**/*.ts, src/**/*.tsx, tests/**/*.ts"
---
# Frontend Next TypeScript Rules

- Keep TypeScript strict-safe: avoid `any` unless strongly justified.
- Reuse existing path aliases and import conventions.
- Prefer small, composable components and keep props typed.
- For API changes, update service layer and affected consumers together.
- Preserve existing state boundaries (Redux/Context) before adding new global state.
- Keep naming and folder conventions consistent with nearby code.
