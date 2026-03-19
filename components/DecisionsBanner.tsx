import React from "react";
import Link from "next/link";

interface DecisionsBannerProps {
  className?: string;
}

const DecisionsBanner: React.FC<DecisionsBannerProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(17,24,39,0.94),rgba(20,25,38,0.9))] p-6 shadow-2xl shadow-black/25 transition-all duration-300 hover:border-white/16 hover:shadow-black/40 md:p-8 ${className}`}
    >
      <div className="absolute inset-0">
        <div className="absolute -right-16 top-0 h-40 w-40 rounded-full bg-fuchsia-500/15 blur-3xl" />
        <div className="absolute left-0 top-0 h-44 w-44 rounded-full bg-blue-500/12 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/8" />
      </div>

      <div className="absolute inset-0 opacity-[0.06]">
        <div className="flex rotate-12 scale-150 flex-wrap gap-8">
          <div className="text-4xl">🎲</div>
          <div className="text-4xl">🆚</div>
          <div className="text-4xl">🎮</div>
          <div className="text-4xl">⚡</div>
          <div className="text-4xl">🎯</div>
          <div className="text-4xl">🎪</div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1 text-center lg:text-left">
          <p className="mb-3 text-[0.68rem] font-medium uppercase tracking-[0.32em] text-zinc-500">
            Decision Mode
          </p>

          <div className="mb-4 flex items-center justify-center gap-2 lg:justify-start">
            <span className="text-2xl">🎲</span>
            <h2 className="text-2xl font-semibold tracking-tight text-white md:text-[2rem]">
              Can&apos;t Decide What to Watch?
            </h2>
            <span className="text-2xl">🎮</span>
          </div>

          <p className="max-w-2xl text-sm leading-7 text-zinc-300 md:text-base">
            Break the deadlock fast. Compare contenders, draw a random pick, or
            let roulette make the call when the queue gets too crowded.
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-3 text-xs text-zinc-300 md:text-sm lg:justify-start">
            <div className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5">
              <span>🆚</span>
              <span className="ml-2">VS Battles</span>
            </div>
            <div className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5">
              <span>🎯</span>
              <span className="ml-2">Random Picks</span>
            </div>
            <div className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5">
              <span>🎪</span>
              <span className="ml-2">Movie Roulette</span>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0">
          <Link
            href="/decisions"
            className="group inline-flex items-center gap-3 rounded-2xl border border-blue-400/20 bg-gradient-to-r from-blue-600 via-blue-500 to-fuchsia-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-950/45 md:text-base"
            aria-label="Start using movie decision games"
          >
            <span className="text-lg">🎲</span>
            <span>Start Deciding</span>
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DecisionsBanner;
