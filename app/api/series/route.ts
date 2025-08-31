import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { TMDBSeries } from "@/types";
import { getSeriesDetails, searchSeries } from "@/api/tmdb";
import { markSeriesAsWatched } from "@/api/db";

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

interface TMDBSeriesDetails extends TMDBSeries {
  genres: Array<{ id: number; name: string }>;
  number_of_episodes: number;
  number_of_seasons: number;
  last_air_date: string | null;
}

export async function PATCH(request: Request) {
  try {
    const { id, now, isSeriesInDb } = (await request.json()) as {
      id: number;
      now: Date;
      isSeriesInDb: boolean;
    };

    if (isSeriesInDb) {
      const result = await markSeriesAsWatched({ id }, new Date(now), true);

      // Revalidate cache for affected pages
      revalidatePath("/series");
      revalidatePath(`/series/${id}`);
      revalidatePath("/profile/recently-added");
      revalidatePath("/profile/latest-watched");

      return NextResponse.json(result);
    }

    const seriesData = (await getSeriesDetails(id)) as TMDBSeriesDetails;

    const result = await markSeriesAsWatched(
      {
        id: seriesData.id,
        name: seriesData.name,
        overview: seriesData.overview,
        first_air_date: seriesData.first_air_date
          ? new Date(seriesData.first_air_date)
          : null,
        last_air_date: seriesData.last_air_date
          ? new Date(seriesData.last_air_date)
          : null,
        number_of_episodes: seriesData.number_of_episodes ?? null,
        number_of_seasons: seriesData.number_of_seasons ?? null,
        genres: seriesData.genres?.map((g) => g.name) ?? [],
        poster_path: seriesData.poster_path,
      },
      new Date(now),
      false
    );

    // Revalidate cache for affected pages
    revalidatePath("/series");
    revalidatePath(`/series/${result.id}`);
    revalidatePath("/profile/recently-added");
    revalidatePath("/profile/latest-watched");

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error marking series as watched:", error);
    return NextResponse.json(
      { error: "Failed to mark series as watched" },
      { status: 500 }
    );
  }
}
