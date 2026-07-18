# MSS Module Boundaries

## apps/web

Main Angular application.

## Suggested Libraries

- libs/ui
- libs/auth
- libs/data-access
- libs/models
- libs/utils
- libs/feature-public
- libs/feature-student
- libs/feature-teacher
- libs/feature-admin
- libs/feature-payment
- libs/feature-learning

## Rules

- UI components must be reusable.
- Business logic should not be duplicated.
- Supabase queries should live in data-access services.
- TypeScript interfaces should live in models.
- Feature modules should not directly depend on unrelated feature modules.
- Shared utilities must stay generic.
