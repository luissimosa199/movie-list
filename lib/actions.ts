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
  markSeriesAsWatched as dbMarkSeriesAsWatched,
  updateSeriesScore as dbUpdateSeriesScore,
  removeSeriesFromList,
} from "@/api/db";
import { getMovieDetails, getSeriesDetails } from "@/api/tmdb";
import { Movie, TMDBMovie, Series as SeriesType, TMDBSeries } from "@/types";
import { getCurrentUser, requireUser } from "@/lib/auth-session";

function isDynamicServerUsageError(error: unknown) {
  return (
    error instanceof Error &&
    ("digest" in error || "description" in error) &&
    (
      String((error as { digest?: string }).digest) === "DYNAMIC_SERVER_USAGE" ||
      String((error as { description?: string }).description).includes(
        "Dynamic server usage"
      )
    )
  );
}

export async function addMovie(movie: TMDBMovie): Promise<Movie> {
  try {
    const user = await requireUser(`/movies/${movie.id}?tmdb=true`);
    const movieData = await getMovieDetails(movie.id);

    const now = new Date();
    const result = await addMovieToList(user.id, {
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

    // Revalidate the movies page and profile pages
    revalidatePath("/movies");
    revalidatePath(`/movies/${result.id}`);
    revalidatePath("/");
    revalidatePath("/profile");
    revalidatePath("/profile/recently-added");
    revalidatePath("/profile/latest-watched");

    return result;
  } catch (error) {
    console.error("Failed to add movie:", error);
    throw new Error("Failed to add movie");
  }
}

export async function removeMovie(id: number): Promise<Movie> {
  try {
    const user = await requireUser("/movies");
    const result = await removeMovieFromList(user.id, id);

    // Revalidate the movies page and profile pages
    revalidatePath("/movies");
    revalidatePath(`/movies/${id}`);
    revalidatePath("/");
    revalidatePath("/profile");
    revalidatePath("/profile/recently-added");
    revalidatePath("/profile/latest-watched");

    return result;
  } catch (error) {
    console.error("Failed to remove movie:", error);
    throw new Error("Failed to remove movie");
  }
}

export async function markMovieAsWatched(
  params: {
    dbMovieId?: number | null;
    tmdbMovieId: number;
  },
  watchedAt: Date,
  isMovieInDb: boolean
): Promise<{ movie: Movie; shouldShowRating: boolean }> {
  try {
    const user = await requireUser(`/movies/${params.tmdbMovieId}?tmdb=true`);
    let result: Movie;

    if (isMovieInDb && params.dbMovieId) {
      result = await dbMarkMovieAsWatched(
        user.id,
        { id: params.dbMovieId },
        watchedAt,
        true
      );
    } else {
      const movieData = await getMovieDetails(params.tmdbMovieId);

      result = await dbMarkMovieAsWatched(
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
          genres: movieData.genres?.map((g) => g.name),
          poster_path: movieData.poster_path,
        },
        watchedAt,
        false
      );
    }

    // Revalidate paths to update latest watched movies
    revalidatePath("/movies");
    revalidatePath(`/movies/${result.id}`);
    revalidatePath(`/movies/${params.tmdbMovieId}?tmdb=true`);
    revalidatePath("/");
    revalidatePath("/profile");
    revalidatePath("/profile/recently-added");
    revalidatePath("/profile/latest-watched");

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
    const user = await getCurrentUser();
    if (!user) {
      return null;
    }
    return await getMovieByTmdbId(user.id, tmdbId);
  } catch (error) {
    if (isDynamicServerUsageError(error)) {
      return null;
    }
    console.error("Failed to get movie watched status:", error);
    return null;
  }
}

export async function updateMovieScore(
  movieId: number,
  score: number
): Promise<Movie> {
  try {
    const user = await requireUser(`/movies/${movieId}`);
    const result = await dbUpdateMovieScore(user.id, movieId, score);

    // Revalidate paths to update movie data
    revalidatePath("/movies");
    revalidatePath(`/movies/${movieId}`);
    if (result.tmdb_id) {
      revalidatePath(`/movies/${result.tmdb_id}?tmdb=true`);
    }
    revalidatePath("/");
    revalidatePath("/profile");
    revalidatePath("/profile/recently-added");
    revalidatePath("/profile/latest-watched");

    return result;
  } catch (error) {
    console.error("Failed to update movie score:", error);
    throw new Error("Failed to update movie score");
  }
}

// === Series actions ===
export async function addSeries(series: TMDBSeries): Promise<SeriesType> {
  try {
    const user = await requireUser(`/series/${series.id}?tmdb=true`);
    const details = await getSeriesDetails(series.id);
    const now = new Date();

    const result = await addSeriesToList(user.id, {
      tmdb_id: details.id,
      name: details.name,
      overview: details.overview,
      first_air_date: details.first_air_date
        ? new Date(details.first_air_date)
        : (null as unknown as Date),
      last_air_date: details.last_air_date
        ? new Date(details.last_air_date)
        : null,
      number_of_episodes: details.number_of_episodes ?? null,
      number_of_seasons: details.number_of_seasons ?? null,
      genres: details.genres?.map((g) => g.name) ?? [],
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
    });

    // Revalidate the series page and profile pages
    revalidatePath("/series");
    revalidatePath(`/series/${result.id}`);
    revalidatePath("/");
    revalidatePath("/profile");
    revalidatePath("/profile/recently-added");
    revalidatePath("/profile/latest-watched");

    return result;
  } catch (error) {
    console.error("Failed to add series:", error);
    throw new Error("Failed to add series");
  }
}

export async function removeSeries(id: number): Promise<SeriesType> {
  try {
    const user = await requireUser("/series");
    const result = await removeSeriesFromList(user.id, id);

    // Revalidate the series page and profile pages
    revalidatePath("/series");
    revalidatePath(`/series/${id}`);
    revalidatePath("/");
    revalidatePath("/profile");
    revalidatePath("/profile/recently-added");
    revalidatePath("/profile/latest-watched");

    return result;
  } catch (error) {
    console.error("Failed to remove series:", error);
    throw new Error("Failed to remove series");
  }
}

export async function getSeriesInDbStatus(
  tmdbId: number
): Promise<SeriesType | null> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return null;
    }
    return await getSeriesByTmdbId(user.id, tmdbId);
  } catch (error) {
    if (isDynamicServerUsageError(error)) {
      return null;
    }
    console.error("Failed to get series status:", error);
    return null;
  }
}

