---
name: form-zod-rhf
description: 'Create or refactor forms using react-hook-form with zod validation. Use for field validation, submit flow, and predictable typed form handling.'
argument-hint: 'Form purpose, fields, validation rules, and submit action'
user-invocable: true
---

# Form Zod RHF

## When to Use
- Build a new form in frontend.
- Strengthen validation for existing form.
- Fix form state, validation, or submit regressions.

## Procedure
1. Define schema and inferred types from zod.
2. Wire schema to react-hook-form resolver.
3. Keep field defaults and controlled/uncontrolled behavior consistent.
4. Surface field and submit errors clearly.
5. Validate success and failure submit paths.

## Validation Checklist
- Validation rules match business expectations.
- Form state stays stable across rerenders.
- Submit handler uses typed payload.
