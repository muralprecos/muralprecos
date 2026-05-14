---
name: ssr-client-debug
description: 'Diagnose SSR, hydration, and client boundary bugs in Next.js frontend. Use for window/localStorage errors, hydration mismatch, and client/server component misuse.'
argument-hint: 'Observed runtime/build error and where it happens'
user-invocable: true
---

# SSR Client Debug

## When to Use
- Hydration mismatch appears.
- `window` or `localStorage` errors happen in server context.
- Component boundary between server and client is incorrect.

## Procedure
1. Capture exact error and callsite.
2. Determine whether failing component should be server or client.
3. Add `use client` only if truly required.
4. Guard browser APIs and defer client-only logic.
5. Re-test route render and interactions.

## Validation Checklist
- Hydration warning/error is removed.
- Server components remain server where possible.
- No unnecessary client promotion of entire route tree.
