"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import CatalogSearch from "@/components/search/CatalogSearch";
import { SearchIcon } from "@/components/search/SearchShared";

const DESKTOP_QUERY = "(min-width: 1024px)";

export default function HeaderSearch() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const desktopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isShortcut =
        (event.metaKey || event.ctrlKey) &&
        !event.altKey &&
        !event.shiftKey &&
        event.key.toLowerCase() === "k";

      if (!isShortcut) {
        return;
      }

      event.preventDefault();

      if (window.matchMedia(DESKTOP_QUERY).matches) {
        const input = desktopRef.current?.querySelector("input");
        input?.focus();
        input?.select();
        return;
      }

      setIsOpen(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <>
      <div ref={desktopRef} className="hidden w-52 lg:block xl:w-[18.75rem]">
        <CatalogSearch
          variant="pill"
          placeholder="Search"
          limit={5}
          showShortcutHint
        />
      </div>

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close search" : "Open search"}
        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-zinc-100 shadow-lg shadow-black/25 hover:border-white/20 hover:bg-white/10 md:h-10 md:w-10 md:rounded-full lg:hidden"
      >
        <SearchIcon className="h-5 w-5" />
      </button>

      {isOpen ? (
        <div className="lg:hidden">
          <button
            type="button"
            aria-label="Close search"
            onClick={() => setIsOpen(false)}
            className="absolute inset-x-0 top-full z-[240] h-[calc(100dvh-4.75rem)] bg-black/70 backdrop-blur-sm"
          />

          <div className="absolute inset-x-0 top-full z-[250] border-b border-white/8 bg-black/80 pb-4 pt-3 backdrop-blur-xl">
            <div className="page-frame">
              <CatalogSearch
                variant="pill"
                placeholder="Search"
                limit={5}
                fullWidthPanel
                autoFocus
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
