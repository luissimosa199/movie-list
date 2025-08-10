"use client";

import { TMDBSeries } from "@/types";
import { useTransition, useState } from "react";
import { addSeries, removeSeries } from "@/lib/actions";

export default function SeriesCardButton({
  series,
  seriesDbId: initialSeriesDbId,
  setSeriesDbId,
}: {
  series: TMDBSeries;
  seriesDbId?: number | false;
  setSeriesDbId?: (seriesDbId: number | false) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [localSeriesDbId, setLocalSeriesDbId] = useState<number | false>(
    initialSeriesDbId ?? false
  );

  const effectiveSeriesDbId = setSeriesDbId
    ? initialSeriesDbId ?? false
    : localSeriesDbId;
  const setId = setSeriesDbId ?? setLocalSeriesDbId;

  const handleClick = () => {
    if (effectiveSeriesDbId) {
      const dbId =
        typeof effectiveSeriesDbId === "number" ? effectiveSeriesDbId : null;
      if (!dbId) return;

      // Optimistic update
      setId(false);

      startTransition(async () => {
        try {
          await removeSeries(dbId);
        } catch (error) {
          setId(dbId);
          console.error("Error removing series:", error);
        }
      });
    } else {
      startTransition(async () => {
        try {
          const added = await addSeries(series);
          setId(added.id);
        } catch (error) {
          console.error("Error adding series:", error);
        }
      });
    }
  };

  const isInList = !!effectiveSeriesDbId;
  const buttonText = isInList ? "Remove from Watchlist" : "Add to Watchlist";

  return (
    <button
      disabled={isPending}
      className="bg-transparent border border-zinc-700 hover:border-zinc-600 disabled:border-zinc-800 text-white disabled:text-zinc-500 text-sm py-2 px-4 rounded-md transition-colors flex-1 cursor-pointer disabled:cursor-not-allowed"
      onClick={handleClick}
    >
      {isPending ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-3 h-3 border-2 border-zinc-600 border-t-white rounded-full animate-spin"></div>
          {isInList ? "Removing..." : "Adding..."}
        </div>
      ) : (
        buttonText
      )}
    </button>
  );
}
