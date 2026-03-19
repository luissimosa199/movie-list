import React from "react";
import Link from "next/link";
import DecisionBreadcrumbs from "@/components/decisions/DecisionBreadcrumbs";
import DecisionHero from "@/components/decisions/DecisionHero";

const gameCards = [
  {
    href: "/decisions/vs",
    icon: "⚔️",
    title: "Movie Battles",
    description:
      "Build a bracket, run head-to-head matchups, and let one favorite survive the tournament.",
    bullets: ["Tournament brackets", "1v1 battles", "Champion reveal"],
    accent:
      "from-red-950/60 via-red-900/30 to-orange-900/30 border-red-700/40 text-red-200",
    button:
      "from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500",
    eyebrow: "Competitive",
    cta: "Start Battle",
  },
  {
    href: "/decisions/random",
    icon: "🎲",
    title: "Random Discovery",
    description:
      "Use filters when you want more control, or hit surprise mode when you want a clean wildcard.",
    bullets: ["Genre filters", "Year range", "Rating minimum"],
    accent:
      "from-blue-950/60 via-blue-900/30 to-cyan-900/30 border-blue-700/40 text-blue-200",
    button:
      "from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500",
    eyebrow: "Curated Chaos",
    cta: "Surprise Me",
  },
  {
    href: "/decisions/roulette",
    icon: "🎪",
    title: "Movie Roulette",
    description:
      "Load a wheel with contenders, charge the spin, and let the room settle the choice in one move.",
    bullets: ["Interactive wheel", "Spin mechanics", "Recent winners"],
    accent:
      "from-purple-950/60 via-purple-900/30 to-pink-900/30 border-purple-700/40 text-purple-200",
    button:
      "from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500",
    eyebrow: "Group Pick",
    cta: "Spin the Wheel",
  },
];

export default function DecisionsPage() {
  return (
    <main className="min-h-screen py-8 text-white md:py-12">
      <div className="page-frame space-y-8 md:space-y-12">
        <DecisionBreadcrumbs
          items={[
            { href: "/movies", label: "Movies" },
            { label: "Decisions", active: true },
          ]}
          accentClassName="text-blue-300"
        />

        <DecisionHero
          icon="🎮"
          eyebrow="Decision Hub"
          title="Movie Decision Games"
          description="Stop drifting between tabs. Pick a mode, narrow the field, and let the app handle the final decision with more style than a generic randomizer."
          accent="purple"
        >
          <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4 md:p-5">
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.3em] text-zinc-500">
              Quick Modes
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-zinc-200">
                <div className="font-semibold text-white">Battle</div>
                <div className="mt-1 text-zinc-400">Bracket-style elimination</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-zinc-200">
                <div className="font-semibold text-white">Discover</div>
                <div className="mt-1 text-zinc-400">Filter and randomize fast</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-zinc-200">
                <div className="font-semibold text-white">Roulette</div>
                <div className="mt-1 text-zinc-400">Wheel-based group choice</div>
              </div>
            </div>
          </div>
        </DecisionHero>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {gameCards.map((card) => (
            <div
              key={card.href}
              className={`relative overflow-hidden rounded-[1.75rem] border bg-gradient-to-br p-6 shadow-2xl shadow-black/20 ${card.accent}`}
            >
              <div className="absolute inset-0 opacity-[0.07]">
                <div className="flex rotate-12 scale-150 flex-wrap gap-5 text-3xl">
                  <div>{card.icon}</div>
                  <div>🎬</div>
                  <div>✨</div>
                </div>
              </div>

              <div className="relative z-10 flex h-full flex-col">
                <p className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-zinc-400">
                  {card.eyebrow}
                </p>
                <div className="mt-4 text-5xl">{card.icon}</div>
                <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white">
                  {card.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-zinc-300">
                  {card.description}
                </p>

                <div className="mt-6 space-y-2 text-sm text-zinc-300">
                  {card.bullets.map((bullet) => (
                    <div key={bullet} className="flex items-center gap-2">
                      <span className="text-white/80">•</span>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href={card.href}
                  className={`group mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/20 ${card.button}`}
                >
                  <span>{card.cta}</span>
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
          ))}
        </section>

        <div className="text-center text-sm text-zinc-500">
          More decision tools can plug into this hub later without changing the shell.
        </div>
      </div>
    </main>
  );
}

export const metadata = {
  title: "Movie Decision Games - Battle, Discover, Spin",
  description:
    "Interactive movie decision games: battle movies in tournaments, get random recommendations, or spin the roulette wheel to discover your next favorite film.",
};
