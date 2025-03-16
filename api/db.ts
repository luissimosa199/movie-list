import prisma from "@/lib/prisma";
import { CreateMovieData, Movie } from "@/types";

export async function getLatestWatchedMovies(
  limit: number = 10,
  offset: number = 0
) {
  return (await prisma.movies.findMany({
    take: limit,
    skip: offset,
    orderBy: {
      watched_at: "desc",
    },
    where: {
      watched_at: {
        not: null,
      },
    },
  })) as Movie[];
}

export async function getRecentlyAddedMovies(
  limit: number = 10,
  offset: number = 0
) {
  return (await prisma.movies.findMany({
    take: limit,
    skip: offset,
    orderBy: {
      created_at: "desc",
    },
    where: {
      watched_at: null,
    },
  })) as Movie[];
}

export async function getMovie(id: number) {
  return (await prisma.movies.findUnique({ where: { id } })) as Movie;
}

export async function addMovieToList(
  movieData: CreateMovieData
): Promise<Movie> {
  return (await prisma.movies.create({
    data: movieData,
  })) as Movie;
}

export async function removeMovieFromList(id: number): Promise<Movie> {
  return (await prisma.movies.delete({
    where: { id },
  })) as Movie;
}

export async function movieExistsInDb(tmdb_id: number): Promise<boolean> {
  const movie = await prisma.movies.findFirst({
    where: {
      tmdb_id: tmdb_id,
    },
    select: {
      id: true,
    },
  });

  return movie ? movie.id : false;
}

export async function markMovieAsWatched(
  movieData: {
    tmdb_id: number;
    imdb_id: string;
    title: string;
    overview: string | null;
    release_date: Date | null;
    runtime: number | null;
    genres: string[] | null;
    poster_url: string | null;
  },
  now: Date
) {
  return (await prisma.movies.upsert({
    where: { tmdb_id: movieData.tmdb_id },
    update: { watched_at: now },
    create: {
      ...movieData,
      watched_at: now,
    },
  })) as Movie;
}
