import { execFileSync } from "node:child_process";
import { verifyDisposableDatabase } from "./database-safety";

await verifyDisposableDatabase();

// Functional tests intentionally use the checked disposable schema rather than replaying
// production migrations. Migration replay belongs in deployment checks, not a destructive test DB.
execFileSync(process.platform === "win32" ? "npx.cmd" : "npx", ["prisma", "db", "push", "--skip-generate"], {
  stdio: "inherit",
  env: process.env,
});
