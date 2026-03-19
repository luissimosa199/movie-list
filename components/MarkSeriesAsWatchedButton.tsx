"use client";

import { Series, TMDBSeries } from "@/types";
import { useState } from "react";
import { markSeriesAsWatched } from "@/lib/actions";
import { formatCardDate } from "@/utils";
import StarRating from "./StarRating";

export default function MarkSeriesAsWatchedButton({
  series,
  isSeriesInDb,
  watchedSeries,
  onAddedToDb,
}: {
  series: TMDBSeries;
  isSeriesInDb: boolean;
  watchedSeries?: Series | null;
  onAddedToDb?: (id: number) => void;
}) {
  const initialWatchedAt = watchedSeries?.watched_at ?? null;

  const [isWatched, setIsWatched] = useState<string | null>(() => {
    if (!initialWatchedAt) return null;
    return initialWatchedAt instanceof Date
      ? initialWatchedAt.toISOString()
      : (initialWatchedAt as unknown as string);
  });
  const [showRating, setShowRating] = useState(
    !!initialWatchedAt && !!watchedSeries?.id
  );
  const [isLoading, setIsLoading] = useState(false);
  const [dbSeriesId, setDbSeriesId] = useState<number | null>(
    watchedSeries?.id || null
  );

  const handleClick = async () => {
    const now = new Date();
    setIsLoading(true);

    try {
      setIsWatched(now.toISOString());
      const result = await markSeriesAsWatched(series.id, now, isSeriesInDb);
      if (result.shouldShowRating) {
        setDbSeriesId(result.series.id);
        setShowRating(true);
      }

      if (typeof onAddedToDb === "function") {
        onAddedToDb(result.series.id);
      }
    } catch (error) {
      setIsWatched(null);
      console.error("Error marking series as watched:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (showRating && isWatched && dbSeriesId)
    return (
      <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-3">
        <div className="rounded-lg bg-primary/20 px-4 py-2 text-center text-sm text-white">
          Watched on {formatCardDate(isWatched)}
        </div>
        <StarRating seriesId={dbSeriesId} initialScore={watchedSeries?.score || 0} />
      </div>
    );

  return (
    <button
      disabled={!!isWatched || isLoading}
      onClick={handleClick}
      className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-medium leading-tight text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/60"
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="inline-block h-4 w-4 shrink-0 rounded-full border-[3px] border-white/30 border-t-white animate-spin" />
          Marking as watched...
        </div>
      ) : isWatched ? (
        <span className="flex flex-col items-center gap-0.5 text-center">
          <span>Watched</span>
          <span className="text-[0.72rem] font-normal text-white/75">
            {formatCardDate(isWatched)}
          </span>
        </span>
      ) : (
        "Mark as Watched"
      )}
    </button>
  );
}
