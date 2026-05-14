# Copilot Instructions - painel-preco-frontend

## Workspace Context
- This repository may be opened alone or as part of a multi-root workspace.
- Never assume other repositories are available unless they are explicitly present in the current workspace context.
- Work only inside `painel-preco-frontend` unless the user explicitly asks for cross-project changes.

## Project Scope
- Stack: Next.js (App Router), React, TypeScript, Tailwind, Redux Toolkit.
- Main code: `src/`.
- Tests: `tests/`.

## Default Workflow
1. Preserve Next.js App Router conventions.
2. Keep strict TypeScript typing for new and changed code.
3. Favor existing service, hooks, and store patterns over introducing new architecture.
4. Validate with project scripts when relevant:
   - `npm run dev`
   - `npm run lint`
   - `npm test`

## SSR and Client Boundaries
- Use server components by default where possible.
- Add `use client` only when state/effects/browser APIs are needed.
- Guard browser-only APIs in SSR-sensitive paths.

## Integration and Safety
- Keep backend contract compatibility unless user requests breaking changes.
- Avoid hardcoding secrets or environment-sensitive values.
- Do not change docker/deploy targets unless explicitly requested.
