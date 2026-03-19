import { redirect } from "next/navigation";
import AuthForm from "@/components/auth/AuthForm";
import { getServerSession } from "@/lib/auth-session";

export const metadata = {
  title: "Sign In - Movie List",
  description:
    "Sign in to access your Movie List profile, watchlists, and decision history.",
};

type SignInPageProps = {
  searchParams: Promise<{
    redirectTo?: string;
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const session = await getServerSession();
  const params = await searchParams;
  const redirectTo = params.redirectTo || "/profile";

  if (session) {
    redirect(redirectTo);
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden px-4 pb-16 pt-8 text-white md:pt-10">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_26%),radial-gradient(circle_at_80%_20%,_rgba(244,114,182,0.12),_transparent_24%),linear-gradient(180deg,_rgba(15,23,42,0.78)_0%,_rgba(5,7,12,0.95)_32%,_rgba(5,7,12,1)_100%)]" />
      <div className="pointer-events-none absolute left-[-8rem] top-10 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[-6rem] top-40 -z-10 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="page-frame">
        <div className="grid items-center gap-10 py-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14 lg:py-12">
          <section className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.32em] text-zinc-400 backdrop-blur">
              Protected access
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">
                Return to your tracker.
              </h1>
              <p className="max-w-xl text-base leading-7 text-zinc-300 md:text-lg">
                Sign in to pick up your watchlist, profile, and decision history
                from the same place you left them.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-sm font-medium text-white">Saved lists</p>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Keep movies and series organized without losing progress.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-sm font-medium text-white">Profile sync</p>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Your private profile and preferences stay connected.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-sm font-medium text-white">Fast return</p>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  One step back into browsing, decisions, and discovery.
                </p>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-primary/15 bg-primary/10 p-5 shadow-[0_20px_60px_rgba(37,99,235,0.08)]">
              <p className="text-sm leading-6 text-blue-50/90">
                Use the email tied to your account. We will send you straight
                back to your saved destination after sign-in.
              </p>
            </div>
          </section>

          <div className="lg:justify-self-end">
            <AuthForm mode="sign-in" redirectTo={redirectTo} />
          </div>
        </div>
      </div>
    </main>
  );
}
