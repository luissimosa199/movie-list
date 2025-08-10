import { NextResponse } from "next/server";
import { addMovieToList, removeMovieFromList } from "@/api/db";
import type { TMDBMovie } from "@/types";
import { getMovieDetails, searchMovies, discoverMovies } from "@/api/tmdb";

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Optional filters (TMDB Discover)
    const with_genres = searchParams.get("with_genres") || undefined;
    const year = searchParams.get("year") || undefined;
    const min_rating = searchParams.get("min_rating") || undefined;

    if (with_genres || year || min_rating) {
      const movies = await discoverMovies({
        page,
        limit,
        with_genres,
        primary_release_year: year,
        "vote_average.gte": min_rating,
      });
      return NextResponse.json(movies);
    }

    const movies = await searchMovies(query, page, limit);
    return NextResponse.json(movies);
  } catch (error) {
    console.error("Error searching movies:", error);
    return NextResponse.json(
      { error: "Failed to search movies" },
      { status: 500 }
    );
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
