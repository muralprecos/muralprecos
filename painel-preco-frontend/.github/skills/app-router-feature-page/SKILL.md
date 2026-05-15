---
name: app-router-feature-page
description: 'Create or update a feature route/page in Next.js App Router with proper layout, data flow, and typed props. Use for new frontend pages and route-level refactors.'
argument-hint: 'Route path, page goal, data source, and expected UI behavior'
user-invocable: true
---

# App Router Feature Page

## When to Use
- Build a new route in App Router.
- Refactor a route while preserving behavior.
- Move UI composition closer to route boundaries.

## Procedure
1. Identify target route and nearby route-group conventions.
2. Add or update route files with typed interfaces.
3. Keep data loading in the most appropriate layer.
4. Reuse existing components and shared UI primitives.
5. Validate route navigation and error/loading behavior.

## Validation Checklist
- Route structure matches existing app conventions.
- TypeScript passes for changed files.
- No accidental cross-project imports.
