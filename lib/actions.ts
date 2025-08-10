"use server";

import { revalidatePath } from "next/cache";
import {
  addMovieToList,
  removeMovieFromList,
  markMovieAsWatched as dbMarkMovieAsWatched,
  updateMovieScore as dbUpdateMovieScore,
  getMovieByTmdbId,
  addSeriesToList,
  getSeriesByTmdbId,
} from "@/api/db";
import { getMovieDetails, getSeriesDetails } from "@/api/tmdb";
import { Movie, TMDBMovie, Series as SeriesType, TMDBSeries } from "@/types";

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
      // Movie is already in database, but movieId may be a TMDB id when coming from a TMDB page.
      // Resolve the actual database id if possible.
      let idToUse = movieId;
      const dbMovie = await getMovieByTmdbId(movieId);
      if (dbMovie?.id) {
        idToUse = dbMovie.id;
      }

      result = await dbMarkMovieAsWatched({ id: idToUse }, watchedAt, true);
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

// === Series actions ===
export async function addSeries(series: TMDBSeries): Promise<SeriesType> {
  try {
    const details = await getSeriesDetails(series.id);
    const now = new Date();

    const result = await addSeriesToList({
      tmdb_id: details.id,
      name: details.name,
      overview: details.overview,
      first_air_date: details.first_air_date
        ? new Date(details.first_air_date)
        : (null as unknown as Date),
      last_air_date: (details as any).last_air_date
        ? new Date((details as any).last_air_date)
        : null,
      number_of_episodes: (details as any).number_of_episodes ?? null,
      number_of_seasons: (details as any).number_of_seasons ?? null,
      genres: (details as any).genres?.map((g: { name: string }) => g.name) ?? [],
      poster_url: details.poster_path
        ? `https://image.tmdb.org/t/p/original${details.poster_path}`
        : null,
      created_at: now,
      updated_at: now,
      watched_at: null,
      // Extra fields present in schema but not in CreateSeriesData type are omitted
      // origin_country is required at DB level; include from TMDB minimal object
      // We will rely on Prisma to accept additional fields only through direct create
      // For type safety, we only pass fields declared in CreateSeriesData here
    } as any);

    revalidatePath("/series");

    return result;
  } catch (error) {
    console.error("Failed to add series:", error);
    throw new Error("Failed to add series");
  }
}

export async function getSeriesInDbStatus(
  tmdbId: number
): Promise<SeriesType | null> {
  try {
    return await getSeriesByTmdbId(tmdbId);
  } catch (error) {
    console.error("Failed to get series status:", error);
    return null;
  }
}
