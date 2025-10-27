"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { TMDBMovie, TMDBMovieWithDbStatus } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";

interface TMDBResponse {
  page: number;
  results: TMDBMovieWithDbStatus[];
  total_pages: number;
  total_results: number;
}

interface SearchBarProps {
  className?: string;
}

export default function SearchBar({ className = "" }: SearchBarProps) {
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
      className={`relative ${className}`}
      ref={searchContainerRef}
    >
      <div className="flex flex-col gap-2">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder="Search movies..."
          className="w-full px-4 py-2 text-sm bg-zinc-900 border border-zinc-700 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:border-primary transition-colors"
        />
        <div className="flex gap-2">{/* Filters removed as requested */}</div>
      </div>
      {isLoading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-zinc-600 border-t-primary rounded-full animate-spin"></div>
        </div>
      )}

      {showResults && searchResults.length > 0 && (
        <div className="absolute z-50 top-full left-0 w-full bg-zinc-900 border border-zinc-700 rounded-md mt-1 shadow-lg overflow-hidden">
          {searchResults.map((result) => (
            <Link
              key={result.id}
              href={
                result.inDb
                  ? `/movies/${result.dbId}`
                  : `/movies/${result.id}?tmdb=true`
              }
              onClick={handleResultClick}
              className="flex items-center p-3 hover:bg-zinc-800 transition-colors border-b border-zinc-700 last:border-b-0"
            >
              <div className="w-12 h-16 bg-zinc-800 rounded flex-shrink-0 overflow-hidden">
                {getPosterUrl(result) ? (
                  <Image
                    src={getPosterUrl(result)!}
                    alt={`${result.title} poster`}
                    width={48}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-500 text-xs">
                    No Image
                  </div>
                )}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <h3 className="text-white text-sm font-medium truncate">
                  {result.title}
                </h3>
                <p className="text-zinc-400 text-xs">
                  {getReleaseYear(result) || "Unknown Year"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
