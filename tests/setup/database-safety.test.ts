import { afterEach, describe, expect, it, vi } from "vitest";
import { assertMatchingTestTargets, parseTestDatabaseUrl } from "./database-safety";

afterEach(() => vi.unstubAllEnvs());

describe("disposable test database guard", () => {
  it("accepts loopback synthetic endpoints without requiring identical host spellings", () => {
    const runtime = parseTestDatabaseUrl(
      "postgresql://postgres:postgres@localhost:5432/movie_list_test?schema=public",
      "DATABASE_URL"
    );
    const direct = parseTestDatabaseUrl(
      "postgresql://postgres:postgres@127.0.0.1:5432/movie_list_test?schema=public",
      "DIRECT_DATABASE_URL"
    );
    expect(() => assertMatchingTestTargets(runtime, direct)).not.toThrow();
  });

  it.each([
    "postgresql://postgres:postgres@localhost:5432/movie_list",
    "postgresql://real-user:real-password@db.example.com:5432/movie_list_test",
    "postgresql://postgres:production-secret@localhost:5432/movie_list_test",
  ])("rejects an unsafe target before any database operation: %s", (url) => {
    expect(() => parseTestDatabaseUrl(url, "DATABASE_URL")).toThrow();
  });

  it("rejects different database names or schemas", () => {
    const runtime = parseTestDatabaseUrl(
      "postgresql://postgres:postgres@localhost:5432/movie_list_test?schema=public",
      "DATABASE_URL"
    );
    const other = parseTestDatabaseUrl(
      "postgresql://postgres:postgres@localhost:5432/other_test?schema=public",
      "DIRECT_DATABASE_URL"
    );
    expect(() => assertMatchingTestTargets(runtime, other)).toThrow(/same test database/);
  });

  it("rejects two same-named databases on different endpoints", () => {
    const runtime = parseTestDatabaseUrl(
      "postgresql://postgres:postgres@localhost:5432/movie_list_test?schema=public",
      "DATABASE_URL"
    );
    const other = parseTestDatabaseUrl(
      "postgresql://postgres:postgres@127.0.0.1:5433/movie_list_test?schema=public",
      "DIRECT_DATABASE_URL"
    );
    expect(() => assertMatchingTestTargets(runtime, other)).toThrow(/same test database/);
  });

  it("requires an explicit disposable acknowledgement for remote test infrastructure", () => {
    const url = "postgresql://test:test@db.example.com:5432/movie_list_test?schema=public";
    expect(() => parseTestDatabaseUrl(url, "DATABASE_URL")).toThrow(/loopback/);
    vi.stubEnv("LAST_TEST_DATABASE_ACK", "I_UNDERSTAND_THIS_IS_DISPOSABLE");
    expect(() => parseTestDatabaseUrl(url, "DATABASE_URL")).not.toThrow();
    const other = parseTestDatabaseUrl(
      "postgresql://test:test@other.example.com:5432/movie_list_test?schema=public",
      "DIRECT_DATABASE_URL"
    );
    const target = parseTestDatabaseUrl(url, "DATABASE_URL");
    expect(() => assertMatchingTestTargets(target, other)).toThrow(/same test database/);
  });
});
