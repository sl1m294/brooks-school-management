# Backend

Node.js + Express + JavaScript API for Brooks School.

## Initial Structure

```text
src/
  config/
  database/
  common/
    errors/
    http/
    middleware/
    security/
    validation/
  modules/
    auth/
    students/
    teachers/
    classes/
    subjects/
    grades/
    attendance/
    dashboard/
    audit/
tests/
  unit/
  integration/
prisma/
  schema.prisma
  migrations/
```

## Module Contract

Each feature module should expose routes, controllers, services, repositories, validation schemas, and public DTO types. Controllers stay thin; services own business rules; repositories own Prisma queries.

## Local Setup

1. Copy `.env.example` to `.env`.
2. Set strong JWT secrets and a PostgreSQL `DATABASE_URL`.
3. Run `npm install` from the repository root.
4. Run `npm run prisma:generate`.
5. Run `npm run prisma:migrate`.
6. Run `npm run prisma:seed`.
7. Start the API with `npm run dev:backend`.

The API health endpoint is `GET /health`. Auth routes start at `/api/auth`.

Default seed credentials are controlled by `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`.
