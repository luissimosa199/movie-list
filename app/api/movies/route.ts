import { NextResponse } from "next/server";
import {
  addMovieToList,
  removeMovieFromList,
  markMovieAsWatched,
} from "@/api/db";
import type { TMDBMovie } from "@/types";
import { getMovieDetails } from "@/api/tmdb";

interface TMDBMovieDetails extends TMDBMovie {
  imdb_id: string;
  runtime: number;
  genres: Array<{
    id: number;
    name: string;
  }>;
}

export async function POST(request: Request) {
  try {
    const movie = (await request.json()) as TMDBMovie;
    const movieData = (await getMovieDetails(movie.id)) as TMDBMovieDetails;

    const now = new Date();
    const result = await addMovieToList({
      tmdb_id: movieData.id,
      imdb_id: movieData.imdb_id,
      title: movieData.title,
      overview: movieData.overview,
      release_date: new Date(movieData.release_date),
      runtime: movieData.runtime,
      genres: movieData.genres.map((g) => g.name),
      poster_url: movieData.poster_path
        ? `https://image.tmdb.org/t/p/original${movieData.poster_path}`
        : null,
      created_at: now,
      updated_at: now,
      watched_at: null,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error adding movie:", error);
    return NextResponse.json({ error: "Failed to add movie" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const result = await removeMovieFromList(id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error removing movie:", error);
    return NextResponse.json(
      { error: "Failed to remove movie" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, now } = (await request.json()) as {
      id: number;
      now: Date;
    };
    const movieData = (await getMovieDetails(id)) as TMDBMovieDetails;
    const result = await markMovieAsWatched(
      {
        tmdb_id: movieData.id,
        imdb_id: movieData.imdb_id,
        title: movieData.title,
        overview: movieData.overview || null,
        release_date: movieData.release_date
          ? new Date(movieData.release_date)
          : null,
        runtime: movieData.runtime || null,
        genres: movieData.genres?.map((g) => g.name) || null,
        poster_url: movieData.poster_path
          ? `https://image.tmdb.org/t/p/original${movieData.poster_path}`
          : null,
      },
      now
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
