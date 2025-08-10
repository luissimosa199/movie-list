"use client";

import { TMDBSeries } from "@/types";
import { useTransition, useState } from "react";
import { addSeries } from "@/lib/actions";

export default function SeriesCardButton({ series }: { series: TMDBSeries }) {
  const [isPending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    startTransition(async () => {
      try {
        await addSeries(series);
        setAdded(true);
      } catch (error) {
        console.error("Error adding series:", error);
      }
    });
  };

  return (
    <button
      disabled={isPending || added}
      className="bg-transparent border border-zinc-700 hover:border-zinc-600 disabled:border-zinc-800 text-white disabled:text-zinc-500 text-sm py-2 px-4 rounded-md transition-colors flex-1 cursor-pointer disabled:cursor-not-allowed"
      onClick={handleClick}
    >
      {isPending ? "Adding..." : added ? "Added" : "Add to Watchlist"}
    </button>
  );
}
