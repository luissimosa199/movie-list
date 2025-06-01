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

export async function movieExistsInDb(
  tmdb_id: number
): Promise<number | false> {
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

type ExistingMovieData = {
  id: number;
};

type NewMovieData = {
  id: number;
  title: string;
  overview: string | null;
  release_date: Date | null;
  runtime: number | null;
  genres: string[] | null;
  poster_path: string | null;
  imdb_id: string;
};

export async function markMovieAsWatched<T extends boolean>(
  movieData: T extends true ? ExistingMovieData : NewMovieData,
  now: Date,
  isMovieInDb: T
) {
  if (isMovieInDb) {
    console.log("@", { movieData });
    return (await prisma.movies.update({
      where: { id: movieData.id },
      data: { watched_at: now },
    })) as Movie;
  } else {
    const mappedMovieData = {
      tmdb_id: movieData.id,
      imdb_id: (movieData as NewMovieData).imdb_id,
      title: (movieData as NewMovieData).title,
      overview: (movieData as NewMovieData).overview || null,
      release_date: (movieData as NewMovieData).release_date,
      runtime: (movieData as NewMovieData).runtime || null,
      genres: (movieData as NewMovieData).genres || null,
      poster_url: (movieData as NewMovieData).poster_path
        ? `https://image.tmdb.org/t/p/original${
            (movieData as NewMovieData).poster_path
          }`
        : null,
    };

    return (await prisma.movies.upsert({
      where: { tmdb_id: mappedMovieData.tmdb_id },
      update: { watched_at: now },
      create: {
        ...mappedMovieData,
        watched_at: now,
      },
    })) as Movie;
  }
}

export async function updateMovieScore(
  movieId: number,
  score: number
): Promise<Movie> {
  return (await prisma.movies.update({
    where: { id: movieId },
    data: { score },
  })) as Movie;
}

export async function getMovieByTmdbId(tmdb_id: number): Promise<Movie | null> {
  return (await prisma.movies.findFirst({
    where: {
      tmdb_id: tmdb_id,
    },
  })) as Movie | null;
}
