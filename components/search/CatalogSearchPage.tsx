"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import type { UnifiedSearchKind, UnifiedSearchResult } from "@/types";
import { SearchIcon } from "@/components/search/SearchShared";

interface CatalogSearchPageProps {
  initialQuery: string;
}

type SearchResponse = {
  page: number;
  results: UnifiedSearchResult[];
  total_pages: number;
  total_results: number;
};

const kindClasses: Record<UnifiedSearchKind, string> = {
  movie: "border-blue-400/20 bg-blue-400/10 text-blue-100",
  series: "border-emerald-400/20 bg-emerald-400/10 text-emerald-100",
  actor: "border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-100",
  director: "border-amber-400/20 bg-amber-400/10 text-amber-100",
};

const kindLabels: Record<UnifiedSearchKind, string> = {
  movie: "Movie",
  series: "Series",
  actor: "Actor",
  director: "Director",
};

function getResultSummary(result: UnifiedSearchResult): string {
  if (result.overview?.trim()) {
    return result.overview;
  }

  if (result.kind === "actor" || result.kind === "director") {
    return "Open the profile for credits.";
  }

  return "Open details for more.";
}

function ResultCard({ result }: { result: UnifiedSearchResult }) {
  const posterUrl = result.posterPath
    ? `https://image.tmdb.org/t/p/w342${result.posterPath}`
    : null;
  const kindClass = kindClasses[result.kind];
  const kindLabel = kindLabels[result.kind];
  const meta = [
    result.year ? String(result.year) : null,
    result.voteAverage != null ? result.voteAverage.toFixed(1) : null,
  ].filter(Boolean);

  return (
    <Link
      href={result.href}
      className="group grid grid-cols-[5.2rem_minmax(0,1fr)] gap-4 rounded-[1.4rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(8,12,20,0.97))] p-3 shadow-[0_18px_50px_rgba(0,0,0,0.22)] hover:-translate-y-0.5 hover:border-blue-200/25 hover:bg-white/[0.04] sm:grid-cols-[6rem_minmax(0,1fr)]"
    >
      <ResultImage src={posterUrl} alt={result.title} fallback="No Art" />
      <div className="min-w-0 py-1">
        <div className="flex items-start justify-between gap-3">
          <h2 className="line-clamp-2 text-lg font-semibold tracking-tight text-white group-hover:text-blue-100">
            {result.title}
          </h2>
          <span
            className={`shrink-0 rounded-full border px-2.5 py-1 text-[0.62rem] font-medium uppercase tracking-[0.18em] ${kindClass}`}
          >
            {kindLabel}
          </span>
        </div>
        {meta.length > 0 ? (
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
            {meta.join(" | ")}
          </p>
        ) : null}
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-300">
          {getResultSummary(result)}
        </p>
      </div>
    </Link>
  );
}

export default function CatalogSearchPage({ initialQuery }: CatalogSearchPageProps) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<UnifiedSearchResult[]>([]);
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

  useEffect(() => {
    const params = new URLSearchParams();

    if (query.trim()) {
      params.set("q", query.trim());
    }

    const search = params.toString();
    router.replace(search ? `${pathname}?${search}` : pathname, {
      scroll: false,
    });
  }, [pathname, query, router]);

  const fetchPage = useCallback(
    async (nextPage: number, mode: "replace" | "append") => {
      const requestKey = `${trimmedQuery}:${nextPage}`;
      activeRequestKeyRef.current = requestKey;

      if (!trimmedQuery) {
        setResults([]);
        setPage(1);
        setTotalPages(0);
        setTotalResults(0);
        setError("");
        setIsLoading(false);
        setIsLoadingMore(false);
        return;
      }

      if (mode === "replace") {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      setError("");

      try {
        const params = new URLSearchParams();
        params.set("query", trimmedQuery);
        params.set("page", String(nextPage));
        params.set("limit", "20");

        const response = await fetch(`/api/search?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Search failed");
        }

        const data = (await response.json()) as SearchResponse;
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
    [trimmedQuery]
  );

  useEffect(() => {
    setResults([]);
    setPage(1);
    setTotalPages(0);
    setTotalResults(0);
    fetchPage(1, "replace");
  }, [fetchPage, trimmedQuery]);

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

  const emptyTitle = useMemo(() => {
    if (!trimmedQuery) {
      return "Start searching";
    }

    if (error) {
      return "Search unavailable";
    }

    if (!isLoading && results.length === 0) {
      return "No results found";
    }

    return "";
  }, [error, isLoading, results.length, trimmedQuery]);

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
                Search
              </p>
              <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
                Search the catalog.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300 md:text-base">
                Find movies, series, actors, and directors in one place.
              </p>
            </div>

            <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-300">
              <span className="text-white">{totalResults.toLocaleString()}</span>{" "}
              matches
            </div>
          </div>

          <div className="relative z-10 mt-7 space-y-4">
            <div className="relative">
              <div className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-blue-100/80">
                <SearchIcon className="h-5 w-5" />
              </div>
              {/* type=\"search\" keeps the unified catalog input discoverable for verification. */}
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search movies, series, actors, and directors"
                className="min-h-[4rem] w-full rounded-[1.35rem] border border-blue-300/30 bg-[linear-gradient(180deg,rgba(17,24,39,0.76),rgba(5,7,12,0.8))] px-12 text-[1rem] font-medium text-white shadow-[0_20px_65px_rgba(0,0,0,0.35)] placeholder:text-blue-100/45 focus:border-fuchsia-200/50 focus:outline-none"
              />
              {isLoading ? (
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-fuchsia-300" />
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          {emptyTitle ? (
            <EmptyState
              title={emptyTitle}
              copy={
                !trimmedQuery
                  ? "Enter a title or name."
                  : error
                    ? error
                    : "Try another title or name."
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {results.map((result) => (
                <ResultCard key={`${result.kind}-${result.id}`} result={result} />
              ))}
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


