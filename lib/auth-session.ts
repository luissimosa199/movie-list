import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";

export async function getServerSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

export async function requireSession(redirectTo?: string) {
  const session = await getServerSession();

  if (!session) {
    const signInURL = redirectTo
      ? `/sign-in?redirectTo=${encodeURIComponent(redirectTo)}`
      : "/sign-in";

    redirect(signInURL);
  }

  return session;
}
