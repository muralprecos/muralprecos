# Copilot Instructions - painel-preco-backend

## Workspace Context
- This repository may be opened alone or as part of a multi-root workspace.
- Never assume other repositories are available unless they are explicitly present in the current workspace context.
- Work only inside `painel-preco-backend` unless the user explicitly asks for cross-project changes.

## Project Scope
- Stack: Java 11, Spring Boot 2.7, Maven, PostgreSQL, Keycloak, Redis.
- Main source: `src/main/java`.
- Tests: `src/test/java`.
- API base path convention: `/serverapi/v1`.

## Default Workflow
1. Keep layered architecture: controller -> service -> repository.
2. Prefer small, safe edits and preserve public API behavior.
3. Validate with Maven commands when relevant:
   - `mvn clean package -DskipTests`
   - `mvn test`

## Security and Auth
- Preserve Keycloak and Spring Security behavior.
- Keep role checks explicit (`@PreAuthorize`) for protected endpoints.
- Never hardcode secrets or tokens in source files.

## Cache Configuration (CRITICAL)
- The application uses Spring's `@EnableCaching` with a `ConcurrentMapCacheManager`.
- Whenever you introduce a new `@Cacheable`, `@CacheEvict`, or `@CachePut` annotation anywhere in the code, you **MUST** manually register the cache name in `PainelPrecoApplication.java`.
- Example: If you add `@Cacheable("myNewCache")`, you must update the `cacheManager()` Bean: `return new ConcurrentMapCacheManager(..., "myNewCache");`.
- Failing to do so will result in `Cannot find cache named 'myNewCache'` runtime exceptions because Spring Boot does not dynamically create caches when using the explicit array constructor of `ConcurrentMapCacheManager`.

## Dev Environment Guardrails
- Local dependencies commonly run via `docker compose -f docker-compose.dev.yml up -d`.
- Avoid enabling expensive startup tasks in dev (full indexing / heavy collectors) unless user requests it.
- Do not modify Docker image tags or registry targets without explicit user request.
