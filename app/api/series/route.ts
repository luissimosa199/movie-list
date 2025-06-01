import { NextResponse } from "next/server";
// import type { TMDBSeries } from "@/types";
import {
  // getSeriesDetails,
  searchSeries,
} from "@/api/tmdb";

// interface TMDBSeriesDetails extends TMDBSeries {
//   episode_run_time: number[];
//   genres: Array<{
//     id: number;
//     name: string;
//   }>;
//   number_of_episodes: number;
//   number_of_seasons: number;
//   last_air_date: string;
// }

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const series = await searchSeries(query, page, limit);
    return NextResponse.json(series);
  } catch (error) {
    console.error("Error searching series:", error);
    return NextResponse.json(
      { error: "Failed to search series" },
      { status: 500 }
    );
  }
}

// Future endpoints for series management would go here
// POST - Add series to watchlist
// DELETE - Remove series from watchlist
// PUT - Update series status/score
