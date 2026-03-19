# Rewatch And ID Architecture Plan

## Goal
Fix two related problems:

1. Movies currently support only one watch timestamp.
2. Watched flows mix database IDs and TMDB IDs, which can attach actions and UI state to the wrong movie.

## Constraints
- Do not use `prisma db push`.
- For schema changes, use `prisma migrate dev`.
- For deployment, use `prisma migrate deploy`.

## Execution Steps

### 1. Audit the current watched flow
- Trace every movie watched read/write path in `lib/actions.ts`, `api/db.ts`, `app/api/movies/watched/route.ts`, and UI entry points.
- List every place where `id` is ambiguous between DB ID and TMDB ID.
- Confirm all pages/components that depend on `movies.watched_at`.

### 2. Define the canonical movie identity contract
- Keep `movies.id` as the internal primary key for all local relationships and writes.
- Treat `movies.tmdb_id` only as the external identifier used for TMDB lookup/import.
- Rename function parameters where needed so callers pass either `movieId` or `tmdbId`, never a generic `id`.

### 3. Design the rewatch data model
- Add a `movie_watch_events` table linked to `movies.id`.
- Store one row per watch event with at least:
  - `id`
  - `movie_id`
  - `watched_at`
  - `created_at`
- Decide whether score remains on `movies` for now. Recommended: keep score on `movies` in this phase.

### 4. Create the Prisma migration
- Update `prisma/schema.prisma` with the new watch event model and relation.
- Generate a migration with `prisma migrate dev`.
- Backfill one watch event for every existing movie whose `watched_at` is not null.
- Do not remove `movies.watched_at` in the same step unless the full app refactor is already complete.

### 5. Refactor database helpers
- Replace `markMovieAsWatched` so it creates a new watch event instead of overwriting `movies.watched_at`.
- Add helpers for:
  - latest watch event per movie
  - watch count per movie
  - latest watched movies ordered by event time
  - watched status by `tmdb_id`
- Update stats queries to read from watch events rather than `movies.watched_at`.

### 6. Refactor server actions and API routes
- Update `lib/actions.ts` and `app/api/movies/watched/route.ts` to use explicit DB ID vs TMDB ID inputs.
- Remove “guessing” logic that tries to infer whether a numeric ID is a DB row or TMDB title.
- Ensure TMDB-origin flows resolve or create the canonical movie row first, then create the watch event.

### 7. Refactor UI state and wording
- Update watched buttons so previously watched movies can be marked as watched again.
- Show “Rewatch” or equivalent when the movie already has prior watch events.
- Display latest watched date and watch count where useful.
- Ensure “Latest Watched Movies” is sourced from watch events joined to the correct movie rows.

### 8. Remove legacy dependencies
- Once all reads and writes use watch events, remove remaining app logic that depends on `movies.watched_at`.
- If safe, create a follow-up migration to drop `movies.watched_at`.
- Keep the migration separate from the initial backfill if that reduces rollout risk.

### 9. Verify the fix
- Mark the same movie watched multiple times and confirm multiple events are stored.
- Reproduce the “Wake Up Dead Man: A Knives Out Mystery” case and confirm latest watched shows the correct movie.
- Run:
  - `npm run lint`
  - `npm run build`

### 10. Optional hardening
- Add tests for:
  - DB ID vs TMDB ID resolution
  - latest watched ordering
  - repeated rewatches
  - watched dashboard stats based on watch events
