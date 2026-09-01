# @pgs/app-cms

Deploy target: **cms.purpleguide.study** (premium dashboard CMS)

```bash
npm run dev:cms      # from repo root
npm run build:cms
```

Port **3003**. Routes at `/` (not `/dash`) on this deploy. Bridges → monolith `src/app/dash`, `src/features/dash-cms`.

See [../README.md](../README.md) and [../../docs/PHASE1_IMPLEMENTATION.md](../../docs/PHASE1_IMPLEMENTATION.md).
