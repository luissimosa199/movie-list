"use client";

import CatalogSearch from "@/components/search/CatalogSearch";

interface DiscoverySearchSectionProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  className?: string;
}

const discoveryKinds = ["Movies", "Series", "People", "Directors"];

export default function DiscoverySearchSection({
  eyebrow = "Search",
  title = "Search the catalog.",
  description = "Find titles and people without leaving the page.",
  className = "",
}: DiscoverySearchSectionProps) {
  return (
    <section
      className={`relative z-[60] overflow-visible rounded-[1.9rem] border border-white/10 bg-[linear-gradient(135deg,rgba(17,24,39,0.92),rgba(7,10,18,0.98))] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.28)] md:p-6 ${className}`}
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

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_17rem] xl:items-start">
          <div className="relative z-0 rounded-[1.55rem] border border-white/10 bg-black/20 p-4 backdrop-blur-sm focus-within:z-[140] has-[input:not(:placeholder-shown)]:z-[140] md:p-5">
            <CatalogSearch
                            placeholder="Search movies, series, actors, and directors"
              limit={6}
            />
          </div>

          <div className="flex flex-wrap gap-2 xl:flex-col xl:pt-1">
            {discoveryKinds.map((kind) => (
              <span
                key={kind}
                className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-zinc-400"
              >
                {kind}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

