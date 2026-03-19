"use client";

import React from "react";
import { Series, TMDBSeries } from "@/types";
import Image from "next/image";
import Link from "next/link";
import {
  getFormattedAirDate,
  getSeriesGenres,
  getSeriesPosterUrl,
} from "@/utils";
import SeriesCardButtonsSection from "@/components/SeriesCardButtonsSection";
import StarRating from "./StarRating";
import { useViewMode } from "@/stores/viewStore";

type SeriesCardProps = {
  series: Series | TMDBSeries;
  source: "db" | "tmdb";
  seriesInDb: Series | null;
};

const SeriesCard: React.FC<SeriesCardProps> = ({
  series,
  source,
  seriesInDb,
}) => {
  const viewMode = useViewMode();
  const isCompact = viewMode === "compact";

  const posterUrl = getSeriesPosterUrl(series, source);
  const genres = getSeriesGenres(series, source);
  const firstAirDate =
    source === "db"
      ? (series as Series).first_air_date
      : (series as TMDBSeries).first_air_date;

  const cardClasses = isCompact
    ? "relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(9,12,18,0.98))] shadow-[0_20px_60px_rgba(0,0,0,0.22)] transition-transform duration-200 hover:-translate-y-0.5 hover:border-white/15 hover:shadow-[0_26px_70px_rgba(0,0,0,0.3)]"
    : "relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(9,12,18,0.98))] shadow-[0_24px_70px_rgba(0,0,0,0.24)] transition-transform duration-200 hover:-translate-y-1 hover:border-white/15 hover:shadow-[0_30px_80px_rgba(0,0,0,0.34)]";

  return (
    <article className={cardClasses}>
      <div
        className={
          isCompact
            ? "flex items-start gap-4 p-4"
            : "flex h-full flex-col"
        }
      >
        <div
          className={
            isCompact
              ? "relative aspect-[2/3] w-20 flex-shrink-0 overflow-hidden rounded-[1rem] border border-white/10 bg-zinc-800 min-[420px]:w-24"
              : "relative aspect-[2/3] overflow-hidden border-b border-white/10 bg-zinc-800"
          }
        >
          <Link
            href={`/series/${series.id}${source === "tmdb" ? "?tmdb=true" : ""}`}
            className="block h-full w-full"
          >
            {posterUrl ? (
              <Image
                src={posterUrl}
                alt={`${
                  source === "db"
                    ? (series as Series).name
                    : (series as TMDBSeries).name
                } poster`}
                fill
                sizes={
                  isCompact
                    ? "(max-width: 640px) 96px"
                    : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                }
                className="object-cover"
                priority={false}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-center text-zinc-500">
                <span className={isCompact ? "text-xs" : "text-sm"}>
                  {isCompact ? "No Poster" : "No Poster Available"}
                </span>
              </div>
            )}
          </Link>
        </div>

        <div
          className={
            isCompact
              ? "flex min-w-0 flex-1 flex-col gap-3 py-1"
              : "flex min-h-0 flex-1 flex-col p-5"
          }
        >
          <div className="space-y-3">
            <h2
              className={
                isCompact
                  ? "min-w-0 text-base font-semibold tracking-tight text-white line-clamp-2"
                  : "min-w-0 text-xl font-semibold tracking-tight text-white line-clamp-2"
              }
            >
              <Link
                href={`/series/${series.id}${source === "tmdb" ? "?tmdb=true" : ""}`}
                className="transition-colors hover:text-primary"
              >
                {source === "db"
                  ? (series as Series).name
                  : (series as TMDBSeries).name}
              </Link>
            </h2>

            <p
              className={
                isCompact
                  ? "text-xs leading-5 text-zinc-400"
                  : "text-sm leading-6 text-zinc-400"
              }
            >
              First aired: {getFormattedAirDate(firstAirDate, source)}
            </p>

            {!isCompact && (
              <>
                {source === "tmdb" ? (
                  <p className="line-clamp-2 text-sm leading-6 text-zinc-300">
                    {(series as TMDBSeries).overview}
                  </p>
                ) : (
                  (series as Series).overview && (
                    <p className="line-clamp-2 text-sm leading-6 text-zinc-300">
                      {(series as Series).overview}
                    </p>
                  )
                )}
              </>
            )}

            {!isCompact && genres && (
              <p
                className={
                  isCompact
                    ? "text-xs leading-5 text-zinc-400"
                    : "text-sm leading-6 text-zinc-400"
                }
              >
                <span className="text-zinc-500">Genres:</span> {genres.join(", ")}
              </p>
            )}

            {!isCompact && source === "db" && (series as Series).number_of_seasons && (
              <p
                className={
                  isCompact
                    ? "text-xs text-zinc-400"
                    : "text-sm text-zinc-400"
                }
              >
                <span className="text-zinc-500">Seasons:</span>{" "}
                {(series as Series).number_of_seasons}
              </p>
            )}

            {!isCompact && source === "db" && (series as Series).number_of_episodes && (
              <p
                className={
                  isCompact
                    ? "text-xs text-zinc-400"
                    : "text-sm text-zinc-400"
                }
              >
                <span className="text-zinc-500">Episodes:</span>{" "}
                {(series as Series).number_of_episodes}
              </p>
            )}

            <div className="flex flex-wrap gap-2 text-xs text-zinc-300">
              {source === "db" && (series as Series).score && (
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  <span className="text-zinc-500">Your Score:</span>{" "}
                  {(series as Series).score}
                </span>
              )}

              {source === "tmdb" && (
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  <span className="text-zinc-500">TMDB Rating:</span>{" "}
                  {(series as TMDBSeries).vote_average.toFixed(1)} / 10
                </span>
              )}
            </div>
          </div>

          <div className="mt-auto space-y-3 pt-4">
            {source === "tmdb" && (
              <SeriesCardButtonsSection
                series={series as TMDBSeries}
                initialSeriesDbId={seriesInDb?.id || false}
                watchedSeries={seriesInDb as Series | null}
              />
            )}

            {source === "db" && (series as Series).watched_at && (
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <StarRating
                  seriesId={(series as Series).id}
                  initialScore={(series as Series).score || 0}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default React.memo(SeriesCard);
