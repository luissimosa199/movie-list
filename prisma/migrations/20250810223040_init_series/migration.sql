-- CreateEnum
CREATE TYPE "WatchStatus" AS ENUM ('plan_to_watch', 'watching', 'completed', 'dropped', 'on_hold');

-- CreateTable
CREATE TABLE "movies" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "watched_at" TIMESTAMP(6),
    "title" TEXT NOT NULL,
    "overview" TEXT,
    "release_date" DATE,
    "runtime" INTEGER,
    "genres" TEXT[],
    "poster_url" TEXT,
    "score" INTEGER,
    "tmdb_id" INTEGER,
    "imdb_id" TEXT,

    CONSTRAINT "movies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "series" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "watched_at" TIMESTAMP(6),
    "added_to_list_at" TIMESTAMP(6),
    "tmdb_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "original_name" TEXT,
    "overview" TEXT,
    "poster_url" TEXT,
    "backdrop_path" TEXT,
    "first_air_date" DATE,
    "last_air_date" DATE,
    "status" TEXT,
    "vote_average" DOUBLE PRECISION,
    "vote_count" INTEGER,
    "popularity" DOUBLE PRECISION,
    "original_language" TEXT,
    "origin_country" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "genres" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "networks" JSONB,
    "number_of_episodes" INTEGER,
    "number_of_seasons" INTEGER,
    "score" INTEGER,
    "notes" TEXT,
    "watch_status" "WatchStatus",

    CONSTRAINT "series_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "movies_poster_url_key" ON "movies"("poster_url");

-- CreateIndex
CREATE UNIQUE INDEX "movies_tmdb_id_key" ON "movies"("tmdb_id");

-- CreateIndex
CREATE UNIQUE INDEX "movies_imdb_id_key" ON "movies"("imdb_id");

-- CreateIndex
CREATE UNIQUE INDEX "series_tmdb_id_key" ON "series"("tmdb_id");
