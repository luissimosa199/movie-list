import Link from "next/link";
import type { ReactNode } from "react";
import { getProfileStats } from "@/api/db";
import { requireUser } from "@/lib/auth-session";

function formatHours(minutes: number): string {
  const hours = minutes / 60;
  return `${Number.isInteger(hours) ? hours : hours.toFixed(1)}h`;
}

function intensityFor(count: number): number {
  if (count >= 5) return 4;
  if (count >= 3) return 3;
  if (count >= 2) return 2;
  if (count >= 1) return 1;
  return 0;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const metadata = {
  title: "Watching stats – Movie Tracker",
  description: "Your movie watching activity and taste summary.",
};

export default async function ProfileStatsPage() {
  const user = await requireUser("/profile/stats");
  const stats = await getProfileStats(user.id);

  if (stats.totalWatches === 0) {
    return (
      <main className="min-h-screen bg-black px-4 py-12 text-white sm:px-6">
        <div className="mx-auto w-full max-w-6xl">
          <Link href="/profile" className="text-sm text-zinc-400 hover:text-white">
            ← Profile
          </Link>
          <section
            data-testid="stats-empty-state"
            className="mt-10 rounded-3xl border border-white/10 bg-zinc-950 p-8 text-center shadow-2xl sm:p-12"
          >
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">
              Your story starts here
            </p>
            <h1 data-testid="stats-heading" className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Your watching stats
            </h1>
            <h2 className="mt-2 text-lg font-medium text-zinc-200">
              No movie watches yet
            </h2>
            <p className="mx-auto mt-3 max-w-md text-zinc-400">
              Log a movie to see your watching story take shape.
            </p>
            <Link
              href="/movies"
              className="mt-7 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-zinc-200"
            >
              Log a movie
            </Link>
          </section>
        </div>
      </main>
    );
  }

  const heatmapPadding = new Date(`${stats.activityDays[0].date}T00:00:00.000Z`).getUTCDay();
  const maxMonthlyCount = Math.max(...stats.monthlyActivity.map((month) => month.count), 1);
  const hasTaste =
    stats.topGenres.length > 0 || stats.rewatches.length > 0 || stats.ratings.length > 0;

  return (
    <main data-testid="stats-page" className="min-h-screen overflow-x-hidden bg-black px-4 py-10 text-white sm:px-6 lg:py-14">
      <div className="mx-auto w-full max-w-6xl">
        <Link href="/profile" className="text-sm text-zinc-400 hover:text-white">
          ← Profile
        </Link>
        <header className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">
              Movie history
            </p>
            <h1 data-testid="stats-heading" className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
              Your watching stats
            </h1>
          </div>
          <p className="max-w-sm text-sm leading-6 text-zinc-400">
            Every movie watch, including rewatches, in one view.
          </p>
        </header>

        <section className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-5" aria-label="Watch metrics">
          <Metric label="All-time watches" value={String(stats.totalWatches)} testId="stats-total" />
          <Metric label="This year" value={String(stats.watchesThisYear)} testId="stats-year" />
          <Metric label="This month" value={String(stats.watchesThisMonth)} testId="stats-month" />
          <Metric label="Known watch time" value={formatHours(stats.knownWatchMinutes)} testId="stats-watch-time" />
          <Metric
            label="Active streak"
            value={stats.activeStreakDays > 0 ? `${stats.activeStreakDays} ${stats.activeStreakDays === 1 ? "day" : "days"}` : "No active streak"}
            testId="stats-streak"
          />
        </section>

        <section data-testid="stats-monthly-activity" className="mt-10 rounded-3xl border border-white/10 bg-zinc-950 p-5 sm:p-7">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Monthly activity</h2>
              <p className="mt-1 text-sm text-zinc-400">The last 12 months of movie watches.</p>
            </div>
          </div>
          <div className="mt-7 grid h-44 grid-cols-12 items-end gap-2 sm:gap-3">
            {stats.monthlyActivity.map((month) => (
              <div key={month.key} data-testid="stats-month-activity" className="flex h-full min-w-0 flex-col justify-end gap-2">
                <div className="flex h-full items-end rounded-t-md bg-white/5">
                  <div
                    data-testid={month.isCurrent ? "stats-month-current" : undefined}
                    data-count={month.count}
                    className="w-full rounded-t-md bg-primary"
                    style={{ height: month.count ? `${Math.max((month.count / maxMonthlyCount) * 100, 8)}%` : "3px" }}
                    aria-label={`${month.label}: ${month.count} watches`}
                  />
                </div>
                <span className="truncate text-center text-[10px] font-medium text-zinc-500 sm:text-xs">{month.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section data-testid="stats-activity-grid" className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 p-5 sm:p-7">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Daily activity</h2>
              <p className="mt-1 text-sm text-zinc-400">A trailing year of movie watches, aligned Sunday through Saturday.</p>
            </div>
            <div data-testid="stats-intensity-legend" className="flex items-center gap-1.5 text-xs text-zinc-500" aria-label="Activity intensity legend">
              <span>Less</span>
              {[0, 1, 2, 3, 4].map((level) => <span key={level} data-intensity={level} className="h-3 w-3 rounded-sm bg-primary" style={{ opacity: level === 0 ? 0.12 : level * 0.23 + 0.08 }} />)}
              <span>More</span>
            </div>
          </div>
          <div className="mt-6 max-w-full overflow-x-auto pb-2">
            <div className="grid min-w-[700px] grid-cols-7 gap-1.5" role="grid" aria-label="Movie watches by day">
              {Array.from({ length: heatmapPadding }, (_, index) => <span key={`blank-${index}`} aria-hidden="true" />)}
              {stats.activityDays.map((day) => {
                const intensity = intensityFor(day.count);
                return (
                  <span
                    key={day.date}
                    data-testid={`stats-day-${day.date}`}
                    data-count={day.count}
                    data-intensity={intensity}
                  >
                    <span
                      role="gridcell"
                      tabIndex={0}
                      data-testid={day.count > 0 ? `stats-day-count-${day.count}` : undefined}
                      data-count={day.count}
                      data-intensity={intensity}
                      aria-label={`${day.date}: ${day.count} ${day.count === 1 ? "movie watch" : "movie watches"}`}
                      title={`${day.date}: ${day.count} watches`}
                      className="block aspect-square rounded-sm bg-primary outline-none ring-primary/80 focus:ring-2"
                      style={{ opacity: intensity === 0 ? 0.12 : intensity * 0.23 + 0.08 }}
                    />
                  </span>
                );
              })}
            </div>
          </div>
        </section>

        {hasTaste ? (
          <section data-testid="stats-taste" className="mt-6 rounded-3xl border border-white/10 bg-zinc-950 p-5 sm:p-7">
            <h2 className="text-xl font-semibold">Your taste</h2>
            <div className="mt-5 grid gap-6 md:grid-cols-3">
              {stats.topGenres.length ? <TasteList title="Top genres" testId="stats-top-genres">{stats.topGenres.map((item) => <TasteRow key={item.genre} label={item.genre} count={item.count} testId={`stats-top-genre-${slugify(item.genre)}`} />)}</TasteList> : null}
              {stats.rewatches.length ? <TasteList title="Rewatches" testId="stats-rewatches">{stats.rewatches.map((item) => <TasteRow key={item.title} label={item.title} count={item.count} testId={`stats-rewatch-${slugify(item.title)}`} />)}</TasteList> : null}
              {stats.ratings.length ? <TasteList title="Current ratings" testId="stats-ratings">{stats.ratings.map((item) => <TasteRow key={item.score} label={`${item.score} stars`} count={item.count} testId={`stats-rating-${item.score}`} />)}</TasteList> : null}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}

function Metric({ label, value, testId }: { label: string; value: string; testId: string }) {
  return <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4"><p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">{label}</p><p data-testid={testId} className="mt-3 text-2xl font-semibold tracking-tight">{value}</p></div>;
}

function TasteList({ title, testId, children }: { title: string; testId: string; children: ReactNode }) {
  return <div data-testid={testId}><h3 className="text-sm font-medium text-zinc-400">{title}</h3><dl className="mt-3 space-y-2">{children}</dl></div>;
}

function TasteRow({ label, count, testId }: { label: string; count: number; testId: string }) {
  return <div className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-3 py-2"><dt className="truncate text-sm text-zinc-200">{label}</dt><dd data-testid={testId} data-count={count} className="text-sm font-semibold text-white">{count}</dd></div>;
}
