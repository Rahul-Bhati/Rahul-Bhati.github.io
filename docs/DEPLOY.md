# Deploying to Vercel

This app needs a server runtime (auth, Postgres, uploads, analytics), so it deploys to **Vercel**, not GitHub Pages.

## 1. Push the branch

```bash
git add -A
git commit -m "Portfolio CMS: auth, dashboard, blog + project CMS, SEO/GEO"
git push -u origin portfolio-2026-with-auth
```

## 2. Import the repo in Vercel

1. vercel.com → **Add New… → Project** → import this GitHub repo.
2. Framework preset: **Next.js** (auto-detected). Leave build/output settings default.
3. **Before the first deploy**, add Environment Variables (Settings → Environment Variables). Copy the values from your local `.env.local`:

| Variable | Notes |
|---|---|
| `DATABASE_URL` | Supabase pooled (`:6543`, `?pgbouncer=true`) |
| `DIRECT_URL` | Supabase direct (`:5432`) |
| `NEXT_PUBLIC_SUPABASE_URL` | |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | |
| `SUPABASE_SERVICE_ROLE_KEY` | server-only |
| `ADMIN_EMAIL` | |
| `ADMIN_PASSWORD_HASH` | **escape `$` as `\$`** (same as `.env.local`) |
| `AUTH_SECRET` | |
| `PAGESPEED_API_KEY` | optional |

> **Do NOT set `NEXT_PUBLIC_SITE_URL` yet.** With it unset, the app auto-uses your `*.vercel.app` URL (via `VERCEL_PROJECT_PRODUCTION_URL`) for canonical URLs, sitemap, OG images, and llms.txt. Set it only once you connect a custom domain (step 4).

4. **Deploy.** Vercel runs the `vercel-build` script: **`prisma migrate deploy && next build`** — so pending migrations are applied to the database automatically on every deploy (idempotent; it never wipes data). This is what prevents the "table does not exist" build failure.

## 3. Verify the live site

- `https://<your>.vercel.app` — home, blog, projects, map
- `/admin/login` — sign in with your admin email + password
- `/sitemap.xml`, `/robots.txt`, `/llms.txt` — populated from the DB
- Dashboard SEO scores now populate (PageSpeed can reach the public URL)

## 4. Connect a custom domain (later)

1. Buy the domain, add it in Vercel → Settings → Domains.
2. Set `NEXT_PUBLIC_SITE_URL=https://yourdomain.com` in Environment Variables.
3. Redeploy. All canonical URLs / sitemap / OG / llms.txt switch to the new domain automatically.

## Notes
- `.env.local` is gitignored — secrets never reach the repo. `.env.example` documents the shape.
- Supabase Storage `media` bucket is public with a 50 MB cap (free-tier global limit).
- The Supabase free tier pauses the database after ~1 week of inactivity; the first request after a pause may be slow.
