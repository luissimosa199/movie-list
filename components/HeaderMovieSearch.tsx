"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import SearchBar from "@/components/SearchBar";

export default function HeaderMovieSearch() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const isMovieDetailPage =
    pathname.startsWith("/movies/") && pathname !== "/movies";

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isMovieDetailPage) {
    return null;
  }

  return (
    <>
      <div className="hidden min-w-0 flex-1 xl:block">
        <div className="mx-auto w-full max-w-md">
          <SearchBar compact className="z-[90]" />
        </div>
      </div>
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open movie search"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-zinc-100 shadow-lg shadow-black/25 hover:border-white/20 hover:bg-white/10"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
            />
          </svg>
        </button>
      </div>

      {isOpen ? (
        <div className="fixed inset-0 z-[70] md:hidden">
          <button
            type="button"
            aria-label="Close movie search"
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <div className="absolute inset-x-4 top-20 rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,26,37,0.98),rgba(10,14,22,0.98))] p-4 shadow-2xl shadow-black/50">
            <div className="mb-4 flex items-center justify-between border-b border-white/8 pb-4">
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.3em] text-zinc-500">
                  Quick Search
                </p>
                <p className="mt-1 text-lg font-semibold text-white">
                  Find another movie
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close search"
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-zinc-200 hover:border-white/20 hover:bg-white/10"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <SearchBar className="z-[90]" />
          </div>
        </div>
      ) : null}
    </>
  );
}
