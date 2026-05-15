---
name: api-service-integration
description: 'Implement or adjust frontend service integration with backend APIs. Use for request mapping, response typing, error handling, and backward-compatible contract updates.'
argument-hint: 'Endpoint, payload/response shape, and affected screens'
user-invocable: true
---

# API Service Integration

## When to Use
- Add a new backend call to frontend.
- Update request or response mapping.
- Fix integration regressions after backend changes.

## Procedure
1. Locate service module and related types.
2. Add typed request/response contracts.
3. Update consumer hooks/components with minimal UI impact.
4. Handle loading, empty, and error states.
5. Validate backward compatibility for existing screens.

## Validation Checklist
- Service typing is explicit and consistent.
- UI handles failure cases safely.
- Contract changes are intentional and documented in code comments when needed.
