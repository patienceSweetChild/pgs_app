# @pgs/app-admin

Deploy target: **admin.purpleguide.study** (site CMS)

```bash
npm run dev:admin    # from repo root
npm run build:admin
```

Port **3002**. Routes at `/` (not `/admin`) on this deploy. Bridges → monolith `src/app/admin`, `src/app/cms-preview`.

See [../README.md](../README.md) and [../../docs/PHASE1_IMPLEMENTATION.md](../../docs/PHASE1_IMPLEMENTATION.md).
