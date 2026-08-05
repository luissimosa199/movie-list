import Link from "next/link";
import { ReactNode } from "react";
import ClientGridWrapper from "@/components/ClientGridWrapper";

export type ProfileMedia = "movies" | "series";
export type ProfileSort = "newest" | "oldest";

type ProfileListPageProps = {
  backHref?: string;
  title: string;
  description: string;
  basePath: string;
  media: ProfileMedia;
  sort: ProfileSort;
  genre: string | null;
  genreOptions: string[];
  itemCount: number;
  countLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  emptyActionHref: string;
  emptyActionLabel: string;
  children: ReactNode;
};

function buildProfileHref(
  basePath: string,
  media: ProfileMedia,
  sort: ProfileSort,
  genre: string | null
) {
  const params = new URLSearchParams();

  if (media !== "movies") {
    params.set("media", media);
  }

  if (sort !== "newest") {
    params.set("sort", sort);
  }

  if (genre) {
    params.set("genre", genre);
  }

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export default function ProfileListPage({
  backHref = "/profile",
  title,
  description,
  basePath,
  media,
  sort,
  genre,
  genreOptions,
  itemCount,
  countLabel,
  emptyTitle,
  emptyDescription,
  emptyActionHref,
  emptyActionLabel,
  children,
}: ProfileListPageProps) {
  const mediaLabel = media === "movies" ? "Movies" : "Series";
  const sortLabel = sort === "newest" ? "Newest first" : "Oldest first";
  const clearHref = buildProfileHref(basePath, media, "newest", null);
  const currentGenreLabel = genre ?? "All genres";

  return (
    <main className="min-h-screen bg-black py-12 text-white">
      <div className="page-frame space-y-8 md:space-y-10">
        <div className="flex items-center gap-4">
          <Link
            href={backHref}
            className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
          >
            <svg
              className="h-5 w-5 transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </Link>
        </div>

        <section className="relative z-30 overflow-visible rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.92),rgba(10,14,22,0.92))] px-5 py-6 shadow-2xl shadow-black/20 md:px-8 md:py-8">
          <div className="absolute inset-0">
            <div className="absolute -left-10 top-0 h-40 w-40 rounded-full bg-blue-500/12 blur-3xl" />
            <div className="absolute right-0 top-8 h-36 w-36 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-white/8" />
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-[0.68rem] font-medium uppercase tracking-[0.32em] text-zinc-500">
                  {mediaLabel}
                </p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                  {title}
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300 md:text-base">
                  {description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-sm text-zinc-300">
                <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2">
                  <span className="text-white">{itemCount}</span> {countLabel}
                </div>
                <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2">
                  <span className="text-white">{sortLabel}</span>
                </div>
                <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2">
                  <span className="text-white">{currentGenreLabel}</span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_17rem] xl:items-stretch">
              <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4 backdrop-blur-sm">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[0.68rem] font-medium uppercase tracking-[0.3em] text-zinc-500">
                      Media
                    </p>
                    <p className="mt-1 text-sm text-zinc-400">
                      Switch between movies and series.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(["movies", "series"] as const).map((option) => {
                    const active = option === media;
                    return (
                      <Link
                        key={option}
                        href={buildProfileHref(basePath, option, sort, genre)}
                        className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                          active
                            ? "border-white/20 bg-white text-slate-950 shadow-lg shadow-black/20"
                            : "border-white/10 bg-white/[0.04] text-zinc-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {option === "movies" ? "Movies" : "Series"}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4 backdrop-blur-sm">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[0.68rem] font-medium uppercase tracking-[0.3em] text-zinc-500">
                      Sort
                    </p>
                    <p className="mt-1 text-sm text-zinc-400">
                      Keep newest-first or reverse the stack.
                    </p>
                  </div>
                  <Link
                    href={clearHref}
                    className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
                  >
                    Clear
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {([
                    { value: "newest", label: "Newest first" },
                    { value: "oldest", label: "Oldest first" },
                  ] as const).map((option) => {
                    const active = option.value === sort;
                    return (
                      <Link
                        key={option.value}
                        href={buildProfileHref(basePath, media, option.value, genre)}
                        className={`inline-flex items-center justify-center rounded-2xl border px-3 py-2.5 text-sm font-medium transition-all ${
                          active
                            ? "border-white/20 bg-white text-slate-950 shadow-lg shadow-black/20"
                            : "border-white/10 bg-white/[0.04] text-zinc-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {option.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4 backdrop-blur-sm">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[0.68rem] font-medium uppercase tracking-[0.3em] text-zinc-500">
                    Genre
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">
                    Narrow the list to one genre at a time.
                  </p>
                </div>
                {genre && (
                  <Link
                    href={clearHref}
                    className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
                  >
                    Clear genre
                  </Link>
                )}
              </div>

              {genreOptions.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {genreOptions.map((option) => {
                    const active = option === genre;
                    return (
                      <Link
                        key={option}
                        href={buildProfileHref(basePath, media, sort, option)}
                        className={`inline-flex items-center rounded-full border px-3 py-2 text-sm font-medium transition-all ${
                          active
                            ? "border-white/20 bg-white text-slate-950 shadow-lg shadow-black/20"
                            : "border-white/10 bg-white/[0.04] text-zinc-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {option}
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-zinc-500">No genres are available for this view.</p>
              )}
            </div>
          </div>
        </section>

        <section className="space-y-4 md:space-y-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[0.68rem] font-medium uppercase tracking-[0.3em] text-zinc-500">
                Results
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                Showing {itemCount} {countLabel}
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-zinc-400">
              {mediaLabel} sorted by {sortLabel.toLowerCase()}.
            </p>
          </div>

          {itemCount > 0 ? (
            <ClientGridWrapper>{children}</ClientGridWrapper>
          ) : (
            <div className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(9,12,18,0.96))] p-10 text-center shadow-2xl shadow-black/20 md:p-12">
              <p className="text-xl font-medium text-white md:text-2xl">
                {emptyTitle}
              </p>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-zinc-400 md:text-base">
                {emptyDescription}
              </p>
              <Link
                href={emptyActionHref}
                className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90"
              >
                {emptyActionLabel}
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
