import { execFileSync } from "node:child_process";

function testDatabaseName(value: string, variable: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${variable} must be a valid PostgreSQL URL`);
  }
  if (url.protocol !== "postgres:" && url.protocol !== "postgresql:") {
    throw new Error(`${variable} must use PostgreSQL`);
  }
  const name = url.pathname.replace(/^\//, "");
  if (!/(^|[_-])test($|[_-])/i.test(name)) {
    throw new Error(
      `${variable} must name an explicit test database (received "${name || "<empty>"}")`
    );
  }
  return name;
}

const databaseUrl = process.env.DATABASE_URL;
const directUrl = process.env.DIRECT_DATABASE_URL;
if (!databaseUrl || !directUrl) {
  throw new Error(
    "DATABASE_URL and DIRECT_DATABASE_URL are required and must point to a dedicated test database"
  );
}
const databaseName = testDatabaseName(databaseUrl, "DATABASE_URL");
const directDatabaseName = testDatabaseName(directUrl, "DIRECT_DATABASE_URL");
if (databaseName !== directDatabaseName) {
  throw new Error("DATABASE_URL and DIRECT_DATABASE_URL must target the same test database");
}

execFileSync(process.platform === "win32" ? "npx.cmd" : "npx", ["prisma", "migrate", "deploy"], {
  stdio: "inherit",
  env: process.env,
});
