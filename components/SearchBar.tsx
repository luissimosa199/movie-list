"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { TMDBMovieWithDbStatus } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";
import {
  SearchEmptyPoster,
  SearchInputFrame,
  SearchResultsPanel,
  SearchResultPoster,
} from "@/components/search/SearchShared";

interface TMDBResponse {
  page: number;
  results: TMDBMovieWithDbStatus[];
  total_pages: number;
  total_results: number;
}

interface SearchBarProps {
  className?: string;
  compact?: boolean;
}

export default function SearchBar({
  className = "",
  compact = false,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<TMDBMovieWithDbStatus[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [lastQueryWithResults, setLastQueryWithResults] = useState("");
  const debouncedQuery = useDebounce(query, 300); // 300ms delay
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const searchMovies = async () => {
      if (!debouncedQuery.trim()) {
        setSearchResults([]);
        setShowResults(false);
        setLastQueryWithResults("");
        return;
      }

      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (debouncedQuery.trim()) params.set("query", debouncedQuery);
        params.set("page", "1");
        params.set("limit", "5");

        const response = await fetch(`/api/movies?${params.toString()}`);

        if (!response.ok) {
          throw new Error("Search failed");
        }

        const data: TMDBResponse = await response.json();
        const results = data.results.slice(0, 5);
        setSearchResults(results);
        setShowResults(true);
        setLastQueryWithResults(debouncedQuery);
      } catch (error) {
        console.error("Error searching movies:", error);
        setSearchResults([]);
        setShowResults(false);
        setLastQueryWithResults("");
      } finally {
        setIsLoading(false);
      }
    };

    searchMovies();
  }, [debouncedQuery]);

  // Handle blur event - hide results if query hasn't changed
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    // Re-display results if the query changed after being hidden
    if (
      newQuery.trim() &&
      newQuery !== lastQueryWithResults &&
      searchResults.length > 0
    ) {
      setShowResults(true);
    } else if (newQuery.trim() && newQuery === lastQueryWithResults) {
      setShowResults(true);
    }
  };

  const handleInputFocus = () => {
    if (query.trim() && searchResults.length > 0) {
      setShowResults(true);
    }
  };

  const handleResultClick = () => {
    setShowResults(false);
    inputRef.current?.blur();
  };

  const getPosterUrl = (movie: TMDBMovieWithDbStatus) => {
    return movie.poster_path
      ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
      : null;
  };

  const getReleaseYear = (movie: TMDBMovieWithDbStatus) => {
    return movie.release_date
      ? new Date(movie.release_date).getFullYear()
      : null;
  };

  return (
    <div
      className={`relative z-[70] ${className}`}
      ref={searchContainerRef}
    >
      <SearchInputFrame isLoading={isLoading} compact={compact}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder="Search movies by title"
          className={`w-full bg-transparent font-medium text-white placeholder:text-blue-100/45 focus:outline-none ${
            compact
              ? "px-3 py-3 pr-11 text-[0.88rem]"
              : "px-4 py-4 pr-12 text-[0.98rem]"
          }`}
        />
      </SearchInputFrame>

      {showResults && searchResults.length > 0 && (
        <SearchResultsPanel>
          {searchResults.map((result) => (
            <Link
              key={result.id}
              href={
                result.inDb
                  ? `/movies/${result.dbId}`
                  : `/movies/${result.id}?tmdb=true`
              }
              onClick={handleResultClick}
              className="group flex items-center gap-4 border-b border-white/8 px-4 py-3.5 transition-colors hover:bg-white/[0.06] last:border-b-0"
            >
              <SearchResultPoster>
                {getPosterUrl(result) ? (
                  <Image
                    src={getPosterUrl(result)!}
                    alt={`${result.title} poster`}
                    width={50}
                    height={72}
                    className="w-full h-full object-cover"
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
                  {result.inDb ? (
                    <span className="shrink-0 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[0.63rem] font-medium uppercase tracking-[0.18em] text-emerald-200">
                      Saved
                    </span>
                  ) : (
                    <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[0.63rem] font-medium uppercase tracking-[0.18em] text-zinc-400">
                      TMDB
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-zinc-500">
                  {getReleaseYear(result) || "Unknown Year"}
                </p>
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-zinc-400">
                  {result.overview || "Open the detail page for synopsis and list actions."}
                </p>
              </div>
            </Link>
          ))}
        </SearchResultsPanel>
      )}
    </div>
  );
}
