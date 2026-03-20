"use client";

import SearchBar from "@/components/SearchBar";
import SeriesSearchBar from "@/components/SeriesSearchBar";

interface DiscoverySearchSectionProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  className?: string;
}

export default function DiscoverySearchSection({
  eyebrow = "Cross-Search",
  title = "Search movies and series without leaving the page.",
  description = "Use the dual search deck for quick jumps into the catalog while keeping the current page context intact.",
  className = "",
}: DiscoverySearchSectionProps) {
  return (
    <section
      className={`relative z-20 overflow-visible rounded-[1.9rem] border border-white/10 bg-[linear-gradient(135deg,rgba(17,24,39,0.92),rgba(7,10,18,0.98))] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.28)] md:p-6 ${className}`}
    >
      <div className="absolute inset-0 overflow-hidden rounded-[1.9rem]">
        <div className="absolute -left-10 top-0 h-28 w-28 rounded-full bg-blue-500/12 blur-3xl" />
        <div className="absolute right-0 top-10 h-24 w-24 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/8" />
      </div>

      <div className="relative z-10 space-y-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.32em] text-zinc-500">
              {eyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl">
              {title}
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-zinc-400 md:text-base">
            {description}
          </p>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <div className="rounded-[1.55rem] border border-white/10 bg-black/20 p-4 backdrop-blur-sm md:p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-zinc-500">
                  Movies
                </p>
                <p className="mt-1 text-sm text-zinc-300">
                  Saved-state aware when signed in
                </p>
              </div>
              <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-blue-200">
                Quick find
              </span>
            </div>
            <SearchBar />
          </div>

          <div className="rounded-[1.55rem] border border-white/10 bg-black/20 p-4 backdrop-blur-sm md:p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-zinc-500">
                  Series
                </p>
                <p className="mt-1 text-sm text-zinc-300">
                  Jump straight to TMDB show details
                </p>
              </div>
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-emerald-200">
                Long-form
              </span>
            </div>
            <SeriesSearchBar />
          </div>
        </div>
      </div>
    </section>
  );
}
