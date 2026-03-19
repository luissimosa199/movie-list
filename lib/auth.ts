import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import prisma from "./prisma";

const baseURL = process.env.BETTER_AUTH_URL || "http://localhost:3000";
const secret =
  process.env.BETTER_AUTH_SECRET ||
  "replace-this-development-secret-before-production";

export const auth = betterAuth({
  baseURL,
  secret,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  plugins: [nextCookies()],
});
