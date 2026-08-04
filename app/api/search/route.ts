import { NextResponse } from "next/server";
import { searchAllMedia } from "@/api/tmdb";
import type {
  TMDBSearchMovieResult,
  TMDBSearchPersonResult,
  TMDBSearchSeriesResult,
  TMDBSearchMultiResult,
  UnifiedSearchResult,
} from "@/types";

type SearchResponse = {
  page: number;
  results: UnifiedSearchResult[];
  total_pages: number;
  total_results: number;
};

function parsePositiveInteger(value: string | null, fallback: number): number {
  const parsed = value ? Number.parseInt(value, 10) : Number.NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function getYear(dateValue: string | null | undefined): number | null {
  if (!dateValue) {
    return null;
  }

  const parsed = Number.parseInt(dateValue.slice(0, 4), 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function mapMediaResult(result: TMDBSearchMultiResult): UnifiedSearchResult | null {
  if (result.media_type === "movie") {
    const movie = result as TMDBSearchMovieResult;
    return {
      kind: "movie",
      id: movie.id,
      title: movie.title,
      year: getYear(movie.release_date),
      overview: movie.overview,
      posterPath: movie.poster_path,
      href: `/movies/${movie.id}`,
      voteAverage: movie.vote_average,
      voteCount: movie.vote_count,
    };
  }

  if (result.media_type === "tv") {
    const series = result as TMDBSearchSeriesResult;
    return {
      kind: "series",
      id: series.id,
      title: series.name,
      year: getYear(series.first_air_date),
      overview: series.overview,
      posterPath: series.poster_path,
      href: `/series/${series.id}`,
      voteAverage: series.vote_average,
      voteCount: series.vote_count,
    };
  }

  const person = result as TMDBSearchPersonResult;
  const kind =
    person.known_for_department.toLowerCase().includes("direct") ? "director" : "actor";

  return {
    kind,
    id: person.id,
    title: person.name,
    year: null,
    overview: null,
    posterPath: person.profile_path,
    href: `/people/${person.id}`,
    voteAverage: null,
    voteCount: null,
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = (url.searchParams.get("query") ?? url.searchParams.get("q") ?? "").trim();

  if (!query) {
    return NextResponse.json<SearchResponse>({
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    });
  }

  const page = parsePositiveInteger(url.searchParams.get("page"), 1);
  const limit = parsePositiveInteger(url.searchParams.get("limit"), 20);

  try {
    const response = await searchAllMedia(query, page, limit);
    const results = response.results
      .map(mapMediaResult)
      .filter((result): result is UnifiedSearchResult => Boolean(result));

    return NextResponse.json<SearchResponse>({
      page: response.page,
      results,
      total_pages: response.total_pages,
      total_results: response.total_results,
    });
  } catch (error) {
    console.error("Search API request failed:", error);
    return NextResponse.json(
      { error: "Failed to search catalog" },
      { status: 500 }
    );
  }
}
