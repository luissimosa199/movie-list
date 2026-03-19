"use client";

import React from "react";
import { useViewMode } from "@/stores/viewStore";

interface ClientGridWrapperProps {
  children: React.ReactNode;
}

const ClientGridWrapper: React.FC<ClientGridWrapperProps> = ({ children }) => {
  const viewMode = useViewMode();

  const gridClasses =
    viewMode === "grid"
      ? "grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-6"
      : "flex flex-col gap-4";

  return <div className={gridClasses}>{children}</div>;
};

export default ClientGridWrapper;
