import React from "react";
import { Series, TMDBSeries } from "@/types";
import { getSeriesInDbStatus } from "@/lib/actions";
import SeriesCard from "./SeriesCard";

type SeriesCardWrapperProps = {
  series: Series | TMDBSeries;
  source: "db" | "tmdb";
};

const SeriesCardWrapper = async ({
  series,
  source,
}: SeriesCardWrapperProps) => {
  const seriesInDb =
    source === "tmdb"
      ? await getSeriesInDbStatus((series as TMDBSeries).id)
      : null;

  return (
    <SeriesCard
      series={series}
      source={source}
      seriesInDb={seriesInDb}
    />
  );
};

export default SeriesCardWrapper;
