"use client";

import React, { useState, useEffect } from "react";
import { TMDBMovie } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";

interface TMDBResponse {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

interface SearchBarProps {
  className?: string;
}

export default function SearchBar({ className = "" }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<TMDBMovie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300); // 300ms delay

  useEffect(() => {
    const searchMovies = async () => {
      if (!debouncedQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/movies?query=${encodeURIComponent(
            debouncedQuery
          )}&page=1&limit=10`
        );

        if (!response.ok) {
          throw new Error("Search failed");
        }

        const data: TMDBResponse = await response.json();
        setSearchResults(data.results.slice(0, 10));
      } catch (error) {
        console.error("Error searching movies:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    searchMovies();
  }, [debouncedQuery]);

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search movies..."
        className="w-full px-4 py-2 text-sm bg-zinc-900 border border-zinc-700 rounded-md text-white placeholder-zinc-400 focus:outline-none focus:border-primary transition-colors"
      />
      {isLoading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-zinc-600 border-t-primary rounded-full animate-spin"></div>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="absolute z-100 top-full left-0 w-full bg-zinc-900 border border-zinc-700 rounded-md p-4">
          {searchResults.map((result) => (
            <div key={result.id}>{result.title}</div>
          ))}
        </div>
      )}
    </div>
  );
}