export async function markSeriesAsWatched(
  seriesId: number,
  watchedAt: Date,
  isSeriesInDb: boolean
): Promise<{ series: SeriesType; shouldShowRating: boolean }> {
  try {
    const user = await requireUser(`/series/${seriesId}?tmdb=true`);
    let result: SeriesType;

    if (isSeriesInDb) {
      // if coming from TMDB, resolve DB id first
      let idToUse = seriesId;
      const dbSeries = await getSeriesByTmdbId(user.id, seriesId);
      if (dbSeries?.id) idToUse = dbSeries.id;
      result = (await dbMarkSeriesAsWatched(
        user.id,
        { id: idToUse },
        watchedAt,
        true
      )) as SeriesType;
    } else {
      const details = await getSeriesDetails(seriesId);
      result = (await dbMarkSeriesAsWatched(
        user.id,
        {
          id: details.id,
          name: details.name,
          overview: details.overview,
          first_air_date: details.first_air_date
            ? new Date(details.first_air_date)
            : null,
          last_air_date: details.last_air_date
            ? new Date(details.last_air_date)
            : null,
          number_of_episodes: details.number_of_episodes ?? null,
          number_of_seasons: details.number_of_seasons ?? null,
          genres: (details.genres || []).map((g) => g.name),
          poster_path: details.poster_path,
        },
        watchedAt,
        false
      )) as SeriesType;
    }

    // Revalidate the series page and profile pages
    revalidatePath("/series");
    revalidatePath(`/series/${seriesId}`);
    revalidatePath("/");
    revalidatePath("/profile");
    revalidatePath("/profile/recently-added");
    revalidatePath("/profile/latest-watched");

    return { series: result, shouldShowRating: true };
  } catch (error) {
    console.error("Failed to mark series as watched:", error);
    throw new Error("Failed to mark series as watched");
  }
}

export async function updateSeriesScore(
  seriesId: number,
  score: number
): Promise<SeriesType> {
  try {
    const user = await requireUser(`/series/${seriesId}`);
    const result = await dbUpdateSeriesScore(user.id, seriesId, score);

    // Revalidate the series page and profile pages
    revalidatePath("/series");
    revalidatePath(`/series/${seriesId}`);
    revalidatePath("/");
    revalidatePath("/profile");
    revalidatePath("/profile/recently-added");
    revalidatePath("/profile/latest-watched");

    return result;
  } catch (error) {
    console.error("Failed to update series score:", error);
    throw new Error("Failed to update series score");
  }
}
