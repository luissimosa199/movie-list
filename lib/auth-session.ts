import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

export async function getServerSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

export async function getRequestSession(request: Request) {
  return auth.api.getSession({
    headers: request.headers,
  });
}

function buildSignInURL(redirectTo?: string) {
  return redirectTo
    ? `/sign-in?redirectTo=${encodeURIComponent(redirectTo)}`
    : "/sign-in";
}

export async function getCurrentUser() {
  const session = await getServerSession();

  return session?.user ?? null;
}

export async function getRequestUser(request: Request) {
  const session = await getRequestSession(request);

  return session?.user ?? null;
}

export async function requireSession(redirectTo?: string) {
  const session = await getServerSession();

  if (!session) {
    redirect(buildSignInURL(redirectTo));
  }

  return session;
}

export async function requireUser(redirectTo?: string) {
  const session = await requireSession(redirectTo);

  return session.user;
}
