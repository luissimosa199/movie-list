-- CreateTable
CREATE TABLE "movie_watch_events" (
    "id" SERIAL NOT NULL,
    "movie_id" INTEGER NOT NULL,
    "watched_at" TIMESTAMP(6) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movie_watch_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "movie_watch_events_movie_id_watched_at_idx" ON "movie_watch_events"("movie_id", "watched_at" DESC);

-- CreateIndex
CREATE INDEX "movie_watch_events_watched_at_idx" ON "movie_watch_events"("watched_at" DESC);

-- AddForeignKey
ALTER TABLE "movie_watch_events" ADD CONSTRAINT "movie_watch_events_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
