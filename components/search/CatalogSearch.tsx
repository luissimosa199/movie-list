"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useId, useRef, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import type { UnifiedSearchKind, UnifiedSearchResult } from "@/types";
import {
  SearchEmptyPoster,
  SearchIcon,
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

export type CatalogSearchVariant = "default" | "pill";

interface CatalogSearchProps {
  className?: string;
  compact?: boolean;
  disabled?: boolean;
  hideFooter?: boolean;
  limit?: number;
  placeholder?: string;
  allowedKinds?: UnifiedSearchKind[];
  onSelect?: (result: UnifiedSearchResult) => void;
  /**
   * "default" renders the large gradient field used on the search page and
   * in pickers. "pill" renders the slim header field with a right-anchored
   * results panel.
   */
  variant?: CatalogSearchVariant;
  /** Pill variant only: show the ⌘K hint while the field is empty. */
  showShortcutHint?: boolean;
  /** Pill variant only: stretch the results panel to the field's width. */
  fullWidthPanel?: boolean;
  autoFocus?: boolean;
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

const arrowIcon = (
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
);

const chevronIcon = (
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
);

export default function CatalogSearch({
  className = "",
  compact = false,
  disabled = false,
  hideFooter = false,
  limit = 6,
  placeholder = "Search the catalog",
  allowedKinds,
  onSelect,
  variant = "default",
  showShortcutHint = false,
  fullWidthPanel = false,
  autoFocus = false,
}: CatalogSearchProps) {
  const router = useRouter();
  const listId = useId();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UnifiedSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [totalResults, setTotalResults] = useState(0);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debouncedQuery = useDebounce(query, 300);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const activeRequestKeyRef = useRef("");
  const isPill = variant === "pill";

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
    setActiveIndex(-1);

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
  const footerHref = `/search?q=${encodeURIComponent(trimmedQuery)}`;

  const reset = () => {
    setQuery("");
    setResults([]);
    setTotalResults(0);
    setError("");
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleSelect = (result: UnifiedSearchResult) => {
    onSelect?.(result);
    reset();
    inputRef.current?.blur();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      if (trimmedQuery) {
        event.preventDefault();
        reset();
      } else {
        inputRef.current?.blur();
      }
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (!trimmedQuery) {
        return;
      }

      event.preventDefault();

      if (!isOpen) {
        setIsOpen(true);
        return;
      }

      const lastIndex = visibleResults.length - 1;
      setActiveIndex((current) => {
        if (event.key === "ArrowDown") {
          return current >= lastIndex ? 0 : current + 1;
        }

        return current <= 0 ? lastIndex : current - 1;
      });
      return;
    }

    if (event.key === "Enter") {
      const activeResult =
        activeIndex >= 0 ? visibleResults[activeIndex] : undefined;

      if (activeResult) {
        event.preventDefault();
        handleSelect(activeResult);
        if (!onSelect) {
          router.push(activeResult.href);
        }
        return;
      }

      if (!onSelect && trimmedQuery && !hideFooter) {
        event.preventDefault();
        reset();
        inputRef.current?.blur();
        router.push(footerHref);
      }
    }
  };

  const input = (
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
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      autoFocus={autoFocus}
      role="combobox"
      aria-expanded={showPanel}
      aria-controls={listId}
      aria-autocomplete="list"
      aria-activedescendant={
        activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined
      }
      className={
        isPill
          ? "min-w-0 flex-1 bg-transparent py-2 text-sm font-medium text-white placeholder:text-zinc-500 focus:outline-none"
          : `w-full bg-transparent font-medium text-white placeholder:text-blue-100/45 focus:outline-none ${
              compact
                ? "px-3 py-3 pr-11 text-[0.88rem]"
                : "px-4 py-4 pr-12 text-[0.98rem]"
            }`
      }
    />
  );

  const renderRowContent = (result: UnifiedSearchResult) => {
    const kindLabel = kindLabels[result.kind];
    const kindClass = kindClasses[result.kind];
    const posterUrl = result.posterPath
      ? `https://image.tmdb.org/t/p/w185${result.posterPath}`
      : null;

    if (isPill) {
      return (
        <>
          <div className="relative h-12 w-8 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] shadow-lg shadow-black/25">
            {posterUrl ? (
              <Image
                src={posterUrl}
                alt={`${result.title} poster`}
                fill
                sizes="32px"
                className="object-cover"
              />
            ) : (
              <SearchEmptyPoster label="" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold tracking-[0.01em] text-white transition-colors group-hover:text-blue-100">
              {result.title}
            </p>
            {result.year ? (
              <p className="mt-0.5 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-zinc-500">
                {result.year}
              </p>
            ) : null}
          </div>
          <span
            className={`shrink-0 rounded-full border px-2.5 py-1 text-[0.6rem] font-medium uppercase tracking-[0.18em] ${kindClass}`}
          >
            {kindLabel}
          </span>
        </>
      );
    }

    const summary =
      result.overview ??
      (result.kind === "actor" || result.kind === "director"
        ? "Open the profile for credits."
        : "Open details for more.");
    const metaLabel =
      result.year ??
      (result.voteAverage != null ? result.voteAverage.toFixed(1) : null) ??
      "Unknown";

    return (
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
  };

  const rowClass = (index: number) =>
    `group flex w-full items-center border-b border-white/8 text-left transition-colors last:border-b-0 ${
      isPill ? "gap-3 px-4 py-2.5" : "gap-4 px-4 py-3.5"
    } ${index === activeIndex ? "bg-white/[0.06]" : "hover:bg-white/[0.06]"}`;

  const rows = (
    <div id={listId} role="listbox">
      {visibleResults.map((result, index) => {
        const content = renderRowContent(result);
        const optionProps = {
          id: `${listId}-option-${index}`,
          role: "option" as const,
          "aria-selected": index === activeIndex,
          onMouseEnter: () => setActiveIndex(index),
        };

        return onSelect ? (
          <button
            key={result.id}
            type="button"
            onClick={() => handleSelect(result)}
            className={rowClass(index)}
            {...optionProps}
          >
            {content}
            {isPill ? null : (
              <span className="ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white transition-transform group-hover:translate-x-0.5 group-hover:bg-white/[0.08]">
                {chevronIcon}
              </span>
            )}
          </button>
        ) : (
          <Link
            key={result.id}
            href={result.href}
            onClick={() => handleSelect(result)}
            className={rowClass(index)}
            {...optionProps}
          >
            {content}
            {isPill ? null : (
              <span className="ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-blue-100 transition-transform group-hover:translate-x-0.5 group-hover:bg-white/[0.08]">
                {arrowIcon}
              </span>
            )}
          </Link>
        );
      })}

      {shouldShowFooter ? (
        <Link
          href={footerHref}
          onClick={reset}
          className={`group flex items-center justify-between gap-4 bg-white/[0.03] px-4 transition-colors hover:bg-white/[0.08] ${
            isPill ? "py-3" : "py-3.5"
          }`}
        >
          <div>
            <p className="text-sm font-semibold text-white transition-colors group-hover:text-blue-100">
              View all matches
            </p>
            <p className="mt-1 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-zinc-500">
              {totalResults.toLocaleString()} matches
            </p>
          </div>
          <span
            className={`flex shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-blue-100 transition-transform group-hover:translate-x-0.5 group-hover:bg-white/[0.08] ${
              isPill ? "h-8 w-8" : "h-9 w-9"
            }`}
          >
            {arrowIcon}
          </span>
        </Link>
      ) : null}
    </div>
  );

  const panelBody = error ? (
    <div className="px-4 py-4 text-sm text-zinc-400">
      <p className="font-medium text-white">Search unavailable</p>
      <p className="mt-1 leading-6 text-zinc-400">{error}</p>
    </div>
  ) : showEmptyState ? (
    <div className="px-4 py-4 text-sm text-zinc-400">
      <p className="font-medium text-white">No matches found</p>
      <p className="mt-1 leading-6 text-zinc-400">Try another title or name.</p>
    </div>
  ) : (
    rows
  );

  if (isPill) {
    return (
      <div ref={searchContainerRef} className={`relative ${className}`}>
        <div className="group flex h-10 items-center gap-2.5 rounded-full border border-white/10 bg-white/6 pl-3.5 pr-2.5 text-zinc-400 transition-[border-color,background-color,box-shadow] duration-200 hover:border-white/20 hover:bg-white/8 focus-within:border-blue-400/45 focus-within:bg-white/8 focus-within:text-blue-100 focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.16)]">
          <SearchIcon className="h-4 w-4 shrink-0" />
          {input}
          {isLoading ? (
            <span
              aria-hidden="true"
              className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-white/20 border-t-fuchsia-300"
            />
          ) : trimmedQuery ? (
            <button
              type="button"
              onClick={() => {
                reset();
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-zinc-400 hover:bg-white/10 hover:text-white"
            >
              <svg
                aria-hidden="true"
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          ) : showShortcutHint ? (
            <kbd
              aria-hidden="true"
              className="hidden h-5 shrink-0 items-center rounded-md border border-white/10 bg-white/[0.04] px-1.5 font-sans text-[0.65rem] font-medium tracking-[0.08em] text-zinc-500 group-focus-within:hidden sm:inline-flex"
            >
              ⌘K
            </kbd>
          ) : null}
        </div>

        {showPanel ? (
          <div
            className={`absolute top-full z-[130] mt-3 overflow-hidden rounded-[1.25rem] border border-white/10 bg-[linear-gradient(180deg,rgba(18,24,36,0.98),rgba(8,12,20,0.98))] shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl ${
              fullWidthPanel
                ? "left-0 w-full"
                : "right-0 w-[26rem] max-w-[calc(100vw-2rem)]"
            }`}
          >
            <div className="border-b border-white/8 bg-white/[0.03] px-4 py-2 text-[0.65rem] font-medium uppercase tracking-[0.28em] text-zinc-500">
              Top matches
            </div>
            {panelBody}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div
      ref={searchContainerRef}
      className={`relative ${isOpen ? "z-[170]" : "z-[120]"} ${className}`}
    >
      <SearchInputFrame isLoading={isLoading} compact={compact}>
        {input}
      </SearchInputFrame>

      {showPanel ? <SearchResultsPanel>{panelBody}</SearchResultsPanel> : null}
    </div>
  );
}
