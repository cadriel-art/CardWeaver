# CardWeaver

## Deployment & CI/CD Status
- **Current State:** Local-only setup with `npm run dev`. No documented env variables, Dockerfile, or CI pipelines.
- **Environment Variables Needed:**
  - `DATABASE_URL` – Postgres connection string
  - `PORT` (optional) – overrides default 5000
  - `SESSION_SECRET` (future auth work)
- **Recommended Enhancements:**
  1. Provide `.env.example` with placeholders.
  2. Add Dockerfile + docker-compose (app + Postgres).
  3. Configure GitHub Actions to run `npm run check`, tests, and build on push.
  4. Set up deploy workflow (e.g., Fly.io for API, Vercel for client) using secrets.

## TODO Summary
1. Backend CRUD extensions (update, delete, search filters).
2. Frontend UI for editing/deleting/filtering cards.
3. User galleries/authentication scaffolding.
4. Export/import tooling.
5. Complete deployment pipeline (Docker, CI workflows, hosting docs).
