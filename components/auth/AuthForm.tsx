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
    <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl shadow-black/30">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
          Better Auth
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">
          {isSignUp ? "Create account" : "Sign in"}
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          {isSignUp
            ? "Create a simple email/password account for your movie tracker."
            : "Sign in to access your protected profile pages."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignUp ? (
          <label className="block">
            <span className="mb-2 block text-sm text-zinc-300">Name</span>
            <input
              name="name"
              type="text"
              required
              autoComplete="name"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-zinc-600"
            />
          </label>
        ) : null}

        <label className="block">
          <span className="mb-2 block text-sm text-zinc-300">Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-zinc-600"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-zinc-300">Password</span>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete={isSignUp ? "new-password" : "current-password"}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-zinc-600"
          />
        </label>

        {error ? (
          <p className="rounded-lg border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
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

      <p className="mt-6 text-sm text-zinc-400">
        {isSignUp ? "Already have an account?" : "Need an account?"}{" "}
        <Link
          href={isSignUp ? `/sign-in?redirectTo=${encodeURIComponent(redirectTo)}` : `/sign-up?redirectTo=${encodeURIComponent(redirectTo)}`}
          className="text-white underline decoration-zinc-700 underline-offset-4 hover:decoration-zinc-300"
        >
          {isSignUp ? "Sign in" : "Create one"}
        </Link>
      </p>
    </div>
  );
}
