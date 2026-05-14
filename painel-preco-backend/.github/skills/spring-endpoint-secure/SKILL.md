---
name: spring-endpoint-secure
description: 'Create or update a Spring REST endpoint with validation, service wiring, and role protection. Use for new backend routes, CRUD changes, and secure endpoint refactors.'
argument-hint: 'Endpoint goal, path, method, DTO/form, and required role'
user-invocable: true
---

# Spring Endpoint Secure

## When to Use
- Add a new endpoint in `painel-preco-backend`.
- Change input/output contract for an existing endpoint.
- Apply or refine role protection with Spring Security.

## Procedure
1. Identify target resource and existing layer structure.
2. Update or create controller method with explicit mapping and validation.
3. Ensure service method exists and contains business rules.
4. Update repository query or persistence call if needed.
5. Add `@PreAuthorize` when endpoint is restricted.
6. Verify request/response DTO mapping consistency.
7. Run a focused build or tests.

## Validation Checklist
- Endpoint path stays under `/serverapi/v1` unless user requests otherwise.
- Input validation and error handling are coherent.
- Role checks match business intent.
- No secret values are introduced in code.
