/*
  Warnings:

  - You are about to drop the column `backdrop_path` on the `series` table. All the data in the column will be lost.
  - You are about to drop the column `networks` on the `series` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `series` table. All the data in the column will be lost.
  - You are about to drop the column `original_name` on the `series` table. All the data in the column will be lost.
  - You are about to drop the column `popularity` on the `series` table. All the data in the column will be lost.
  - You are about to drop the column `vote_average` on the `series` table. All the data in the column will be lost.
  - You are about to drop the column `vote_count` on the `series` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "series" DROP COLUMN "backdrop_path",
DROP COLUMN "networks",
DROP COLUMN "notes",
DROP COLUMN "original_name",
DROP COLUMN "popularity",
DROP COLUMN "vote_average",
DROP COLUMN "vote_count";
