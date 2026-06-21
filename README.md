# Brooks School Management System

Production-oriented school management web application for Brooks School in Kenya.

Production domain: `brooksschool.sc.ke`

## Stack

- Frontend: React, JavaScript, Tailwind CSS, TanStack Query
- Backend: Node.js, Express, JavaScript
- Database: PostgreSQL
- ORM: Prisma
- Authentication: JWT with role-based access control

## Starting Artifacts

- Architecture and roadmap: `docs/architecture.md`
- Prisma schema: `backend/prisma/schema.prisma`
- Initial SQL migration: `backend/prisma/migrations/20260621000000_init/migration.sql`
- Backend structure: `backend/`
- Frontend structure: `frontend/`

## Local Development

1. Copy `backend/.env.example` to `backend/.env`.
2. Start PostgreSQL with `docker compose up -d postgres`.
3. Run `npm run prisma:migrate`.
4. Run `npm run prisma:seed`.
5. Start the backend with `npm run dev:backend`.
