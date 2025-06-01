"use server";

import { revalidatePath } from "next/cache";
import {
  addMovieToList,
  removeMovieFromList,
  markMovieAsWatched as dbMarkMovieAsWatched,
  updateMovieScore as dbUpdateMovieScore,
  getMovieByTmdbId,
} from "@/api/db";
import { getMovieDetails } from "@/api/tmdb";
import { Movie, TMDBMovie } from "@/types";

interface TMDBMovieDetails extends TMDBMovie {
  imdb_id: string;
  runtime: number;
  genres: Array<{
    id: number;
    name: string;
  }>;
}

export async function addMovie(movie: TMDBMovie): Promise<Movie> {
  try {
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

    // Revalidate the movies page
    revalidatePath("/movies");

    return result;
  } catch (error) {
    console.error("Failed to add movie:", error);
    throw new Error("Failed to add movie");
  }
}

export async function removeMovie(id: number): Promise<Movie> {
  try {
    const result = await removeMovieFromList(id);

    // Revalidate the movies page
    revalidatePath("/movies");

    return result;
  } catch (error) {
    console.error("Failed to remove movie:", error);
    throw new Error("Failed to remove movie");
  }
}

export async function markMovieAsWatched(
  movieId: number,
  watchedAt: Date,
  isMovieInDb: boolean
): Promise<{ movie: Movie; shouldShowRating: boolean }> {
  try {
    let result: Movie;

    if (isMovieInDb) {
      // Movie is already in database, just mark as watched
      result = await dbMarkMovieAsWatched({ id: movieId }, watchedAt, true);
    } else {
      // Movie is from TMDB, need to add to database and mark as watched
      const movieData = (await getMovieDetails(movieId)) as TMDBMovieDetails;

      result = await dbMarkMovieAsWatched(
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
        watchedAt,
        false
      );
    }

    // Revalidate paths to update latest watched movies
    revalidatePath("/movies");
    revalidatePath(`/movies/${movieId}`);

    return {
      movie: result,
      shouldShowRating: true,
    };
  } catch (error) {
    console.error("Failed to mark movie as watched:", error);
    throw new Error("Failed to mark movie as watched");
  }
}

export async function getMovieWatchedStatus(
  tmdbId: number
): Promise<Movie | null> {
  try {
    return await getMovieByTmdbId(tmdbId);
  } catch (error) {
    console.error("Failed to get movie watched status:", error);
    return null;
  }
}

export async function updateMovieScore(
  movieId: number,
  score: number
): Promise<Movie> {
  try {
    const result = await dbUpdateMovieScore(movieId, score);

    // Revalidate paths to update movie data
    revalidatePath("/movies");
    revalidatePath(`/movies/${movieId}`);

    return result;
  } catch (error) {
    console.error("Failed to update movie score:", error);
    throw new Error("Failed to update movie score");
  }
}
