---
name: keycloak-role-guard
description: 'Adjust backend authorization with Keycloak roles and Spring @PreAuthorize. Use for ADMIN route protection, auth regressions, and access-control updates.'
argument-hint: 'Route or controller, current role behavior, desired role behavior'
user-invocable: true
---

# Keycloak Role Guard

## When to Use
- A route should be restricted or opened to specific roles.
- Authorization behavior changed unexpectedly.
- ADMIN-only resources need correction.

## Procedure
1. Locate controller methods for the target route.
2. Check current role constants and security annotations.
3. Apply the minimal `@PreAuthorize` change required.
4. Keep auth public routes unchanged unless requested.
5. Review side effects on frontend expectations.
6. Validate with tests or targeted manual request flow.

## Validation Checklist
- Protected routes enforce expected roles.
- Public auth endpoints remain intentionally public.
- No unrelated security configuration was modified.
