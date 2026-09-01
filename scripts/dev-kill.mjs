#!/usr/bin/env node
/** Stop dev servers on ports 3000–3003 (Windows + Unix). */
import { execSync } from "node:child_process";

const PORTS = [3000, 3001, 3002, 3003];
const isWin = process.platform === "win32";

function killOnWindows(port) {
  let out = "";
  try {
    out = execSync(`netstat -ano | findstr :${port}`, { encoding: "utf8" });
  } catch {
    return;
  }
  const pids = new Set();
  for (const line of out.split("\n")) {
    if (!line.includes("LISTENING")) continue;
    const parts = line.trim().split(/\s+/);
    const pid = Number.parseInt(parts.at(-1) ?? "", 10);
    if (pid > 0) pids.add(pid);
  }
  for (const pid of pids) {
    try {
      execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
      console.log(`✓ Stopped PID ${pid} (port ${port})`);
    } catch {
      // already gone
    }
  }
}

function killOnUnix(port) {
  try {
    execSync(`lsof -ti :${port} | xargs kill -9 2>/dev/null`, {
      shell: true,
      stdio: "ignore",
    });
    console.log(`✓ Cleared port ${port}`);
  } catch {
    // nothing listening
  }
}

for (const port of PORTS) {
  if (isWin) killOnWindows(port);
  else killOnUnix(port);
}

console.log("Done. Run: npm run dev:all");
