import { ProfileFeedItem } from "@/types";

export type ProfileFeedSort =
  | "activity"
  | "release-asc"
  | "release-desc"
  | "score-asc"
  | "score-desc";

export type ProfileFeedWatchedFilter = "not-watched" | "watched" | "all";
export type ProfileFeedMediaTypeFilter = "all" | "movie" | "series";

export function getProfileFeedGenres(item: ProfileFeedItem): string[] {
  const genres = item.mediaType === "movie" ? item.movie.genres : item.series.genres;
  return (genres ?? []).map((genre) => genre.trim()).filter(Boolean);
}

export function listProfileFeedGenres(items: ProfileFeedItem[]): string[] {
  return Array.from(new Set(items.flatMap(getProfileFeedGenres))).sort((a, b) =>
    a.localeCompare(b)
  );
}

export function filterAndSortProfileFeed(
  items: ProfileFeedItem[],
  options: {
    genre: string;
    sort: ProfileFeedSort;
    mediaType: ProfileFeedMediaTypeFilter;
    watched: ProfileFeedWatchedFilter;
  }
): ProfileFeedItem[] {
  const isWatched = (item: ProfileFeedItem) =>
    Boolean(item.mediaType === "movie" ? item.movie.watched_at : item.series.watched_at);
  const releaseTime = (item: ProfileFeedItem) => {
    const date = item.mediaType === "movie" ? item.movie.release_date : item.series.first_air_date;
    return date ? new Date(date).getTime() : null;
  };
  const score = (item: ProfileFeedItem) =>
    item.mediaType === "movie" ? item.movie.score ?? null : item.series.score ?? null;

  return items
    .filter((item) => {
      if (options.genre !== "all" && !getProfileFeedGenres(item).includes(options.genre)) return false;
      if (options.mediaType !== "all" && item.mediaType !== options.mediaType) return false;
      if (options.watched === "watched" && !isWatched(item)) return false;
      if (options.watched === "not-watched" && isWatched(item)) return false;
      return true;
    })
    .map((item, index) => ({ item, index }))
    .sort((left, right) => {
      if (options.sort === "activity") {
        return (
          new Date(right.item.activityDate).getTime() -
            new Date(left.item.activityDate).getTime() ||
          left.index - right.index
        );
      }
      const leftValue = options.sort.startsWith("release") ? releaseTime(left.item) : score(left.item);
      const rightValue = options.sort.startsWith("release") ? releaseTime(right.item) : score(right.item);
      if (leftValue === null && rightValue === null) return left.index - right.index;
      if (leftValue === null) return 1;
      if (rightValue === null) return -1;
      const direction = options.sort.endsWith("desc") ? -1 : 1;
      return (leftValue - rightValue) * direction || left.index - right.index;
    })
    .map(({ item }) => item);
}
