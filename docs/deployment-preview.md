# Brooks School Preview Deployment

This guide is for putting the current app online so the school manager can review it and request edits.

## Recommended Preview Setup

Use Render for all three parts:

1. PostgreSQL database
2. Backend web service
3. Frontend static site

This keeps the first deployment simpler because everything lives in one dashboard.

## Domain Plan

- Public app: `https://brooksschool.sc.ke`
- API: `https://api.brooksschool.sc.ke`

For the first manager preview, it is also okay to use the temporary Render URLs first, then connect the custom domain after the manager has seen it.

## Before Deploying

Create a private GitHub repository and push this project to it.

Recommended repository name:

```text
brooks-school-management
```

## Render Services

### 1. PostgreSQL

Create a Render Postgres database.

Use the internal database URL as `DATABASE_URL` for the backend service.

### 2. Backend Web Service

Root directory:

```text
backend
```

Build command:

```text
npm install && npx prisma generate && npx prisma migrate deploy
```

Start command:

```text
npm start
```

Environment variables:

```text
NODE_ENV=production
PORT=10000
DATABASE_URL=<Render internal database URL>
JWT_ACCESS_SECRET=<long random secret>
JWT_REFRESH_SECRET=<long random secret>
JWT_ACCESS_EXPIRES_IN=8h
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=https://brooksschool.sc.ke
PRODUCTION_DOMAIN=brooksschool.sc.ke
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=300
SEED_ADMIN_EMAIL=<real admin email>
SEED_ADMIN_PASSWORD=<temporary strong password>
```

After the backend deploys, run a one-off job or shell command:

```text
npm run prisma:seed
```

### 3. Frontend Static Site

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
VITE_API_BASE_URL=https://api.brooksschool.sc.ke
```

If using temporary Render URLs first, set `VITE_API_BASE_URL` to the backend Render URL.

## DNS Records

Add the custom domain in Render first. Render will show the DNS records to create.

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

