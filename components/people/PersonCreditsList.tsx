"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { TMDBPersonCredit } from "@/types";

interface PersonCreditsListProps {
  allCredits: TMDBPersonCredit[];
  actorCredits: TMDBPersonCredit[];
}

function getCreditTitle(credit: TMDBPersonCredit) {
  return credit.media_type === "movie" ? credit.title : credit.name;
}

function getCreditDate(credit: TMDBPersonCredit) {
  return credit.media_type === "movie"
    ? credit.release_date
    : credit.first_air_date;
}

function getCreditRole(credit: TMDBPersonCredit) {
  return credit.character || credit.job || credit.department || "Credit";
}

function getCreditHref(credit: TMDBPersonCredit) {
  const path = credit.media_type === "movie" ? "movies" : "series";
  return `/${path}/${credit.id}?tmdb=true`;
}

function getCreditYear(credit: TMDBPersonCredit) {
  const date = getCreditDate(credit);
  return date ? new Date(date).getFullYear() : null;
}

export default function PersonCreditsList({
  allCredits,
  actorCredits,
}: PersonCreditsListProps) {
  const [actorOnly, setActorOnly] = useState(false);
  const credits = useMemo(
    () => (actorOnly ? actorCredits : allCredits),
    [actorCredits, actorOnly, allCredits]
  );

  return (
    <section className="mb-8">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Credits</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Movies and series, latest first
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-zinc-500">
            {credits.length} total
          </span>
          <div className="flex rounded-full border border-white/10 bg-black/25 p-1">
            <button
              type="button"
              onClick={() => setActorOnly(false)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                !actorOnly
                  ? "bg-white/12 text-white"
                  : "text-zinc-400 hover:bg-white/6 hover:text-white"
              }`}
            >
              All credits
            </button>
            <button
              type="button"
              onClick={() => setActorOnly(true)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                actorOnly
                  ? "bg-white/12 text-white"
                  : "text-zinc-400 hover:bg-white/6 hover:text-white"
              }`}
            >
              Actor only
            </button>
          </div>
        </div>
      </div>

      {credits.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {credits.map((credit) => {
            const year = getCreditYear(credit);
            return (
              <Link
                key={credit.credit_id}
                href={getCreditHref(credit)}
                className="group rounded-lg border border-zinc-800 bg-zinc-900/70 p-4 transition-colors hover:border-zinc-600 hover:bg-zinc-900"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-zinc-100 group-hover:text-white">
                      {getCreditTitle(credit)}
                    </h3>
                    <p className="mt-1 truncate text-sm text-zinc-400">
                      {getCreditRole(credit)}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm text-zinc-500">{year ?? "TBA"}</p>
                    <p className="mt-1 text-[0.68rem] uppercase tracking-[0.2em] text-zinc-600">
                      {credit.media_type === "movie" ? "Movie" : "Series"}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 text-zinc-400">
          {actorOnly
            ? "No actor credits available."
            : "No movie or series credits available."}
        </div>
      )}
    </section>
  );
}
