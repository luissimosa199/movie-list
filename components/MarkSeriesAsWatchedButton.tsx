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
}: {
  series: TMDBSeries;
  isSeriesInDb: boolean;
  watchedSeries?: Series | null;
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
    } catch (error) {
      setIsWatched(null);
      console.error("Error marking series as watched:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (showRating && isWatched && dbSeriesId)
    return (
      <div className="flex flex-col gap-2 flex-1">
        <div className="bg-primary/20 text-white text-sm py-2 px-4 rounded-md text-center">
          Watched on {formatCardDate(isWatched)}
        </div>
        <StarRating
          seriesId={dbSeriesId}
          initialScore={watchedSeries?.score || 0}
        />
      </div>
    );

  return (
    <button
      disabled={!!isWatched || isLoading}
      onClick={handleClick}
      className="bg-primary hover:bg-primary/90 disabled:bg-primary/60 text-white text-sm py-2 px-4 rounded-md transition-all flex-1 cursor-pointer hover:scale-105 hover:shadow-sm hover:shadow-zinc-800 disabled:cursor-not-allowed disabled:scale-100"
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          Marking as watched...
        </div>
      ) : isWatched ? (
        `Watched on ${formatCardDate(isWatched)}`
      ) : (
        "Mark as Watched"
      )}
    </button>
  );
}
