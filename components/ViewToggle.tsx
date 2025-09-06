"use client";

import React from "react";
import { useViewStore, useViewMode } from "@/stores/viewStore";

const ViewToggle = () => {
  const viewMode = useViewMode();
  const setViewMode = useViewStore((state) => state.setViewMode);

  const toggleView = () => {
    setViewMode(viewMode === "grid" ? "compact" : "grid");
  };

  return (
    <button
      onClick={toggleView}
      className="flex items-center justify-center p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors duration-200 border border-zinc-700"
      title={`Switch to ${viewMode === "grid" ? "compact" : "grid"} view`}
    >
      {viewMode === "grid" ? (
        // List/Compact view icon
        <svg
          className="w-5 h-5 text-zinc-300"
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
        // Grid view icon
        <svg
          className="w-5 h-5 text-zinc-300"
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
    </button>
  );
};

export default ViewToggle;
