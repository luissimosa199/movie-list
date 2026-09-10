import { PrismaClient } from "@prisma/client";

const TEST_DATABASE_NAME = /(^|[_-])test($|[_-])/i;
const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);
const DISPOSABLE_ACK = "I_UNDERSTAND_THIS_IS_DISPOSABLE";

export type TestDatabaseTarget = {
  variable: string;
  url: string;
  database: string;
  schema: string;
  endpoint: string;
  loopback: boolean;
  syntheticCredentials: boolean;
};

function decode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function parseTestDatabaseUrl(value: string | undefined, variable: string): TestDatabaseTarget {
  if (!value) throw new Error(`${variable} is required and must point to a dedicated test database`);
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${variable} must be a valid PostgreSQL URL`);
  }
  if (url.protocol !== "postgres:" && url.protocol !== "postgresql:") {
    throw new Error(`${variable} must use PostgreSQL`);
  }
  const database = decode(url.pathname.replace(/^\//, ""));
  if (!TEST_DATABASE_NAME.test(database)) {
    throw new Error(`${variable} must name an explicit test database`);
  }
  const host = url.hostname.replace(/^\[|\]$/g, "").toLowerCase();
  const endpointHost = LOOPBACK_HOSTS.has(host) ? "loopback" : host;
  const endpoint = `${endpointHost}:${url.port || "5432"}`;
  const username = decode(url.username).toLowerCase();
  const password = decode(url.password).toLowerCase();
  const syntheticCredentials =
    (username === "postgres" && password === "postgres") ||
    ((username === "test" || username === "ci") && (password === "test" || password === "ci"));
  const explicitlyAcknowledged = process.env.LAST_TEST_DATABASE_ACK === DISPOSABLE_ACK;
  if ((!LOOPBACK_HOSTS.has(host) || !syntheticCredentials) && !explicitlyAcknowledged) {
    throw new Error(`${variable} must use loopback and synthetic test credentials (or explicit disposable acknowledgement)`);
  }
  const schema = url.searchParams.get("schema") ?? "public";
  if (!/^[A-Za-z_][A-Za-z0-9_$]*$/.test(schema)) {
    throw new Error(`${variable} has an invalid PostgreSQL schema`);
  }
  return { variable, url: value, database, schema, endpoint, loopback: LOOPBACK_HOSTS.has(host), syntheticCredentials };
}

export function assertMatchingTestTargets(runtime: TestDatabaseTarget, direct: TestDatabaseTarget): void {
  if (runtime.database !== direct.database || runtime.schema !== direct.schema || runtime.endpoint !== direct.endpoint) {
    throw new Error("DATABASE_URL and DIRECT_DATABASE_URL must target the same test database and schema");
  }
}

async function readIdentity(target: TestDatabaseTarget): Promise<void> {
  const client = new PrismaClient({ datasourceUrl: target.url });
  try {
    const rows = await client.$queryRaw<Array<{ database: string; schema: string }>>`SELECT current_database() AS database, current_schema() AS schema`;
    const identity = rows[0];
    if (!identity || identity.database !== target.database || identity.schema !== target.schema) {
      throw new Error(`${target.variable} connected to an unexpected database or schema`);
    }
  } finally {
    await client.$disconnect();
  }
}

export async function verifyDisposableDatabase(): Promise<void> {
  const runtime = parseTestDatabaseUrl(process.env.DATABASE_URL, "DATABASE_URL");
  const direct = parseTestDatabaseUrl(process.env.DIRECT_DATABASE_URL, "DIRECT_DATABASE_URL");
  assertMatchingTestTargets(runtime, direct);
  await Promise.all([readIdentity(runtime), readIdentity(direct)]);
}
