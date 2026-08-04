"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import type { UnifiedSearchKind, UnifiedSearchResult } from "@/types";
import {
  SearchEmptyPoster,
  SearchInputFrame,
  SearchResultsPanel,
  SearchResultPoster,
} from "@/components/search/SearchShared";

type SearchResponse = {
  page: number;
  results: UnifiedSearchResult[];
  total_pages: number;
  total_results: number;
};

interface CatalogSearchProps {
  className?: string;
  compact?: boolean;
  disabled?: boolean;
  hideFooter?: boolean;
  limit?: number;
  placeholder?: string;
  allowedKinds?: UnifiedSearchKind[];
  onSelect?: (result: UnifiedSearchResult) => void;
}

const kindLabels: Record<UnifiedSearchKind, string> = {
  movie: "Movie",
  series: "Series",
  actor: "Actor",
  director: "Director",
};

const kindClasses: Record<UnifiedSearchKind, string> = {
  movie: "border-blue-400/20 bg-blue-400/10 text-blue-100",
  series: "border-emerald-400/20 bg-emerald-400/10 text-emerald-100",
  actor: "border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-100",
  director: "border-amber-400/20 bg-amber-400/10 text-amber-100",
};

export default function CatalogSearch({
  className = "",
  compact = false,
  disabled = false,
  hideFooter = false,
  limit = 6,
  placeholder = "Search the catalog",
  allowedKinds,
  onSelect,
}: CatalogSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UnifiedSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [totalResults, setTotalResults] = useState(0);
  const debouncedQuery = useDebounce(query, 300);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const activeRequestKeyRef = useRef("");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const trimmedQuery = debouncedQuery.trim();
    activeRequestKeyRef.current = trimmedQuery;

    if (disabled) {
      setResults([]);
      setError("");
      setIsLoading(false);
      setIsOpen(false);
      return;
    }

    if (!trimmedQuery) {
      setResults([]);
      setTotalResults(0);
      setError("");
      setIsLoading(false);
      setIsOpen(false);
      return;
    }

    let isActive = true;
    setIsLoading(true);
    setError("");

    const params = new URLSearchParams();
    params.set("query", trimmedQuery);
    params.set("page", "1");
    params.set("limit", String(limit));

    fetch(`/api/search?${params.toString()}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Search failed");
        }

        return response.json() as Promise<SearchResponse>;
      })
      .then((data) => {
        if (!isActive || activeRequestKeyRef.current !== trimmedQuery) {
          return;
        }

        const visibleResults = allowedKinds?.length
          ? data.results.filter((result) => allowedKinds.includes(result.kind))
          : data.results;

        setResults(visibleResults);
        setTotalResults(data.total_results);
        setIsOpen(true);
      })
      .catch((searchError) => {
        console.error("Catalog search failed:", searchError);
        if (!isActive || activeRequestKeyRef.current !== trimmedQuery) {
          return;
        }

        setResults([]);
        setTotalResults(0);
        setError("Search failed. Try again in a moment.");
        setIsOpen(true);
      })
      .finally(() => {
        if (isActive && activeRequestKeyRef.current === trimmedQuery) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [allowedKinds, debouncedQuery, disabled, limit]);

  const trimmedQuery = query.trim();
  const visibleResults = trimmedQuery ? results : [];
  const showPanel = Boolean(trimmedQuery) && isOpen;
  const showEmptyState =
    showPanel && !isLoading && !error && visibleResults.length === 0;
  const shouldShowFooter =
    !hideFooter && !onSelect && Boolean(trimmedQuery) && totalResults > 0;

  const handleSelect = (result: UnifiedSearchResult) => {
    onSelect?.(result);
    setQuery("");
    setResults([]);
    setTotalResults(0);
    setError("");
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const footerHref = `/search?q=${encodeURIComponent(trimmedQuery)}`;

  return (
    <div
      ref={searchContainerRef}
      className={`relative ${isOpen ? "z-[170]" : "z-[120]"} ${className}`}
    >
      <SearchInputFrame isLoading={isLoading} compact={compact}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(event) => {
            const nextValue = event.target.value;
            setQuery(nextValue);
            setIsOpen(Boolean(nextValue.trim()));
          }}
          onFocus={() => {
            if (query.trim()) {
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full bg-transparent font-medium text-white placeholder:text-blue-100/45 focus:outline-none ${
            compact
              ? "px-3 py-3 pr-11 text-[0.88rem]"
              : "px-4 py-4 pr-12 text-[0.98rem]"
          }`}
        />
      </SearchInputFrame>

      {showPanel ? (
        <SearchResultsPanel>
          {error ? (
            <div className="px-4 py-4 text-sm text-zinc-400">
              <p className="font-medium text-white">Search unavailable</p>
              <p className="mt-1 leading-6 text-zinc-400">{error}</p>
            </div>
          ) : showEmptyState ? (
            <div className="px-4 py-4 text-sm text-zinc-400">
              <p className="font-medium text-white">No matches found</p>
              <p className="mt-1 leading-6 text-zinc-400">
                Try another title or name.
              </p>
            </div>
          ) : (
            <div>
              {visibleResults.map((result) => {
                const kindLabel = kindLabels[result.kind];
                const kindClass = kindClasses[result.kind];
                const summary =
                  result.overview ??
                  (result.kind === "actor" || result.kind === "director"
                    ? "Open the profile for credits."
                    : "Open details for more.");
                const posterUrl = result.posterPath
                  ? `https://image.tmdb.org/t/p/w185${result.posterPath}`
                  : null;
                const metaLabel =
                  result.year ??
                  (result.voteAverage != null ? result.voteAverage.toFixed(1) : null) ??
                  "Unknown";

                const content = (
                  <>
                    <SearchResultPoster>
                      {posterUrl ? (
                        <Image
                          src={posterUrl}
                          alt={`${result.title} poster`}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      ) : (
                        <SearchEmptyPoster label="No Art" />
                      )}
                    </SearchResultPoster>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="truncate text-sm font-semibold tracking-[0.01em] text-white transition-colors group-hover:text-blue-100">
                          {result.title}
                        </h3>
                        <span
                          className={`shrink-0 rounded-full border px-2.5 py-1 text-[0.63rem] font-medium uppercase tracking-[0.18em] ${kindClass}`}
                        >
                          {kindLabel}
                        </span>
                      </div>
                      <p className="mt-1 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-zinc-500">
                        {metaLabel}
                      </p>
                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-zinc-400">
                        {summary}
                      </p>
                    </div>
                  </>
                );

                return onSelect ? (
                  <button
                    key={result.id}
                    type="button"
                    onClick={() => handleSelect(result)}
                    className="group flex w-full items-center gap-4 border-b border-white/8 px-4 py-3.5 text-left transition-colors hover:bg-white/[0.06] last:border-b-0"
                  >
                    {content}
                    <span className="ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white transition-transform group-hover:translate-x-0.5 group-hover:bg-white/[0.08]">
                      <svg
                        aria-hidden="true"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.75}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </button>
                ) : (
                  <Link
                    key={result.id}
                    href={result.href}
                    className="group flex items-center gap-4 border-b border-white/8 px-4 py-3.5 transition-colors hover:bg-white/[0.06] last:border-b-0"
                  >
                    {content}
                    <span className="ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-blue-100 transition-transform group-hover:translate-x-0.5 group-hover:bg-white/[0.08]">
                      <svg
                        aria-hidden="true"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.75}
                          d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </span>
                  </Link>
                );
              })}

              {shouldShowFooter ? (
                <Link
                  href={footerHref}
                  className="group flex items-center justify-between gap-4 bg-white/[0.03] px-4 py-3.5 transition-colors hover:bg-white/[0.08]"
                >
                  <div>
                    <p className="text-sm font-semibold text-white transition-colors group-hover:text-blue-100">
                      View all matches
                    </p>
                    <p className="mt-1 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-zinc-500">
                      {totalResults.toLocaleString()} matches
                    </p>
                  </div>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-blue-100 transition-transform group-hover:translate-x-0.5 group-hover:bg-white/[0.08]">
                    <svg
                      aria-hidden="true"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.75}
                        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </span>
                </Link>
              ) : null}
            </div>
          )}
        </SearchResultsPanel>
      ) : null}
    </div>
  );
}

