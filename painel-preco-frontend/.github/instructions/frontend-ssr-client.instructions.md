---
description: "Use when handling SSR vs client-component behavior, browser-only APIs, hydration issues, and auth/session flows in Next.js App Router for painel-preco-frontend."
name: "Frontend SSR Client Boundaries"
applyTo: "src/app/**/*.tsx, src/components/**/*.tsx, src/context/**/*.tsx, src/hooks/**/*.ts"
---
# Frontend SSR Client Boundaries

- Default to server components and elevate to client only when needed.
- Keep `use client` at file top when required.
- Avoid direct browser API usage in server-rendered paths.
- If browser APIs are required, guard execution to client runtime.
- For hydration issues, prefer deterministic render output and deferred client logic.
- Keep auth/session logic aligned with current project pattern.
