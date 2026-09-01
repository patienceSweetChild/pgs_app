# @pgs/app-ops

Deploy target: **ops.purpleguide.study** (staff CRM / operations)

```bash
npm run dev:ops      # from repo root
npm run build:ops
```

Port **3001**. Routes at `/` (not `/ops`) on this deploy. Bridges → monolith `src/app/ops`, `src/app/api/staff`, `src/app/api/ops`.

See [../README.md](../README.md) and [../../docs/PHASE1_IMPLEMENTATION.md](../../docs/PHASE1_IMPLEMENTATION.md).
