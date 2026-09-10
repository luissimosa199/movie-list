ALTER TABLE "movies" ADD COLUMN "userId" TEXT;
ALTER TABLE "movie_watch_events" ADD COLUMN "userId" TEXT;
ALTER TABLE "series" ADD COLUMN "userId" TEXT;

WITH "first_user" AS (
    SELECT "id"
    FROM "user"
    ORDER BY "createdAt" ASC, "id" ASC
    LIMIT 1
)
UPDATE "movies" AS "m"
SET "userId" = "first_user"."id"
FROM "first_user"
WHERE "m"."userId" IS NULL;

UPDATE "movie_watch_events" AS "e"
SET "userId" = "m"."userId"
FROM "movies" AS "m"
WHERE "e"."movie_id" = "m"."id"
  AND "e"."userId" IS NULL;

WITH "first_user" AS (
    SELECT "id"
    FROM "user"
    ORDER BY "createdAt" ASC, "id" ASC
    LIMIT 1
)
UPDATE "series" AS "s"
SET "userId" = "first_user"."id"
FROM "first_user"
WHERE "s"."userId" IS NULL;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM "user") THEN
        RAISE EXCEPTION 'Cannot backfill ownership: no Better Auth user exists';
    END IF;

    IF EXISTS (SELECT 1 FROM "movies" WHERE "userId" IS NULL) THEN
        RAISE EXCEPTION 'Cannot backfill ownership: some movies rows still have NULL userId';
    END IF;

    IF EXISTS (SELECT 1 FROM "movie_watch_events" WHERE "userId" IS NULL) THEN
        RAISE EXCEPTION 'Cannot backfill ownership: some movie_watch_events rows still have NULL userId';
    END IF;

    IF EXISTS (SELECT 1 FROM "series" WHERE "userId" IS NULL) THEN
        RAISE EXCEPTION 'Cannot backfill ownership: some series rows still have NULL userId';
    END IF;
END $$;

ALTER TABLE "movies" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "movie_watch_events" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "series" ALTER COLUMN "userId" SET NOT NULL;

DROP INDEX "movies_poster_url_key";
DROP INDEX "movies_tmdb_id_key";
DROP INDEX "movies_imdb_id_key";
DROP INDEX "series_tmdb_id_key";

CREATE INDEX "movies_userId_created_at_idx" ON "movies"("userId", "created_at" DESC);
CREATE UNIQUE INDEX "movies_userId_tmdb_id_key" ON "movies"("userId", "tmdb_id");
CREATE INDEX "movie_watch_events_userId_watched_at_idx" ON "movie_watch_events"("userId", "watched_at" DESC);
CREATE INDEX "series_userId_created_at_idx" ON "series"("userId", "created_at" DESC);
CREATE UNIQUE INDEX "series_userId_tmdb_id_key" ON "series"("userId", "tmdb_id");

ALTER TABLE "movies" ADD CONSTRAINT "movies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "movie_watch_events" ADD CONSTRAINT "movie_watch_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "series" ADD CONSTRAINT "series_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
