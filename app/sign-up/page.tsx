import { redirect } from "next/navigation";
import AuthForm from "@/components/auth/AuthForm";
import { getServerSession } from "@/lib/auth-session";

export const metadata = {
  title: "Sign Up - Movie List",
  description:
    "Create a Movie List account for your watchlists, profile, and decision history.",
};

type SignUpPageProps = {
  searchParams: Promise<{
    redirectTo?: string;
  }>;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const session = await getServerSession();
  const params = await searchParams;
  const redirectTo = params.redirectTo || "/profile";

  if (session) {
    redirect(redirectTo);
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden px-4 pb-16 pt-8 text-white md:pt-10">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_26%),radial-gradient(circle_at_20%_25%,_rgba(16,185,129,0.12),_transparent_22%),linear-gradient(180deg,_rgba(15,23,42,0.78)_0%,_rgba(5,7,12,0.95)_32%,_rgba(5,7,12,1)_100%)]" />
      <div className="pointer-events-none absolute left-[-8rem] top-10 -z-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[-6rem] top-36 -z-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="page-frame">
        <div className="grid items-center gap-10 py-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14 lg:py-12">
          <section className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.32em] text-zinc-400 backdrop-blur">
              Start fresh
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">
                Build your watchlist home.
              </h1>
              <p className="max-w-xl text-base leading-7 text-zinc-300 md:text-lg">
                Create an account to keep movies, series, and decision tools in
                one private place with a cleaner path back into the app.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-sm font-medium text-white">One profile</p>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Save your viewing habits under a single private identity.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-sm font-medium text-white">
                  Shared decisions
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Keep your favorite games and outcomes available later.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-sm font-medium text-white">Fast setup</p>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Email and password are enough to get moving quickly.
                </p>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-emerald-500/15 bg-emerald-500/10 p-5 shadow-[0_20px_60px_rgba(16,185,129,0.08)]">
              <p className="text-sm leading-6 text-emerald-50/90">
                Registration stays lightweight. Use the same email each time so
                your lists and profile remain easy to return to.
              </p>
            </div>
          </section>

          <div className="lg:justify-self-end">
            <AuthForm mode="sign-up" redirectTo={redirectTo} />
          </div>
        </div>
      </div>
    </main>
  );
}
