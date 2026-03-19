import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import prisma from "./prisma";

const baseURL = process.env.BETTER_AUTH_URL || "http://localhost:3000";
const secret =
  process.env.BETTER_AUTH_SECRET ||
  "replace-this-development-secret-before-production";

const trustedOrigins = Array.from(
  new Set(
    [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      baseURL,
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
      ...(process.env.BETTER_AUTH_TRUSTED_ORIGINS || "")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
    ].filter((origin): origin is string => Boolean(origin))
  )
);

export const auth = betterAuth({
  baseURL,
  secret,
  trustedOrigins,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  plugins: [nextCookies()],
});
