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
      className="inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium leading-tight text-white transition-colors hover:border-white/20 hover:bg-white/8 disabled:cursor-not-allowed disabled:border-white/6 disabled:text-zinc-500"
      onClick={handleClick}
    >
      {isPending ? (
        <div className="flex items-center justify-center gap-2">
          <div className="h-3 w-3 rounded-full border-2 border-zinc-600 border-t-white animate-spin" />
          {isInList ? "Removing..." : "Adding..."}
        </div>
      ) : (
        buttonText
      )}
    </button>
  );
}
