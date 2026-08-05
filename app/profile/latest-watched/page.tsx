import MovieCard from "@/components/MovieCard";
import SeriesCard from "@/components/SeriesCard";
import ProfileListPage, {
  type ProfileMedia,
  type ProfileSort,
} from "@/components/profile/ProfileListPage";
import {
  getLatestWatchedMovies,
  getLatestWatchedSeries,
} from "@/api/db";
import { requireUser } from "@/lib/auth-session";

type SearchParams = Promise<{
  media?: string;
  sort?: string;
  genre?: string;
}>;

type PageProps = {
  searchParams: SearchParams;
};

function resolveMedia(value?: string): ProfileMedia {
  return value === "series" ? "series" : "movies";
}

function resolveSort(value?: string): ProfileSort {
  return value === "oldest" ? "oldest" : "newest";
}

function resolveGenre(value?: string): string | null {
  const genre = value?.trim();
  return genre ? genre : null;
}

function buildQueryHref(
  basePath: string,
  media: ProfileMedia,
  sort: ProfileSort,
  genre: string | null
) {
  const params = new URLSearchParams();

  if (media !== "movies") {
    params.set("media", media);
  }

  if (sort !== "newest") {
    params.set("sort", sort);
  }

  if (genre) {
    params.set("genre", genre);
  }

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

function collectGenres(items: Array<{ genres?: string[] | null }>): string[] {
  return Array.from(
    new Set(
      items.flatMap((item) => item.genres ?? []).map((genre) => genre.trim()).filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b));
}

export default async function LatestWatchedPage({ searchParams }: PageProps) {
  const user = await requireUser("/profile/latest-watched");
  const params = await searchParams;
  const media = resolveMedia(params.media);
  const sort = resolveSort(params.sort);
  const genre = resolveGenre(params.genre);
  const basePath = "/profile/latest-watched";

  const [items, genreSourceItems] = await Promise.all([
    media === "movies"
      ? getLatestWatchedMovies(user.id, 50, 0, sort, genre)
      : getLatestWatchedSeries(user.id, 50, 0, sort, genre),
    media === "movies"
      ? getLatestWatchedMovies(user.id, 50, 0, "newest")
      : getLatestWatchedSeries(user.id, 50, 0, "newest"),
  ]);

  const genreOptions = collectGenres(genreSourceItems);
  const movieItems = items as Awaited<ReturnType<typeof getLatestWatchedMovies>>;
  const seriesItems = items as Awaited<ReturnType<typeof getLatestWatchedSeries>>;
  const countLabel = "watches";
  const emptyActionHref = genre
    ? buildQueryHref(basePath, media, "newest", null)
    : media === "movies"
      ? "/movies"
      : "/series";
  const emptyTitle = genre
    ? `No ${media === "movies" ? "movies" : "series"} match ${genre}`
    : media === "movies"
      ? "No watched movies yet"
      : "No watched series yet";
  const emptyDescription = genre
    ? "Try a different genre or clear the filters to widen the list."
    : media === "movies"
      ? "Start watching movies and they&apos;ll appear here."
      : "Start watching series and they&apos;ll appear here.";
  const emptyActionLabel = genre
    ? "Clear filters"
    : media === "movies"
      ? "Browse movies"
      : "Browse series";

  return (
    <ProfileListPage
      title="Latest watched"
      description="Review the most recent watches, switch media, and narrow the stack by genre."
      basePath={basePath}
      media={media}
      sort={sort}
      genre={genre}
      genreOptions={genreOptions}
      itemCount={items.length}
      countLabel={countLabel}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      emptyActionHref={emptyActionHref}
      emptyActionLabel={emptyActionLabel}
    >
      {media === "movies"
        ? movieItems.map((movie) => (
            <MovieCard
              key={movie.watch_event_id}
              movie={movie}
              source="db"
              isMovieInDb={movie.id}
              watchedMovie={null}
            />
          ))
        : seriesItems.map((series) => (
            <SeriesCard
              key={series.id}
              series={series}
              source="db"
              seriesInDb={null}
            />
          ))}
    </ProfileListPage>
  );
}
