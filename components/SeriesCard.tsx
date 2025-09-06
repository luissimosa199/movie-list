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
    ? "bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 transition-transform hover:scale-[1.02] hover:shadow-lg relative flex flex-row gap-4 p-4 h-32"
    : "bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 transition-transform hover:scale-[1.02] hover:shadow-lg relative";

  return (
    <div
      key={series.id}
      className={cardClasses}
    >
      <div
        className={
          isCompact
            ? "w-20 h-24 bg-zinc-800 relative rounded flex-shrink-0"
            : "aspect-[2/3] bg-zinc-800 relative"
        }
      >
        <Link
          href={`/series/${series.id}${source === "tmdb" ? "?tmdb=true" : ""}`}
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
                  ? "80px"
                  : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              }
              className={isCompact ? "object-cover rounded" : "object-cover"}
              priority={false}
            />
          ) : (
            <div
              className={`w-full h-full bg-zinc-800 text-center flex items-center justify-center text-zinc-500 ${
                isCompact ? "rounded text-xs" : ""
              }`}
            >
              {isCompact ? "No Poster" : "No Poster Available"}
            </div>
          )}
        </Link>
      </div>

      <div
        className={
          isCompact
            ? "flex-1 flex flex-col justify-between py-0"
            : "p-4 flex flex-col justify-between"
        }
      >
        <div>
          <h2
            className={
              isCompact
                ? "text-sm font-semibold mb-1 line-clamp-1"
                : "text-lg font-semibold mb-2 line-clamp-1"
            }
          >
            {source === "db"
              ? (series as Series).name
              : (series as TMDBSeries).name}
          </h2>
          <p className="text-xs text-zinc-400 mb-2">
            First Aired: {getFormattedAirDate(firstAirDate, source)}
          </p>

          {!isCompact && (
            <>
              {source === "tmdb" ? (
                <p className="text-sm text-zinc-300 mb-3 line-clamp-2">
                  {(series as TMDBSeries).overview}
                </p>
              ) : (
                (series as Series).overview && (
                  <p className="text-sm text-zinc-300 mb-3 line-clamp-2">
                    {(series as Series).overview}
                  </p>
                )
              )}

              {genres && (
                <p className="text-xs text-zinc-400 mb-1 h-7">
                  <span className="text-zinc-500">Genres:</span>{" "}
                  {genres.join(", ")}
                </p>
              )}

              {source === "db" && (series as Series).number_of_seasons && (
                <p className="text-xs text-zinc-400 mb-1">
                  <span className="text-zinc-500">Seasons:</span>{" "}
                  {(series as Series).number_of_seasons}
                </p>
              )}

              {source === "db" && (series as Series).number_of_episodes && (
                <p className="text-xs text-zinc-400 mb-1">
                  <span className="text-zinc-500">Episodes:</span>{" "}
                  {(series as Series).number_of_episodes}
                </p>
              )}
            </>
          )}

          {source === "db" && (series as Series).score && (
            <p className="text-xs text-zinc-400 mb-2">
              <span className="text-zinc-500">Your Score:</span>{" "}
              {(series as Series).score}
            </p>
          )}

          {source === "tmdb" && (
            <p className="text-xs text-zinc-400 mb-2">
              <span className="text-zinc-500">Rating:</span>{" "}
              {(series as TMDBSeries).vote_average.toFixed(1)} (
              {(series as TMDBSeries).vote_count} votes)
            </p>
          )}
        </div>

        <div className="mt-auto">
          {source === "tmdb" && (
            <SeriesCardButtonsSection
              series={series as TMDBSeries}
              initialSeriesDbId={seriesInDb?.id || false}
              watchedSeries={seriesInDb as Series | null}
            />
          )}

          {/* Show star rating for watched series from DB only, per memory guidance */}
          {source === "db" && (series as Series).watched_at && (
            <StarRating
              seriesId={(series as Series).id}
              initialScore={(series as Series).score || 0}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(SeriesCard);
