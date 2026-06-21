# Brooks School Management System Architecture

School name: Brooks School

Production domain: `brooksschool.sc.ke`

## System Context

```text
+-------------------+        HTTPS/JWT        +-------------------------+
|                   |  REST JSON API requests |                         |
| React + JS SPA    +------------------------>+ Express + JS API        |
| Tailwind UI       |                         | Modular services        |
| TanStack Query    |<------------------------+ RBAC + validation       |
|                   |  JSON responses         |                         |
+-------------------+                         +------------+------------+
                                                          |
                                                          | Prisma Client
                                                          v
                                             +------------+------------+
                                             |                         |
                                             | PostgreSQL              |
                                             | Normalized school data  |
                                             |                         |
                                             +-------------------------+
```

## Backend Architecture

```text
backend/
  src/
    config/                 Environment parsing and app configuration
    database/               Prisma client lifecycle and seed helpers
    common/
      errors/               Domain/API error types
      http/                 Response helpers and pagination contracts
      middleware/           Auth, RBAC, request logging, error handling
      security/             Password hashing, JWT, authorization utilities
      validation/           Shared Zod schemas and request validation
    modules/
      auth/                 Login, refresh, current user, password flows
      students/             Student profiles, guardians, enrollment status
      teachers/             Teacher profiles and teacher assignments
      classes/              Classes, streams, rosters, enrollment history
      subjects/             Subject catalog and class offerings
      grades/               Assessments, grades, averages, report cards
      attendance/           Daily attendance and attendance reports
      dashboard/            Aggregate statistics and recent activity
      audit/                Activity logging and audit queries
    tests/
      unit/
      integration/
```

Each backend module will use the same clean architecture shape:

```text
module/
  module.routes.js          Express route bindings
  module.controller.js      HTTP-only request/response logic
  module.service.js         Business rules and transaction boundaries
  module.repository.js      Prisma queries
  module.schemas.js         Zod request validation
  module.types.js           JSDoc typedefs and domain-specific shapes
```

Controllers will not query Prisma directly. Services own business rules. Repositories own database access. Middleware handles cross-cutting concerns such as authentication, authorization, validation, and errors.

## Frontend Architecture

```text
frontend/
  src/
    app/                    App bootstrap and providers
    api/                    Typed API client and query helpers
    auth/                   Auth context, token storage, guards
    components/
      ui/                   Shared low-level UI components
    features/
      auth/
      students/
      teachers/
      classes/
      subjects/
      grades/
      attendance/
      dashboard/
    layouts/                Shell layouts by role
    routes/                 Route definitions and route guards
    styles/                 Tailwind entrypoint and global styles
    tests/
```

Frontend feature folders will contain page components, forms, tables, feature-specific hooks, and local schemas. Server state will live in TanStack Query. Client state will stay local unless it is truly cross-cutting.

## Product and UI Direction

The application should feel modern, calm, and easy for non-technical parents and school staff to use. The school context is Kenya, so user-facing language should follow Kenyan school expectations.

- Use plain language labels such as `Parent/Guardian`, `Student Profile`, and `Attendance History`.
- Use `Class` in parent and staff-facing screens instead of `Grade`.
- Use `Stream` in parent and staff-facing screens instead of `Section`.
- Prefer clear actions over clever interactions.
- Keep screens spacious enough to scan, but not so decorative that routine school work feels slow.
- Use strong search, filters, and status chips so users can find students quickly.
- Keep forms grouped by real-world meaning: learner details, contact information, parent/guardian information, enrollment.
- Brooks School is a primary school, so parent/guardian phone and email are the primary contact details. Do not ask children for phone numbers.
- Avoid destructive actions where school records matter. Prefer status changes such as inactive, transferred, or graduated.
- Use accessible color contrast, readable typography, and predictable navigation.
- Design admin screens for staff efficiency while keeping parent-facing screens warm and simple.

## Request Flow

```text
Browser
  -> route/page component
  -> TanStack Query mutation/query
  -> typed API client
  -> Express route
  -> auth + RBAC middleware
  -> Zod validation middleware
  -> controller
  -> service
  -> repository
  -> Prisma transaction/query
  -> PostgreSQL
```

## Security Model

- JWT access tokens authenticate API requests.
- Passwords are hashed with Argon2 or bcrypt, never stored directly.
- Role-based access control supports `ADMIN`, `TEACHER`, and `STAFF`.
- Route permissions are declared per endpoint and enforced in middleware.
- Input validation uses Zod at API boundaries.
- Prisma parameterization prevents SQL injection for normal queries.
- Audit logs record sensitive create, update, delete, attendance, and grade actions.

## Key Domain Decisions

- `User` is the authentication identity. Teachers can optionally link to a `User` account.
- `Teacher` stores employment/profile details separate from login credentials.
- `Student` stores stable profile data. Class membership over time is captured by `Enrollment`.
- `Class` represents a class-level stream for an academic year, such as Class 8 Stream A in 2026.
- `Subject` is the course catalog. `ClassSubject` represents a subject offered to a specific class.
- `TeacherAssignment` links teachers to class-subject offerings, allowing co-teachers or changes over time.
- `Grade` records scored assessments against a student and class-subject offering.
- `Attendance` records daily status by student, class, and date.
- Guardians are normalized and connected through `StudentGuardian` so siblings can share guardian records.

## Development Roadmap

### Phase 1: Foundation

1. Create monorepo structure.
2. Configure backend JavaScript, Express, Prisma, PostgreSQL, Zod, auth utilities, and testing.
3. Configure frontend Vite, React, JavaScript, Tailwind CSS, TanStack Query, routing, and test tooling.
4. Add environment validation and local Docker Compose for PostgreSQL.
5. Apply initial Prisma migration and seed the first admin user.

### Phase 2: Authentication and RBAC

1. Implement login and current-user endpoints.
2. Add password hashing and JWT signing/verification.
3. Add route-level permission middleware.
4. Build frontend login page, authenticated shell, and role-aware navigation.
5. Add integration tests for auth success, failure, and authorization boundaries.

### Phase 3: Student Management

1. Implement student CRUD APIs.
2. Add guardian create/link/update flows.
3. Add search, filtering, pagination, and profile view.
4. Build student list, form, profile, and delete confirmation UI.
5. Test validation, duplicate student IDs, and soft operational states.

### Phase 4: Teacher, Class, and Subject Management

1. Implement teacher CRUD and optional user account linking.
2. Implement subject catalog CRUD.
3. Implement class/stream CRUD for academic years.
4. Implement student enrollment and class roster management.
5. Implement teacher assignment to class subjects.

### Phase 5: Attendance

1. Implement daily attendance entry by class.
2. Support present, absent, late, excused, and half-day states.
3. Add attendance history per student.
4. Add attendance reporting by class, date range, and student.

### Phase 6: Grades and Report Cards

1. Implement grade entry and grade editing.
2. Calculate weighted averages per class subject.
3. Generate student academic history.
4. Generate report card data and printable frontend views.

### Phase 7: Dashboard and Production Readiness

1. Add aggregate dashboard APIs.
2. Add recent activity feed backed by audit logs.
3. Add rate limiting, structured logging, and production CORS configuration.
4. Add end-to-end tests for core workflows.
5. Add deployment documentation and CI checks.
