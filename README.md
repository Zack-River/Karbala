# Karbala Awareness Platform

A Next.js 14 educational platform for a structured Karbala season experience. The app includes public content pages, timed quizzes, quiz analytics, visitor analytics, an admin dashboard, and a managed gallery backed by Supabase.

## Tech Stack

- **Framework:** Next.js 14 App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom Karbala theme tokens
- **Database:** Supabase PostgreSQL
- **Auth:** Supabase Auth with middleware-protected admin routes
- **Storage:** Supabase Storage for media and gallery files
- **Runtime:** Node.js, standalone Next.js output, PM2 in production
- **Package manager:** npm

## Features

- **Public content:** Season landing page, nights, majalis, cards, resources, and gallery.
- **Admin dashboard:** Manage nights, quizzes, cards, resources, attachments, sheikh profile, season data, and gallery images.
- **Timed quizzes:** Open/close scheduling, duration limits, start guard, auto-submit, server-side grading, and late-submit protection.
- **Quiz analytics:** Attempt tracking, per-question answers, aggregate stats, public stats display, and admin results pages.
- **Visitor analytics:** Page view tracking, session counts, and live visitor presence.
- **Gallery:** Public grid with load-more, lightbox viewer, admin upload/delete/reorder, and Supabase gallery storage.
- **Production resilience:** One-time chunk reload recovery after deploys to avoid infinite reload loops.

## Project Structure

- `src/app`: App Router routes for public pages, admin pages, auth routes, API routes, and error handling.
- `src/components`: UI, layout, admin forms, quiz, gallery, cards, analytics, and section components.
- `src/lib`: Supabase clients, queries, server actions, media helpers, storage helpers, and shared utilities.
- `src/types`: Database and application TypeScript types.
- `src/constants`: Shared constants and configuration values.
- `public`: Static images, logos, and local fallback assets.
- `supabase/migrations`: SQL migrations for schema, RLS, storage buckets, analytics, and gallery.
- `docs`: Project overview, design system, admin requirements, and database notes.

## Requirements

- Node.js 20+ recommended.
- npm 10+ recommended.
- Supabase project with PostgreSQL, Auth, Realtime, and Storage enabled.
- Production server with Node.js, npm, Git, and PM2.

## Environment Variables

Create `.env.local` from the example file:

```bash
cp .env.local.example .env.local
```

Required values:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=
```

Use the public site URL for `NEXT_PUBLIC_SITE_URL` in production, for example `https://example.com`.

## Local Setup

```bash
git clone <repository-url>
cd <project-directory>
npm install
npm run dev
```

Local URLs:

- Public site: `http://localhost:3000`
- Admin dashboard: `http://localhost:3000/admin`

Useful local commands:

```bash
npm run dev
npm run build
npm run start
```

Always use npm for this project. Do not mix package managers unless the lockfile is intentionally regenerated.

## Database Setup

Run the SQL migrations in `supabase/migrations` against the Supabase project. If migrations are applied manually, use the Supabase Dashboard SQL Editor.

Important migrations include:

- `001_initial_schema.sql`: Base tables and policies.
- `007_quiz_scheduling.sql`: Quiz close time, duration, and schedule-aware RLS.
- `008_quiz_analytics.sql`: Quiz attempts and attempt answers.
- `009_quiz_stats_view.sql`: Aggregate quiz statistics view.
- `010_visitor_analytics.sql`: Page view/session analytics.
- `011_gallery_images.sql`: Gallery image metadata table.
- `012_gallery_storage.sql`: Public gallery storage bucket and policies.

After manual schema changes, reload the Supabase PostgREST schema cache:

```sql
NOTIFY pgrst, 'reload schema';
```

## Storage Setup

The app expects public Supabase Storage buckets for uploaded media and gallery images. The migration files create or update the expected buckets and RLS policies.

General expectations:

- Public read access for assets displayed to visitors.
- Admin/authenticated upload, update, and delete permissions.
- Gallery images are stored in the gallery bucket and referenced by `gallery_images`.
- Other media assets are stored in the media bucket and referenced by content records.

