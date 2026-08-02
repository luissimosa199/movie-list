"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { TMDBMovieWithDbStatus, TMDBSeries } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";
import { SearchIcon } from "@/components/search/SearchShared";

type SearchType = "movie" | "series" | "actor" | "director";

type PersonSearchResult = {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department?: string;
  known_for?: Array<{
    id: number;
    media_type?: "movie" | "tv";
    title?: string;
    name?: string;
  }>;
};

type SearchResult = TMDBMovieWithDbStatus | TMDBSeries | PersonSearchResult;

type SearchResponse<T> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};

const searchTypes: Array<{
  value: SearchType;
  label: string;
  eyebrow: string;
}> = [
  { value: "movie", label: "Movie", eyebrow: "Films" },
  { value: "series", label: "Series", eyebrow: "TV" },
  { value: "actor", label: "Actor", eyebrow: "People" },
  { value: "director", label: "Director", eyebrow: "People" },
];

interface SearchPageClientProps {
  initialQuery: string;
  initialType: SearchType;
}

function getEndpoint(type: SearchType, query: string, page: number) {
  const params = new URLSearchParams();
  params.set("query", query);
  params.set("page", String(page));
  params.set("limit", "20");

  if (type === "movie") {
    return `/api/movies?${params.toString()}`;
  }

  if (type === "series") {
    return `/api/series?${params.toString()}`;
  }

  return `/api/people?${params.toString()}`;
}

function getResultKey(type: SearchType, result: SearchResult) {
  return `${type}-${result.id}`;
}

function getMovieYear(movie: TMDBMovieWithDbStatus) {
  return movie.release_date ? new Date(movie.release_date).getFullYear() : null;
}

function getSeriesYear(series: TMDBSeries) {
  return series.first_air_date
    ? new Date(series.first_air_date).getFullYear()
    : null;
}

function getKnownFor(person: PersonSearchResult) {
  if (!person.known_for?.length) {
    return "Open the profile for credits.";
  }

  return person.known_for
    .slice(0, 3)
    .map((credit) => credit.title || credit.name)
    .filter(Boolean)
    .join(", ");
}

