# Supabase setup — pgs_app

## Current state (your machine)

| Item | Status |
|------|--------|
| **Local Supabase running?** | **No** — not using `supabase start` today |
| **Supabase CLI** | Available via `npx supabase` (v2.x); not installed globally |
| **`supabase/config.toml`** | Present (scaffold) |
| **`supabase/migrations/`** | Copied from **pgs-v3** (source of schema truth) |
| **`.env.local`** | Points to **hosted** project (cloud), not localhost |
| **GitHub** | `origin` → `github.com/patienceSweetChild/pgs_app` |

You are **not** on local CLI today — your app reads a **cloud** Supabase URL from `.env.local`.

---

## Path A — Keep your hosted Supabase project (recommended)

You already have a project ref in `.env.local`. Finish wiring:

### 1. Sync env to all four apps

Next.js loads env from **each app folder**, not the monolith root.

```powershell
cd e:\pgs\pgs_app
copy .env.example .env.local   # if starting fresh — fill keys from dashboard
npm run sync:env
```

### 2. Install CLI (optional global)

```powershell
npm install -g supabase
# or always: npx supabase <command>
```

### 3. Login + link project

```powershell
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
```

Get `YOUR_PROJECT_REF` from dashboard URL:  
`https://supabase.com/dashboard/project/<ref>/...`

### 4. Push schema (migrations from pgs-v3)

```powershell
npx supabase db push
```

Review diff first if this is an existing DB with data:

```powershell
npx supabase db diff --linked
```

### 5. Auth redirect URLs (dashboard → Authentication → URL configuration)

Add for local + prod:

- `http://localhost:3000/auth/callback`
- `http://localhost:3001/auth/callback`
- `http://localhost:3002/auth/callback`
- `http://localhost:3003/auth/callback`
- `https://purpleguide.study/auth/callback`
- `https://ops.purpleguide.study/auth/callback`
- `https://admin.purpleguide.study/auth/callback`
- `https://cms.purpleguide.study/auth/callback`

Site URL: `http://localhost:3000` (dev) or `https://purpleguide.study` (prod).

---

## Path B — Local Supabase (Docker)

Requires [Docker Desktop](https://www.docker.com/products/docker-desktop/).

```powershell
cd e:\pgs\pgs_app
npx supabase start
npx supabase status
```

Copy **API URL** and **anon key** from `supabase status` into `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key from status>
SUPABASE_SERVICE_ROLE_KEY=<service_role key from status>
```

Then:

```powershell
npx supabase db reset    # applies migrations + seed
npm run sync:env
npm run dev:web
```

Local Studio: http://127.0.0.1:54323

---

## Path C — Brand-new Supabase cloud project

1. Create project at [supabase.com/dashboard](https://supabase.com/dashboard)
2. Copy API keys → `.env.local` (use `.env.example` template)
3. `npx supabase link --project-ref <new-ref>`
4. `npx supabase db push`
5. `npm run sync:env`

---

## GitHub

Remote already configured:

```
origin  https://github.com/patienceSweetChild/pgs_app.git
```

**Never commit** `.env.local`, `apps/*/.env.local`, or service role keys.

When ready to push code:

```powershell
git add .
git status                    # verify no .env files staged
git commit -m "Phase 1: four-app monorepo split"
git push origin master
```

---

## Security notes

- `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS — server only, never `NEXT_PUBLIC_*`
- Rotate keys if they were ever pasted in chat or committed
- `GROQ_API_KEY` is optional (Ops AI features)

See also: [PHASE1_IMPLEMENTATION.md](./PHASE1_IMPLEMENTATION.md)
