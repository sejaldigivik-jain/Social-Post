import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const envPath = resolve(root, ".env");
const prismaCli = resolve(root, "node_modules", "prisma", "build", "index.js");

function loadEnvFile() {
  if (!existsSync(envPath)) {
    console.error("[Social Post] .env was not found. Copy .env.example to .env and fill the NEW Social Post values first.");
    process.exit(1);
  }
  const raw = readFileSync(envPath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (!m) continue;
    const [, key, rawValue] = m;
    if (process.env[key]) continue;
    process.env[key] = rawValue.replace(/^['"]|['"]$/g, "");
  }
}

function required(key) {
  const value = (process.env[key] ?? "").trim();
  if (!value || /YOUR_|replace-with|change-me/i.test(value)) {
    console.error(`[Social Post] ${key} is missing or still contains a placeholder.`);
    process.exit(1);
  }
  return value;
}

function run(command, args, label) {
  console.log(`\n[Social Post] ${label}...`);
  const r = spawnSync(command, args, { cwd: root, stdio: "inherit", env: process.env, shell: false });
  if (r.error || r.status !== 0) {
    console.error(`[Social Post] ${label} failed.`);
    process.exit(r.status ?? 1);
  }
}

loadEnvFile();
const databaseUrl = required("DATABASE_URL");
const directUrl = required("DIRECT_URL");
required("NEXT_PUBLIC_SUPABASE_URL");
if (!(process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)) {
  console.error("[Social Post] Add SUPABASE_SECRET_KEY (recommended) or legacy SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}
required("JWT_SECRET");
required("TOKEN_ENCRYPTION_KEY");
required("CRON_SECRET");

if (!/^postgres(ql)?:\/\//i.test(databaseUrl) || !/^postgres(ql)?:\/\//i.test(directUrl)) {
  console.error("[Social Post] DATABASE_URL and DIRECT_URL must be PostgreSQL URLs from the NEW Social Post Supabase project.");
  process.exit(1);
}
if (!existsSync(prismaCli)) {
  console.error("[Social Post] Prisma CLI is missing. Run npm.cmd install first.");
  process.exit(1);
}

run(process.execPath, [prismaCli, "generate"], "Generating Prisma Client");
run(process.execPath, [prismaCli, "db", "push", "--skip-generate"], "Creating fresh Social Post tables in Supabase");
run(process.execPath, [resolve(root, "scripts", "setup-supabase-storage.mjs")], "Creating/verifying the Social Post media bucket");

console.log("\n[Social Post] Fresh backend setup completed.");
console.log("[Social Post] No Loomic data was imported.");
console.log("[Social Post] Next: npm.cmd run dev, then create your first Social Post account in the UI.");
