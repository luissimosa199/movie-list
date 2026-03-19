"use client";

import { Series, TMDBSeries } from "@/types";
import { useState } from "react";
import MarkSeriesAsWatchedButton from "@/components/MarkSeriesAsWatchedButton";
import SeriesCardButton from "@/components/SeriesCardButton";

export default function SeriesCardButtonsSection({
  series,
  initialSeriesDbId,
  watchedSeries,
  className = "",
}: {
  series: TMDBSeries | Series;
  initialSeriesDbId: number | false;
  watchedSeries?: Series | null;
  className?: string;
}) {
  const [seriesDbId, setSeriesDbId] = useState<number | false>(
    initialSeriesDbId
  );

  return (
    <div className={`grid gap-2 ${className}`.trim()}>
      <MarkSeriesAsWatchedButton
        series={series as TMDBSeries}
        isSeriesInDb={!!seriesDbId}
        watchedSeries={watchedSeries}
        onAddedToDb={(id: number) => setSeriesDbId(id)}
      />
      <SeriesCardButton
        series={series as TMDBSeries}
        seriesDbId={seriesDbId}
        setSeriesDbId={setSeriesDbId}
      />
    </div>
  );
}
