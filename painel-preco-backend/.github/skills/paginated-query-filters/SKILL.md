---
name: paginated-query-filters
description: 'Implement or adjust paginated list endpoints with filters in Spring Data. Use for page/size/sort changes, query refinement, and list API performance tuning.'
argument-hint: 'Resource name, current query behavior, and desired filters/pagination'
user-invocable: true
---

# Paginated Query Filters

## When to Use
- A list endpoint needs new filters.
- Pagination semantics should be preserved while extending query.
- Response performance or query correctness must be improved.

## Procedure
1. Map current request params and pageable usage.
2. Update service and repository query with minimal contract changes.
3. Keep defaults stable (`page`, `size`, and sort behavior).
4. Validate SQL/query plan impact when filter complexity increases.
5. Ensure DTO output remains compatible for frontend consumers.

## Validation Checklist
- Pagination still works with and without filters.
- Empty-result and boundary cases are handled.
- No breaking rename in request parameters without explicit request.
