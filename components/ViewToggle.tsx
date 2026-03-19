"use client";

import React from "react";
import { useViewStore, useViewMode } from "@/stores/viewStore";

type ViewToggleProps = {
  className?: string;
  showLabel?: boolean;
};

const ViewToggle = ({
  className = "",
  showLabel = false,
}: ViewToggleProps) => {
  const viewMode = useViewMode();
  const setViewMode = useViewStore((state) => state.setViewMode);
  const nextMode = viewMode === "grid" ? "compact" : "grid";
  const nextLabel = nextMode === "compact" ? "compact view" : "grid view";

  const toggleView = () => {
    setViewMode(nextMode);
  };

  return (
    <button
      type="button"
      onClick={toggleView}
      aria-label={`Switch to ${nextLabel}`}
      title={`Switch to ${nextLabel}`}
      className={`inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/6 px-3 py-2 text-sm font-medium text-zinc-200 shadow-lg shadow-black/20 hover:border-primary/35 hover:bg-white/10 ${className}`}
    >
      {viewMode === "grid" ? (
        <svg
          className="h-4 w-4 text-zinc-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
      ) : (
        <svg
          className="h-4 w-4 text-zinc-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
          />
        </svg>
      )}
      {showLabel ? (
        <span className="text-sm text-white">Switch to {nextLabel}</span>
      ) : (
        <span className="sr-only">Switch to {nextLabel}</span>
      )}
    </button>
  );
};

export default ViewToggle;
