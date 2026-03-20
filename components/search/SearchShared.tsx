import { ReactNode } from "react";

interface SearchInputFrameProps {
  children: ReactNode;
  isLoading: boolean;
  compact?: boolean;
}

export function SearchInputFrame({
  children,
  isLoading,
  compact = false,
}: SearchInputFrameProps) {
  return (
    <div className="group relative">
      <div className="pointer-events-none absolute inset-0 rounded-[1.6rem] bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.26),transparent_48%)] opacity-85 blur-[1px] transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100" />
      <div
        className={`relative flex items-center overflow-hidden border border-blue-300/35 bg-gradient-to-r from-blue-600 via-blue-500 to-fuchsia-500 shadow-[0_20px_65px_rgba(0,0,0,0.42)] transition-all duration-200 group-hover:border-blue-200/45 group-hover:shadow-[0_22px_70px_rgba(30,64,175,0.28)] group-focus-within:border-fuchsia-200/50 group-focus-within:shadow-[0_0_0_1px_rgba(96,165,250,0.28),0_24px_80px_rgba(168,85,247,0.26)] ${
          compact
            ? "min-h-[3.15rem] rounded-[1.1rem]"
            : "min-h-[4.25rem] rounded-[1.35rem]"
        }`}
      >
        <div
          className={`pointer-events-none absolute inset-[1px] bg-[linear-gradient(180deg,rgba(17,24,39,0.54),rgba(5,7,12,0.68))] ${
            compact ? "rounded-[calc(1.1rem-1px)]" : "rounded-[calc(1.35rem-1px)]"
          }`}
        />
        <div className="pointer-events-none absolute inset-0 opacity-80">
          <div className="absolute inset-y-0 left-0 w-28 bg-[radial-gradient(circle_at_left,rgba(255,255,255,0.22),transparent_72%)]" />
          <div className="absolute inset-y-0 right-0 w-28 bg-[radial-gradient(circle_at_right,rgba(255,255,255,0.16),transparent_72%)]" />
        </div>
        <div
          className={`pointer-events-none relative z-10 flex h-full items-center text-blue-100/85 transition-colors duration-200 group-hover:text-white group-focus-within:text-white ${
            compact ? "pl-3.5" : "pl-4"
          }`}
        >
          <SearchIcon className="h-5 w-5" />
        </div>
        <div className="relative z-10 flex-1">{children}</div>
        {isLoading ? (
          <div className="pointer-events-none absolute right-4 top-1/2 z-10 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-fuchsia-300" />
          </div>
        ) : null}
      </div>
    </div>
  );
}

interface SearchResultsPanelProps {
  children: ReactNode;
}

export function SearchResultsPanel({ children }: SearchResultsPanelProps) {
  return (
    <div className="absolute left-0 top-full z-[90] mt-3 w-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(18,24,36,0.98),rgba(8,12,20,0.98))] shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl">
      <div className="border-b border-white/8 bg-white/[0.03] px-4 py-2.5 text-[0.65rem] font-medium uppercase tracking-[0.28em] text-zinc-500">
        Top matches
      </div>
      <div>{children}</div>
    </div>
  );
}

export function SearchResultPoster({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="relative h-[4.5rem] w-[3.15rem] overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] shadow-lg shadow-black/20">
      {children}
    </div>
  );
}

export function SearchEmptyPoster({ label }: { label: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(180deg,rgba(39,39,42,0.85),rgba(24,24,27,0.95))] px-2 text-center text-[0.65rem] font-medium uppercase tracking-[0.16em] text-zinc-500">
      {label}
    </div>
  );
}

export function SearchIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
      />
    </svg>
  );
}
