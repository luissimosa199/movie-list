"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { authClient } from "@/lib/auth-client";

type AuthButtonsProps = {
  isSignedIn: boolean;
  variant?: "desktop" | "mobile";
};

export default function AuthButtons({
  isSignedIn,
  variant = "desktop",
}: AuthButtonsProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isMobile = variant === "mobile";

  if (!isSignedIn) {
    return (
      <Link
        href="/sign-in"
        className={
          isMobile
            ? "inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-black/20 hover:border-primary/40 hover:bg-white/10"
            : "inline-flex items-center justify-center rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-black/20 hover:border-primary/40 hover:bg-white/10"
        }
      >
        Sign In
      </Link>
    );
  }

  const handleSignOut = () => {
    setError(null);
    startTransition(async () => {
      const { error: signOutError } = await authClient.signOut();

      if (signOutError) {
        setError(signOutError.message || "Failed to sign out.");
        return;
      }

      router.push("/sign-in");
      router.refresh();
    });
  };

  return (
    <div className={isMobile ? "space-y-3" : "flex items-center gap-3"}>
      <Link
        href="/profile"
        className={
          isMobile
            ? "inline-flex w-full items-center justify-center rounded-2xl border border-primary/30 bg-primary/12 px-4 py-3 text-sm font-medium text-white hover:bg-primary/18"
            : "inline-flex items-center justify-center rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-sm font-medium text-white hover:bg-primary/18"
        }
      >
        Profile
      </Link>
      <button
        type="button"
        onClick={handleSignOut}
        disabled={isPending}
        className={
          isMobile
            ? "inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-sm font-medium text-zinc-300 hover:bg-white/8 hover:text-white disabled:opacity-60"
            : "inline-flex items-center justify-center rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-zinc-300 hover:border-white/20 hover:text-white disabled:opacity-60"
        }
      >
        {isPending ? "Signing out..." : "Sign Out"}
      </button>
      {error ? (
        <span className={isMobile ? "block text-center text-xs text-red-400" : "text-xs text-red-400"}>
          {error}
        </span>
      ) : null}
    </div>
  );
}
