import { describe, expect, it } from "vitest";
import { profileFeedFixtures } from "@/tests/fixtures/catalog";
import { filterAndSortProfileFeed, listProfileFeedGenres } from "@/utils/profileFeed";

const title = (item: ReturnType<typeof profileFeedFixtures>[number]) =>
  item.mediaType === "movie" ? item.movie.title : item.series.name;

describe("profile feed filtering and sorting", () => {
  it("discovers exact genres and applies recently-added's unwatched default", () => {
    const items = profileFeedFixtures();
    expect(listProfileFeedGenres(items)).toEqual(["Drama", "Sci-Fi"]);
    expect(
      filterAndSortProfileFeed(items, {
        genre: "all",
        mediaType: "all",
        watched: "not-watched",
        sort: "activity",
      }).map(title)
    ).toEqual(["Breaking Bad", "Inception"]);
  });

  it("combines media, genre, and watched filters", () => {
    expect(
      filterAndSortProfileFeed(profileFeedFixtures(), {
        genre: "Sci-Fi",
        mediaType: "movie",
        watched: "watched",
        sort: "activity",
      }).map(title)
    ).toEqual(["Arrival"]);
  });

  it("sorts exact release and score orders with nulls last and stable ties", () => {
    const items = profileFeedFixtures();
    const base = { genre: "all", mediaType: "all", watched: "all" } as const;
    expect(filterAndSortProfileFeed(items, { ...base, sort: "release-asc" }).map(title)).toEqual([
      "Breaking Bad",
      "Arrival",
      "Inception",
    ]);
    expect(filterAndSortProfileFeed(items, { ...base, sort: "score-desc" }).map(title)).toEqual([
      "Arrival",
      "Breaking Bad",
      "Inception",
    ]);
    expect(filterAndSortProfileFeed(items, { ...base, sort: "activity" }).map(title)).toEqual([
      "Arrival",
      "Breaking Bad",
      "Inception",
    ]);
  });
});
