import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { markMovieAsWatched } from "@/api/db";
import { getMovieDetails } from "@/api/tmdb";
import type { TMDBMovie } from "@/types";
import { getRequestUser } from "@/lib/auth-session";

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
    const user = await getRequestUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { dbMovieId, tmdbMovieId, now, isMovieInDb } = (await request.json()) as {
      dbMovieId?: number | null;
      tmdbMovieId: number;
      now: Date;
      isMovieInDb: boolean;
    };

    if (isMovieInDb && dbMovieId) {
      const result = await markMovieAsWatched(
        user.id,
        { id: dbMovieId },
        new Date(now),
        true
      );

      // Revalidate cache for affected pages
      revalidatePath("/movies");
      revalidatePath(`/movies/${dbMovieId}`);
      revalidatePath("/profile/recently-added");
      revalidatePath("/profile/latest-watched");

      return NextResponse.json(result);
    }

    const movieData = (await getMovieDetails(tmdbMovieId)) as TMDBMovieDetails;

    const result = await markMovieAsWatched(
      user.id,
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

    // Revalidate cache for affected pages
    revalidatePath("/movies");
    revalidatePath(`/movies/${result.id}`);
    revalidatePath("/profile/recently-added");
    revalidatePath("/profile/latest-watched");

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error marking movie as watched:", error);
    return NextResponse.json(
      { error: "Failed to mark movie as watched" },
      { status: 500 }
    );
  }
}
