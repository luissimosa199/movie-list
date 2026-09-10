import { execFileSync } from "node:child_process";
import { verifyDisposableDatabase } from "./database-safety";

async function main(): Promise<void> {
  await verifyDisposableDatabase();

  // Functional tests intentionally use the checked disposable schema rather than replaying
  // production migrations. Migration replay belongs in deployment checks, not a destructive test DB.
  const prismaCommand = process.platform === "win32" ? (process.env.ComSpec ?? "cmd.exe") : "npx";
  const prismaArgs = process.platform === "win32"
    ? ["/d", "/s", "/c", "npx", "prisma", "db", "push", "--skip-generate"]
    : ["prisma", "db", "push", "--skip-generate"];
  execFileSync(prismaCommand, prismaArgs, {
    stdio: "inherit",
    env: process.env,
  });
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
