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

## LocalStorage & State Management
- **CRITICAL:** Do NOT use `localStorage.getItem`, `localStorage.setItem`, or `localStorage.removeItem` directly in components or any part of the codebase.
- All interactions with `localStorage` MUST go through:
  1. `src/services/StorageService.ts`: For direct key-value storage management (includes in-memory caching and error handling).
  2. **Redux Store**: For state that needs to be reactive in UI components. Use `src/store/listenerMiddleware.ts` to sync Redux state slices with `StorageService` automatically.
- **If you need to add a new key to localStorage:**
  1. Add the key and its type to the `StorageMap` interface in `src/services/StorageService.ts`.
  2. Do not bypass the `StorageService` typing.
- Guard browser-only APIs in SSR-sensitive paths.

## Integration and Safety
- Keep backend contract compatibility unless user requests breaking changes.
- Avoid hardcoding secrets or environment-sensitive values.
- Do not change docker/deploy targets unless explicitly requested.

## Environment & Analytics Conventions
- In this Next.js app, `NODE_ENV` must remain `development` or `production`.
- Use `NEXT_PUBLIC_APP_ENV` for application-level environment cues such as `development`, `homolog`, and `production`.
- Homolog must behave like production at framework/runtime level, so use `NODE_ENV=production` together with `NEXT_PUBLIC_APP_ENV=homolog`.
- **Google Analytics (GA4):**
  - Integrated via `@next/third-parties/google` in `RootLayout`.
  - Resolution: `process.env.GA_MEASUREMENT_ID` (runtime server environment variable).
  - CI/CD Workflows (`.github/workflows/`):
    - `homolog.yml` passes `GA_MEASUREMENT_ID=${{ vars.GA_MEASUREMENT_ID_HMG }}` as build-arg.
    - `main.yml` passes `GA_MEASUREMENT_ID=${{ vars.GA_MEASUREMENT_ID_PROD }}` as build-arg.
