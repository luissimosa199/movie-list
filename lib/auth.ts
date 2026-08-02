import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import prisma from "./prisma";

// Vercel exposes two hostnames for one preview. VERCEL_URL is unique per
// deployment, while VERCEL_BRANCH_URL is the branch alias Vercel links from the
// pull request -- which is where visitors actually arrive. Trusting only
// VERCEL_URL failed every preview sign-in with INVALID_ORIGIN.
const vercelOrigins = [process.env.VERCEL_BRANCH_URL, process.env.VERCEL_URL]
  .filter((host): host is string => Boolean(host))
  .map((host) => `https://${host}`);

// On a preview the production BETTER_AUTH_URL names a host the visitor never
// loaded, so cookies and callbacks land on the wrong origin even once the
// origin check passes.
const baseURL =
  (process.env.VERCEL_ENV === "preview" ? vercelOrigins[0] : undefined) ||
  process.env.BETTER_AUTH_URL ||
  "http://localhost:3000";
const secret =
  process.env.BETTER_AUTH_SECRET ||
  "replace-this-development-secret-before-production";

const trustedOrigins = Array.from(
  new Set(
    [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      baseURL,
      ...vercelOrigins,
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
    minPasswordLength: 7,
  },
  plugins: [nextCookies()],
});
