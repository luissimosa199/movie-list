import { NextResponse } from "next/server";
import { markMovieAsWatched } from "@/api/db";
import { getMovieDetails } from "@/api/tmdb";
import type { TMDBMovie } from "@/types";

interface TMDBMovieDetails extends TMDBMovie {
  imdb_id: string;
  runtime: number;
  genres: Array<{
    id: number;
    name: string;
  }>;
}

export async function PATCH(request: Request) {
  try {
    const { id, now, isMovieInDb } = (await request.json()) as {
      id: number;
      now: Date;
      isMovieInDb: boolean;
    };

    if (isMovieInDb) {
      const result = await markMovieAsWatched({ id }, new Date(now), true);
      return NextResponse.json(result);
    }

    const movieData = (await getMovieDetails(id)) as TMDBMovieDetails;

    const result = await markMovieAsWatched(
      {
        id: movieData.id,
        imdb_id: movieData.imdb_id,
        title: movieData.title,
        overview: movieData.overview,
        release_date: movieData.release_date
          ? new Date(movieData.release_date)
          : null,
        runtime: movieData.runtime,
        genres: movieData.genres?.map((g: { name: string }) => g.name),
        poster_path: movieData.poster_path,
      },
      new Date(now),
      false
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error marking movie as watched:", error);
    return NextResponse.json(
      { error: "Failed to mark movie as watched" },
      { status: 500 }
    );
  }
}