export default function SearchPageClient({
  initialQuery,
  initialType,
}: SearchPageClientProps) {
  const [query, setQuery] = useState(initialQuery);
  const [activeType, setActiveType] = useState<SearchType>(initialType);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const activeRequestKeyRef = useRef("");
  const router = useRouter();
  const pathname = usePathname();

  const trimmedQuery = debouncedQuery.trim();
  const hasMore = page < totalPages;

  const resultLabel = useMemo(() => {
    const selected = searchTypes.find((item) => item.value === activeType);
    return selected?.label.toLowerCase() ?? "result";
  }, [activeType]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (query.trim()) {
      params.set("q", query.trim());
    } else {
      params.delete("q");
    }

    params.set("type", activeType);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [activeType, pathname, query, router]);

  const fetchPage = useCallback(
    async (nextPage: number, mode: "replace" | "append") => {
      const requestKey = `${activeType}:${trimmedQuery}`;
      if (!trimmedQuery) {
        setResults([]);
        setPage(1);
        setTotalPages(0);
        setTotalResults(0);
        setError("");
        return;
      }

      if (mode === "replace") {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      setError("");

      try {
        const response = await fetch(getEndpoint(activeType, trimmedQuery, nextPage));
        if (!response.ok) {
          throw new Error("Search failed");
        }

        const data = (await response.json()) as SearchResponse<SearchResult>;
        if (activeRequestKeyRef.current !== requestKey) {
          return;
        }

        setResults((current) =>
          mode === "replace" ? data.results : [...current, ...data.results]
        );
        setPage(data.page);
        setTotalPages(data.total_pages);
        setTotalResults(data.total_results);
      } catch (searchError) {
        console.error("Search page request failed:", searchError);
        if (activeRequestKeyRef.current !== requestKey) {
          return;
        }

        setError("Search failed. Try again in a moment.");
        if (mode === "replace") {
          setResults([]);
          setPage(1);
          setTotalPages(0);
          setTotalResults(0);
        }
      } finally {
        if (activeRequestKeyRef.current === requestKey) {
          setIsLoading(false);
          setIsLoadingMore(false);
        }
      }
    },
    [activeType, trimmedQuery]
  );

  useEffect(() => {
    activeRequestKeyRef.current = `${activeType}:${trimmedQuery}`;
    setResults([]);
    setPage(1);
    setTotalPages(0);
    setTotalResults(0);
    fetchPage(1, "replace");
  }, [activeType, fetchPage, trimmedQuery]);

  useEffect(() => {
    const sentinel = observerRef.current;
    if (!sentinel || !hasMore || isLoading || isLoadingMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          fetchPage(page + 1, "append");
        }
      },
      { rootMargin: "420px 0px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchPage, hasMore, isLoading, isLoadingMore, page]);

  const renderResult = (result: SearchResult) => {
    if (activeType === "movie") {
      const movie = result as TMDBMovieWithDbStatus;
      const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
        : null;
      const href = movie.inDb
        ? `/movies/${movie.dbId}`
        : `/movies/${movie.id}?tmdb=true`;

      return (
        <Link
          key={getResultKey(activeType, result)}
          href={href}
          className="group grid grid-cols-[5.2rem_minmax(0,1fr)] gap-4 rounded-[1.4rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(8,12,20,0.97))] p-3 shadow-[0_18px_50px_rgba(0,0,0,0.22)] hover:-translate-y-0.5 hover:border-blue-200/25 hover:bg-white/[0.04] sm:grid-cols-[6rem_minmax(0,1fr)]"
        >
          <ResultImage
            src={posterUrl}
            alt={`${movie.title} poster`}
            fallback="No Art"
          />
          <div className="min-w-0 py-1">
            <div className="flex items-start justify-between gap-3">
              <h2 className="line-clamp-2 text-lg font-semibold tracking-tight text-white group-hover:text-blue-100">
                {movie.title}
              </h2>
              <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[0.62rem] font-medium uppercase tracking-[0.18em] text-zinc-400">
                {movie.inDb ? "Saved" : "TMDB"}
              </span>
            </div>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
              {getMovieYear(movie) ?? "Unknown Year"}
            </p>
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-300">
              {movie.overview || "Open details for more."}
            </p>
          </div>
        </Link>
      );
    }

    if (activeType === "series") {
      const series = result as TMDBSeries;
      const posterUrl = series.poster_path
        ? `https://image.tmdb.org/t/p/w342${series.poster_path}`
        : null;

      return (
        <Link
          key={getResultKey(activeType, result)}
          href={`/series/${series.id}?tmdb=true`}
          className="group grid grid-cols-[5.2rem_minmax(0,1fr)] gap-4 rounded-[1.4rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(8,12,20,0.97))] p-3 shadow-[0_18px_50px_rgba(0,0,0,0.22)] hover:-translate-y-0.5 hover:border-emerald-200/25 hover:bg-white/[0.04] sm:grid-cols-[6rem_minmax(0,1fr)]"
        >
          <ResultImage
            src={posterUrl}
            alt={`${series.name} poster`}
            fallback="No Art"
          />
          <div className="min-w-0 py-1">
            <div className="flex items-start justify-between gap-3">
              <h2 className="line-clamp-2 text-lg font-semibold tracking-tight text-white group-hover:text-emerald-100">
                {series.name}
              </h2>
              <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[0.62rem] font-medium uppercase tracking-[0.18em] text-zinc-400">
                TMDB
              </span>
            </div>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
              {getSeriesYear(series) ?? "Unknown Year"}
            </p>
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-300">
              {series.overview || "Open details for more."}
            </p>
          </div>
        </Link>
      );
    }

    const person = result as PersonSearchResult;
    const profileUrl = person.profile_path
      ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
      : null;

    return (
      <Link
        key={getResultKey(activeType, result)}
        href={`/people/${person.id}`}
        className="group grid grid-cols-[5.2rem_minmax(0,1fr)] gap-4 rounded-[1.4rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(8,12,20,0.97))] p-3 shadow-[0_18px_50px_rgba(0,0,0,0.22)] hover:-translate-y-0.5 hover:border-fuchsia-200/25 hover:bg-white/[0.04] sm:grid-cols-[6rem_minmax(0,1fr)]"
      >
        <ResultImage src={profileUrl} alt={person.name} fallback="No Photo" />
        <div className="min-w-0 py-1">
          <div className="flex items-start justify-between gap-3">
            <h2 className="line-clamp-2 text-lg font-semibold tracking-tight text-white group-hover:text-fuchsia-100">
              {person.name}
            </h2>
            <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[0.62rem] font-medium uppercase tracking-[0.18em] text-zinc-400">
              {activeType}
            </span>
          </div>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
            {person.known_for_department || "Person"}
          </p>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-300">
            {getKnownFor(person)}
          </p>
        </div>
      </Link>
    );
  };

  return (
    <main className="min-h-screen py-8 text-white md:py-12">
      <div className="page-frame space-y-8 md:space-y-10">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.94),rgba(7,10,18,0.96))] px-5 py-6 shadow-2xl shadow-black/25 md:px-8 md:py-8">
          <div className="absolute inset-0 opacity-80">
            <div className="absolute -left-12 top-0 h-44 w-44 rounded-full bg-blue-500/12 blur-3xl" />
            <div className="absolute right-0 top-8 h-36 w-36 rounded-full bg-fuchsia-500/10 blur-3xl" />
          </div>

          <div className="relative z-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <p className="text-[0.68rem] font-medium uppercase tracking-[0.32em] text-zinc-500">
                Search Archive
              </p>
              <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
                Search titles and people.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300 md:text-base">
                Search titles and people from one view.
              </p>
            </div>

            <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-300">
              <span className="text-white">{totalResults.toLocaleString()}</span>{" "}
              {resultLabel} results
            </div>
          </div>

          <div className="relative z-10 mt-7 space-y-4">
            <div className="relative">
              <div className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-blue-100/80">
                <SearchIcon className="h-5 w-5" />
              </div>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search titles or people"
                className="min-h-[4rem] w-full rounded-[1.35rem] border border-blue-300/30 bg-[linear-gradient(180deg,rgba(17,24,39,0.76),rgba(5,7,12,0.8))] px-12 text-[1rem] font-medium text-white shadow-[0_20px_65px_rgba(0,0,0,0.35)] placeholder:text-blue-100/45 focus:border-fuchsia-200/50 focus:outline-none"
              />
              {isLoading ? (
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-fuchsia-300" />
                </div>
              ) : null}
            </div>

            <div className="flex gap-2 overflow-x-auto rounded-[1.2rem] border border-white/10 bg-black/25 p-1">
              {searchTypes.map((item) => {
                const isActive = item.value === activeType;

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setActiveType(item.value)}
                    className={`min-w-28 rounded-[0.95rem] px-4 py-3 text-left ${
                      isActive
                        ? "bg-white/12 text-white shadow-sm shadow-black/20"
                        : "text-zinc-400 hover:bg-white/6 hover:text-white"
                    }`}
                  >
                    <span className="block text-[0.6rem] font-medium uppercase tracking-[0.24em] text-zinc-500">
                      {item.eyebrow}
                    </span>
                    <span className="mt-1 block text-sm font-semibold">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          {!trimmedQuery ? (
            <EmptyState title="Start searching" copy="Enter a title or name." />
          ) : error ? (
            <EmptyState title="Search unavailable" copy={error} />
          ) : !isLoading && results.length === 0 ? (
            <EmptyState title="No results found" copy="Try another title or name." />
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {results.map(renderResult)}
            </div>
          )}

          <div ref={observerRef} className="h-8" />

          {isLoadingMore ? (
            <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.04] px-5 py-4 text-center text-sm text-zinc-400">
              Loading more...
            </div>
          ) : null}

          {!isLoading && !hasMore && results.length > 0 ? (
            <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] px-5 py-4 text-center text-sm text-zinc-500">
              End of results
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}

function ResultImage({
  src,
  alt,
  fallback,
}: {
  src: string | null;
  alt: string;
  fallback: string;
}) {
  return (
    <div className="relative aspect-[2/3] overflow-hidden rounded-[1rem] border border-white/10 bg-zinc-900">
      {src ? (
        <Image src={src} alt={alt} fill sizes="120px" className="object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(180deg,rgba(39,39,42,0.85),rgba(24,24,27,0.95))] px-2 text-center text-[0.65rem] font-medium uppercase tracking-[0.16em] text-zinc-500">
          {fallback}
        </div>
      )}
    </div>
  );
}

function EmptyState({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="rounded-[1.5rem] border border-dashed border-white/12 bg-white/[0.03] px-5 py-12 text-center">
      <h2 className="text-xl font-semibold tracking-tight text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{copy}</p>
    </div>
  );
}
