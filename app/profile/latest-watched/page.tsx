import { getLatestWatchedProfileFeed } from "@/api/db";
import DiscoverySearchSection from "@/components/DiscoverySearchSection";
import ProfileFeed from "@/components/ProfileFeed";
import { requireUser } from "@/lib/auth-session";
import { ProfileFeedItem } from "@/types";
import Link from "next/link";

export default async function LatestWatchedPage() {
  const user = await requireUser("/profile/latest-watched");
  const { movies, series } = await getLatestWatchedProfileFeed(user.id);
  const items: ProfileFeedItem[] = [
    ...movies.map((movie) => ({
      mediaType: "movie" as const,
      movie,
      activityDate: movie.watched_at,
    })),
    ...series.flatMap((seriesItem) =>
      seriesItem.watched_at
        ? [
            {
              mediaType: "series" as const,
              series: seriesItem,
              activityDate: seriesItem.watched_at,
            },
          ]
        : []
    ),
  ];

  return (
    <main className="min-h-screen bg-black px-4 py-12 text-white">
      <div className="container mx-auto">
        <div className="mb-10 flex items-center gap-4">
          <Link
            href="/profile"
            className="group flex items-center gap-2 text-zinc-400 transition-colors hover:text-white"
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

        <h1 className="mb-10 text-3xl font-bold tracking-tight md:text-4xl">
          Latest watched
        </h1>

        <DiscoverySearchSection
          className="mb-10"
          eyebrow="Lookup"
          title="Search while reviewing watches."
          description="Jump to a title without losing place."
        />

        <ProfileFeed
          items={items}
          feedType="latest-watched"
          emptyTitle="No watched titles yet"
          emptyDescription="Start watching movies or series and they will appear here."
          emptyActionLabel="Browse movies"
          emptyActionHref="/movies"
        />
      </div>
    </main>
  );
}
