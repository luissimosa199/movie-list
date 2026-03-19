"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { authClient } from "@/lib/auth-client";

type AuthButtonsProps = {
  isSignedIn: boolean;
};

export default function AuthButtons({ isSignedIn }: AuthButtonsProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!isSignedIn) {
    return (
      <Link
        href="/sign-in"
        className="text-sm font-medium tracking-wide hover:text-primary transition-colors duration-200"
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
    <div className="flex items-center gap-4">
      <Link
        href="/profile"
        className="text-sm font-medium tracking-wide hover:text-primary transition-colors duration-200"
      >
        Profile
      </Link>
      <button
        type="button"
        onClick={handleSignOut}
        disabled={isPending}
        className="text-sm font-medium tracking-wide text-zinc-400 hover:text-white transition-colors duration-200 disabled:opacity-60"
      >
        {isPending ? "Signing out..." : "Sign Out"}
      </button>
      {error ? <span className="text-xs text-red-400">{error}</span> : null}
    </div>
  );
}