## Production Deployment

The app is configured with `output: "standalone"` in `next.config.mjs`. When using PM2 with the standalone server, you must copy static and public assets into the standalone output after every build.

Generic server flow:

```bash
ssh <server-user>@<server-host>
cd /path/to/app
git pull --ff-only
npm install
npm run build
mkdir -p .next/standalone/.next
cp -a .next/static .next/standalone/.next/
cp -a public .next/standalone/
pm2 restart <app-name>
```

If the PM2 process does not exist yet:

```bash
pm2 start .next/standalone/server.js --name <app-name>
pm2 save
```

Confirm the PM2 process is serving the standalone server:

```bash
pm2 show <app-name>
```

The script path should point to:

```text
/path/to/app/.next/standalone/server.js
```

## Why Static Copy Matters

Next.js standalone output does not automatically include every static asset needed by the browser. If `.next/static` is not copied into `.next/standalone/.next/static`, visitors can see errors like:

```text
ChunkLoadError: Loading chunk failed
```

If `public` is not copied into `.next/standalone/public`, files such as logos, icons, and fallback images can return `404`.

Use these checks after deployment:

```bash
test -d .next/standalone/.next/static
test -d .next/standalone/public
curl -I https://<domain>/_next/static/<known-chunk-path>
curl -I https://<domain>/logo.png
curl -I https://<domain>/icon.png
```

Expected result for live assets is `200`.

## Production Verification

After each deploy, verify:

```bash
curl -I https://<domain>/
curl -I https://<domain>/karbala/gallery
curl -I https://<domain>/karbala/cards
curl -I https://<domain>/logo.png
curl -I https://<domain>/icon.png
pm2 status
pm2 logs <app-name> --lines 100
```

Recommended browser checks:

- Open the public site and navigate between main pages.
- Open `/karbala/gallery` and confirm images load quickly and the lightbox opens.
- Open a quiz page, click start once, confirm the page does not refresh unexpectedly, and submit a test attempt.
- Open `/admin` and confirm dashboard analytics render.
- Open `/admin/gallery` and confirm upload/delete/reorder controls work.

## Known Deployment Gotchas

- **Use the site user:** Run `git pull`, `npm install`, `npm run build`, and `pm2` as the same Linux user that owns the app files.
- **Dubious ownership:** If Git complains about repository ownership, switch to the correct user instead of forcing root access.
- **Dirty lockfile after install:** `npm install` on a different platform can sometimes alter `package-lock.json`. Review before committing; restore it on production if it is only metadata churn.
- **Chunk reload loop:** The app includes a one-time ChunkLoadError reload guard in `src/app/error.tsx`. This helps stale browsers recover after deploys without infinite refresh loops.
- **Static assets:** Always copy `.next/static` and `public` into `.next/standalone` after `npm run build`.

## Testing Guide

Detailed manual test plans are tracked outside the app directory:

- `../Test-Tasks.md`: Feature-by-feature validation checklist.
- `../Done-Tasks.md`: Completed implementation and QA history.
- `../To-Do.md`: Operational checklist and remaining manual notes.
- `../bug_audit_report.md`: Technical bug audit for quiz/security fixes.

Core smoke test:

```bash
npm run build
```

Then test these routes locally or in production:

- `/`
- `/karbala`
- `/karbala/gallery`
- `/karbala/cards`
- `/karbala/night/<slug>/quiz`
- `/admin`
- `/admin/quizzes`
- `/admin/gallery`

## Development Notes

- Keep UI changes aligned with the existing Karbala visual system and Tailwind theme tokens.
- Use Server Actions and API routes for trusted server-side operations.
- Do not expose quiz correct answers to the client before submission.
- Use Supabase RLS for public/admin boundaries, and keep migrations idempotent where possible.
- Keep static brand assets in `public`; uploaded content should go to Supabase Storage.
- Run `npm run build` before deployment or before handing off production-critical changes.
