# Brooks School Preview Deployment

This guide is for putting the current app online so the school manager can review it and request edits.

## Recommended Preview Setup

Use Vercel for the preview frontend and backend, plus a hosted PostgreSQL database such as Neon or Supabase:

1. Vercel frontend project from `frontend`
2. Vercel backend/API project from `backend`
3. Free hosted Postgres database

Vercel is strongest for the frontend, but this app still needs PostgreSQL for login, students, guardians, and exam results.

## Domain Plan

- Public app: `https://brooksschool.sc.ke`
- API: `https://api.brooksschool.sc.ke`

For the first manager preview, use the temporary Vercel URLs first, then connect the custom domain after the manager has seen it.

## Before Deploying

Create a private GitHub repository and push this project to it.

Recommended repository name:

```text
brooks-school-management
```

## Vercel Preview Services

### 1. PostgreSQL

Create a free Postgres database using Neon, Supabase, or a Vercel Postgres integration.

Copy its pooled connection string as `DATABASE_URL` for the backend project.

### 2. Backend API Project

Root directory:

```text
backend
```

Build command:

```text
npm run vercel-build
```

Framework preset:

```text
Other
```

Environment variables:

```text
NODE_ENV=production
DATABASE_URL=<hosted Postgres pooled connection string>
JWT_ACCESS_SECRET=<long random secret>
JWT_REFRESH_SECRET=<long random secret>
JWT_ACCESS_EXPIRES_IN=8h
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=<frontend Vercel URL>,https://brooksschool.sc.ke
PRODUCTION_DOMAIN=brooksschool.sc.ke
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=300
SEED_ADMIN_EMAIL=<real admin email>
SEED_ADMIN_PASSWORD=<temporary strong password>
```

After the backend deploys, run seed locally against the hosted database or use Vercel CLI with the backend environment variables:

```text
npm run prisma:seed
```

### 3. Frontend Project

Root directory:

```text
frontend
```

Build command:

```text
npm install && npm run build
```

Publish directory:

```text
dist
```

Environment variables:

```text
VITE_API_BASE_URL=<backend Vercel URL>
```

After custom domains are connected, change it to `https://api.brooksschool.sc.ke`.

## DNS Records

Add the custom domain in Vercel first. Vercel will show the DNS records to create.

Expected shape:

```text
brooksschool.sc.ke      -> frontend static site
api.brooksschool.sc.ke  -> backend web service
```

Do not change DNS until the temporary Render URLs work.

## Preview Safety

For the manager preview:

- Use test/demo student data only.
- Do not add real children, parents, phone numbers, or exam records yet.
- Share only with the manager.
- Change the seeded admin password after first login.
