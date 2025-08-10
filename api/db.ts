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
      genres: (movieData as NewMovieData).genres || [],
      poster_url: (movieData as NewMovieData).poster_path
        ? `https://image.tmdb.org/t/p/original${(movieData as NewMovieData).poster_path
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

// Stats and dashboard helpers

export async function getTotalWatchedCount(): Promise<number> {
  return prisma.movies.count({
    where: {
      watched_at: {
        not: null,
      },
    },
  });
}

export async function getMoviesWatchedThisYearCount(): Promise<number> {
  const now = new Date();
  const startOfYearUTC = new Date(Date.UTC(now.getUTCFullYear(), 0, 1, 0, 0, 0));
  const startOfNextYearUTC = new Date(
    Date.UTC(now.getUTCFullYear() + 1, 0, 1, 0, 0, 0)
  );
  return prisma.movies.count({
    where: {
      watched_at: {
        gte: startOfYearUTC,
        lt: startOfNextYearUTC,
      },
    },
  });
}

export async function getFavoriteGenres(limit: number = 3): Promise<
  Array<{ genre: string; count: number }>
> {
  const watchedWithGenres = await prisma.movies.findMany({
    where: {
      watched_at: {
        not: null,
      },
      genres: {
        isEmpty: false,
      },
    },
    select: {
      genres: true,
    },
  });

  const genreToCount: Record<string, number> = {};
  for (const item of watchedWithGenres) {
    const genres = (item.genres || []) as string[];
    for (const g of genres) {
      const key = g.trim();
      if (!key) continue;
      genreToCount[key] = (genreToCount[key] || 0) + 1;
    }
  }

  return Object.entries(genreToCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([genre, count]) => ({ genre, count }));
}

function toUTCDateString(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export async function getWatchingStreak(): Promise<{
  currentStreakDays: number;
  longestStreakDays: number;
  lastWatchedAt: Date | null;
  watchedDaysThisYear: number;
}> {
  const watched = await prisma.movies.findMany({
    where: {
      watched_at: {
        not: null,
      },
    },
    select: {
      watched_at: true,
    },
    orderBy: { watched_at: "asc" },
  });

  if (watched.length === 0) {
    return {
      currentStreakDays: 0,
      longestStreakDays: 0,
      lastWatchedAt: null,
      watchedDaysThisYear: 0,
    };
  }

  const daySet = new Set<string>();
  for (const w of watched) {
    if (!w.watched_at) continue;
    daySet.add(toUTCDateString(w.watched_at));
  }

  const sortedDays = Array.from(daySet)
    .sort()
    .map((s) => new Date(`${s}T00:00:00.000Z`).getTime());

  let longest = 1;
  let current = 1;
  for (let i = 1; i < sortedDays.length; i++) {
    const prev = sortedDays[i - 1];
    const cur = sortedDays[i];
    const oneDay = 24 * 60 * 60 * 1000;
    if (cur - prev === oneDay) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }

  // Compute current streak relative to today (UTC)
  const todayUTC = new Date();
  const todayKey = toUTCDateString(todayUTC);
  const yesterdayUTC = new Date(
    Date.UTC(
      todayUTC.getUTCFullYear(),
      todayUTC.getUTCMonth(),
      todayUTC.getUTCDate() - 1
    )
  );
  const yesterdayKey = toUTCDateString(yesterdayUTC);

  let currentStreak = 0;
  if (daySet.has(todayKey) || daySet.has(yesterdayKey)) {
    // Walk backwards from the most recent day
    let cursor = new Date(daySet.has(todayKey) ? todayKey : yesterdayKey);
    while (daySet.has(toUTCDateString(cursor))) {
      currentStreak += 1;
      cursor = new Date(
        Date.UTC(
          cursor.getUTCFullYear(),
          cursor.getUTCMonth(),
          cursor.getUTCDate() - 1
        )
      );
    }
  }

  // Days watched this year (UTC)
  const year = todayUTC.getUTCFullYear();
  let watchedThisYear = 0;
  for (const key of daySet) {
    if (key.startsWith(`${year}-`)) watchedThisYear += 1;
  }

  return {
    currentStreakDays: currentStreak,
    longestStreakDays: longest,
    lastWatchedAt: watched[watched.length - 1]?.watched_at ?? null,
    watchedDaysThisYear: watchedThisYear,
  };
}

export async function getRecentActivity(limit: number = 4): Promise<{
  latestWatched: Movie[];
  recentlyAdded: Movie[];
}> {
  const [latestWatched, recentlyAdded] = await Promise.all([
    getLatestWatchedMovies(limit),
    getRecentlyAddedMovies(limit),
  ]);
  return { latestWatched, recentlyAdded };
}