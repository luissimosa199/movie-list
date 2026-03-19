"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { authClient } from "@/lib/auth-client";

type AuthFormProps = {
  mode: "sign-in" | "sign-up";
  redirectTo: string;
};

export default function AuthForm({ mode, redirectTo }: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isSignUp = mode === "sign-up";
  const destinationLink = isSignUp
    ? `/sign-in?redirectTo=${encodeURIComponent(redirectTo)}`
    : `/sign-up?redirectTo=${encodeURIComponent(redirectTo)}`;
  const title = isSignUp ? "Create your account" : "Sign in to continue";
  const eyebrow = isSignUp ? "Create account" : "Welcome back";
  const description = isSignUp
    ? "Create a simple account to keep your watchlist, profile, and decision history in one place."
    : "Pick up where you left off and return to your saved lists, profile, and decision tools.";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const name = String(formData.get("name") || "").trim();

    startTransition(async () => {
      if (isSignUp) {
        const { error: signUpError } = await authClient.signUp.email({
          email,
          password,
          name,
        });

        if (signUpError) {
          setError(signUpError.message || "Failed to create account.");
          return;
        }
      } else {
        const { error: signInError } = await authClient.signIn.email({
          email,
          password,
        });

        if (signInError) {
          setError(signInError.message || "Invalid email or password.");
          return;
        }
      }

      router.push(redirectTo);
      router.refresh();
    });
  };

  return (
    <div className="relative w-full max-w-[28rem] overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0a0d14]/95 p-6 shadow-[0_32px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl md:p-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="pointer-events-none absolute -right-16 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative">
        <p className="text-xs uppercase tracking-[0.34em] text-zinc-500">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-[2rem]">
          {title}
        </h2>
        <p className="mt-3 max-w-[36ch] text-sm leading-6 text-zinc-400 md:text-[0.96rem]">
          {description}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative mt-8 space-y-5">
        {isSignUp ? (
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-zinc-200">
              Name
            </span>
            <span className="mb-2 block text-xs text-zinc-500">
              This will appear on your profile.
            </span>
            <input
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="Your name"
              disabled={isPending}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none transition placeholder:text-zinc-600 focus:border-primary/40 focus:bg-white/10 focus:shadow-[0_0_0_1px_rgba(59,130,246,0.2)] disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>
        ) : null}

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-zinc-200">
            Email
          </span>
          <span className="mb-2 block text-xs text-zinc-500">
            Use the address tied to your watchlist.
          </span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            disabled={isPending}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none transition placeholder:text-zinc-600 focus:border-primary/40 focus:bg-white/10 focus:shadow-[0_0_0_1px_rgba(59,130,246,0.2)] disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-zinc-200">
            Password
          </span>
          <span className="mb-2 block text-xs text-zinc-500">
            {isSignUp
              ? "Use at least 7 characters."
              : "Use the password you already created."}
          </span>
          <input
            name="password"
            type="password"
            required
            minLength={7}
            autoComplete={isSignUp ? "new-password" : "current-password"}
            placeholder="Enter password"
            disabled={isPending}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none transition placeholder:text-zinc-600 focus:border-primary/40 focus:bg-white/10 focus:shadow-[0_0_0_1px_rgba(59,130,246,0.2)] disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>

        {error ? (
          <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-white px-4 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending
            ? isSignUp
              ? "Creating account..."
              : "Signing in..."
            : isSignUp
              ? "Create account"
              : "Sign in"}
        </button>

      </form>

      <p className="mt-6 text-sm leading-6 text-zinc-400">
        {isSignUp ? "Already have an account?" : "Need an account?"}{" "}
        <Link
          href={destinationLink}
          className="font-medium text-white underline decoration-white/20 underline-offset-4 transition hover:decoration-white/50"
        >
          {isSignUp ? "Sign in" : "Create one"}
        </Link>
      </p>
    </div>
  );
}
