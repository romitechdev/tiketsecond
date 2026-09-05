# TiketSepur

Train ticket marketplace built with Next.js App Router, Prisma, and Supabase Auth.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Prisma (Supabase PostgreSQL)
- Supabase Auth (`@supabase/supabase-js` + `@supabase/ssr`)

## Environment Variables

For production on Vercel, set the following env variables in the Vercel dashboard, and use different values for a local VM if needed:

```env
DATABASE_URL="postgresql://postgres:YOUR_DB_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:YOUR_DB_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres"

NEXT_PUBLIC_SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_ANON_KEY"
SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY"
NEXT_PUBLIC_BASE_URL="https://tiketsepur.vercel.app"
SUPABASE_STORAGE_BUCKET="ticket-assets"
MAINTENANCE_CRON_SECRET="replace-with-strong-random-secret"
ACTIVITY_LOG_RETENTION_DAYS="90"
RATE_LIMIT_RETENTION_HOURS="24"

ADMIN_EMAILS="admin1@mail.com,admin2@mail.com"
```

Notes:

- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is used for client- and server-side auth session refresh.
- `SUPABASE_SERVICE_ROLE_KEY` is only for server-side privileged operations.
- `DATABASE_URL` and `DIRECT_URL` are used by Prisma to access the Supabase Postgres database.
- `NEXT_PUBLIC_BASE_URL` is used for auth redirects and production canonical SEO.
- `SUPABASE_STORAGE_BUCKET` is for ticket file uploads and profile photos in Supabase Storage.
- `MAINTENANCE_CRON_SECRET` protects the scheduled cleanup endpoint.
- `ACTIVITY_LOG_RETENTION_DAYS` sets the activity log retention period.
- `RATE_LIMIT_RETENTION_HOURS` sets the retention period for expired rate-limit buckets.
- `ADMIN_EMAILS` is used to authorize the admin dashboard.

## Production Hardening

- File uploads: use Supabase Storage (not the local filesystem).
- Activity logs: stored in the `ActivityLog` table (not local files).
- Rate limiting: stored in the `RateLimitBucket` table so it stays consistent across instances.

### Cron Cleanup (Required in Production)

Run the protected cleanup endpoint periodically (e.g., every 6–12 hours):

`POST /api/internal/maintenance/cleanup`

With either header:

- `Authorization: Bearer <MAINTENANCE_CRON_SECRET>`
- `x-maintenance-secret: <MAINTENANCE_CRON_SECRET>`

This endpoint deletes:

- `ActivityLog` entries older than `ACTIVITY_LOG_RETENTION_DAYS`
- Expired `RateLimitBucket` entries older than `RATE_LIMIT_RETENTION_HOURS`

## Migrating the Database to Supabase

If you previously used SQLite, run the following steps after filling in `DATABASE_URL`:

```bash
npm run prisma:generate
npm run prisma:migrate
```

If you need a quick schema sync to the DB without adding extra migration history:

```bash
npm run prisma:push
```

## Supabase Auth Setup

In the Supabase dashboard:

1. Enable the providers you want to use (Google / Email OTP).
2. Add the production app callback/redirect URLs, e.g., `https://tiketsepur.vercel.app/`.
3. For local development, make sure the following URL is registered:
	- `http://localhost:3000`

Also make sure the Auth > URL Configuration section in Supabase uses the production domain as the Site URL, and that the redirect URL whitelist includes both the production domain and localhost for development.

## Install & Run

```bash
npm install
npm run dev
```

The app is available at `http://localhost:3000`.

## SEO & Open Graph (Production Ready)

The application includes full production-ready SEO:

### Root Metadata (`app/layout.tsx`)
- **OpenGraph tags** for social media sharing (Facebook, Twitter, LinkedIn)
- **Twitter Card** (summary_large_image) for tweet previews
- **Viewport** and theme color configuration
- **Language alternatives** for multi-region SEO
- **Robots indexing directives** (auto index, follow for main pages)

### Per-Page Metadata
- **Home** (`/`) — optimized for the main marketplace keyword
- **Ticket Detail** (`/ticket/[id]`) — dynamic metadata with price, route, and OpenGraph image
- **Login** (`/login`) — excluded from indexing (no-index)
- **Upload** (`/upload`) — optimized for "jual tiket" keywords
- **Privacy & Terms** — proper SEO metadata

### Sitemap & Robots
- **`/sitemap.xml`** — auto-generated dynamic sitemap with all ticket listings
- **`/robots.txt`** — configured to allow public pages and disallow admin/API
- **Sitemap updates** — real-time according to ticket availability

### Environment for the Base URL
```env
NEXT_PUBLIC_BASE_URL="https://tiketsepur.com"
```

Update this value to your production domain for search engines.

## Deploy to Vercel

1. Push the repo to GitHub.
2. Create a new project in Vercel and import that repo.
3. Set the environment variables in Vercel according to the `Environment Variables` block above.
4. Make sure `NEXT_PUBLIC_BASE_URL` uses `https://tiketsepur.vercel.app` or your custom domain.
5. Keep the build command at the default `npm run build`.
6. Keep the output framework at the default Next.js.
7. Deploy.
8. After deploying, open Supabase Auth and add the production domain to the Site URL and Redirect URLs.

## Production Build

```bash
npm run build
npm run start
```

## Quick Validation

- Public pages (`/`, `/login`) must return `200`.
- User-protected APIs (`/api/profile`, `/api/tickets/my`) must return `401` when not logged in.
- Admin APIs (`/api/admin/users`, `/api/admin/logs`) must return `403` when not an admin.
