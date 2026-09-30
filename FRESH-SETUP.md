# Social Post — Fresh Independent Setup

This build is for a completely fresh Social Post installation.
It does not include a Loomic `.env`, Loomic database content, Loomic sessions, Loomic social tokens, or migration tooling.

## Order
1. Create a new Supabase project.
2. Create a new Meta app for Social Post.
3. `Copy-Item .env.example .env` and fill only NEW Social Post credentials. For Supabase server access, prefer the new `sb_secret_...` key in `SUPABASE_SECRET_KEY`; the legacy `service_role` key is only a fallback.
4. Generate 3 different random secrets for JWT, token encryption and cron.
5. `npm.cmd install`
6. `npm.cmd run fresh:setup`
7. `npm.cmd run build`
8. `npm.cmd run dev`
9. Open http://localhost:3000 and create a new Social Post account.
10. In Settings -> Integrations, configure Instagram if you prefer workspace-specific credentials, or use the `.env` fallback.
11. Connect one Instagram Business/Creator account and test image, Reel and schedule publishing.
12. Only after local success, create a separate GitHub repo and Vercel project.

## Safety
- Never run `prisma migrate reset`.
- Do not use Loomic DATABASE_URL/DIRECT_URL.
- Do not use Loomic Supabase service-role keys.
- Do not use Loomic Meta App ID/Secret.
- Never paste secrets into chat.
