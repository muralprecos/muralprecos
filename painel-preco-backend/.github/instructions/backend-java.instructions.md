---
description: "Use when editing Java Spring Boot backend code, controllers, services, repositories, DTOs, and tests in painel-preco-backend."
name: "Backend Java Spring Rules"
applyTo: "src/main/java/**/*.java, src/test/java/**/*.java"
---
# Backend Java Spring Rules

- Keep package and naming conventions already used by the project.
- For endpoint changes, update controller, service, and repository consistently.
- Use `@Valid` for request body validation when input forms are changed.
- Prefer constructor injection and existing project patterns.
- Keep pagination/filter contracts backward compatible for frontend consumers.
- Add or update tests when changing business rules.
