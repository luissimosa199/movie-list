"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AuthButtons from "./AuthButtons";
import NavLinks from "./NavLinks";
import ViewToggle from "./ViewToggle";

type MobileMenuProps = {
  isSignedIn: boolean;
};

export default function MobileMenu({ isSignedIn }: MobileMenuProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = isOpen ? "hidden" : originalOverflow;

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-zinc-100 shadow-lg shadow-black/25 hover:border-white/20 hover:bg-white/10"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M4 7h16M4 12h16M4 17h16"
            />
          )}
        </svg>
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          />

          <div className="absolute inset-x-4 top-24 rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,26,37,0.98),rgba(10,14,22,0.98))] p-4 shadow-2xl shadow-black/50">
            <div className="mb-4 flex items-center justify-between border-b border-white/8 pb-4">
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.3em] text-zinc-500">
                  Navigation
                </p>
                <p className="mt-1 text-lg font-semibold text-white">
                  Browse the app
                </p>
              </div>
              <span className="rounded-full border border-primary/25 bg-primary/12 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-blue-200">
                Menu
              </span>
            </div>

            <NavLinks mobile onNavigate={() => setIsOpen(false)} />

            <div className="mt-4 rounded-3xl border border-white/8 bg-white/4 p-3">
              <p className="mb-3 text-[0.72rem] uppercase tracking-[0.28em] text-zinc-500">
                Layout
              </p>
              <ViewToggle
                showLabel
                className="w-full justify-between rounded-2xl px-4 py-3"
              />
            </div>

            <div className="mt-4 border-t border-white/8 pt-4">
              <AuthButtons isSignedIn={isSignedIn} variant="mobile" />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
