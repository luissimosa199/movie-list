INSERT INTO "movie_watch_events" ("movie_id", "watched_at", "created_at")
SELECT m."id", m."watched_at", COALESCE(m."updated_at", CURRENT_TIMESTAMP)
FROM "movies" m
WHERE m."watched_at" IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM "movie_watch_events" e
    WHERE e."movie_id" = m."id"
      AND e."watched_at" = m."watched_at"
  );
