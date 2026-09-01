#!/usr/bin/env node
/** Quick check that all four dev servers respond. */
const ports = [
  { name: "web", port: 3000, path: "/" },
  { name: "ops", port: 3001, path: "/login" },
  { name: "admin", port: 3002, path: "/login" },
  { name: "cms", port: 3003, path: "/login" },
];

let failed = false;

for (const { name, port, path } of ports) {
  const url = `http://127.0.0.1:${port}${path}`;
  try {
    const res = await fetch(url, { redirect: "manual" });
    const ok = res.status === 200 || res.status === 307 || res.status === 308;
    const mark = ok ? "✓" : "✗";
    console.log(`${mark} ${name.padEnd(5)} :${port}${path} → HTTP ${res.status}`);
    if (!ok) failed = true;
  } catch (err) {
    failed = true;
    console.log(`✗ ${name.padEnd(5)} :${port}${path} → ${err instanceof Error ? err.message : err}`);
  }
}

if (failed) {
  console.log("\nStart servers: npm run dev:kill && npm run dev:all");
  process.exit(1);
}

console.log("\nAll four apps are responding. Open:");
console.log("  http://127.0.0.1:3002/login  (admin)");
console.log("  http://127.0.0.1:3001/login  (ops)");
console.log("  http://127.0.0.1:3000/        (student)");
