#!/usr/bin/env node
/** Copy root `.env.local` into each app folder for Next.js dev/build. */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const source = path.join(ROOT, ".env.local");
const apps = ["web", "ops", "admin", "cms"];

if (!fs.existsSync(source)) {
  console.error("Missing .env.local at repo root. Copy .env.example first.");
  process.exit(1);
}

const contents = fs.readFileSync(source, "utf8");

for (const app of apps) {
  const surface =
    app === "web" ? "web" : app === "cms" ? "cms" : app;
  const port = { web: 3000, ops: 3001, admin: 3002, cms: 3003 }[app];
  const extra = [
    "",
    `# Auto-appended by sync-env for @pgs/app-${app}`,
    `NEXT_PUBLIC_PGS_SURFACE=${surface}`,
    `NEXT_PUBLIC_SITE_URL=http://localhost:${port}`,
  ].join("\n");

  const target = path.join(ROOT, "apps", app, ".env.local");
  fs.writeFileSync(target, `${contents.trim()}\n${extra}\n`, "utf8");
  console.log(`✓ apps/${app}/.env.local`);
}

console.log("Done. Restart dev servers if running.");
