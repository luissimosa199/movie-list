/*
  Restore movies from a CSV export into the Prisma `movies` table.
  Usage: npm run restore:movies -- path/to/movies.csv
*/

import fs from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import prisma from "@/lib/prisma";

type CsvRow = {
  id: string;
  created_at: string;
  updated_at: string;
  watched_at: string | null;
  title: string;
  overview: string | null;
  release_date: string | null;
  runtime: string | null;
  genres: string; // JSON-like array string
  poster_url: string | null;
  score: string | null;
  tmdb_id: string | null;
  imdb_id: string | null;
};

function toDateOrNull(value: string | null | undefined): Date | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  // Handle both date-only and datetime strings
  // Interpret input as local time then convert to Date object
  // We assume DB will store as UTC (Prisma/DB side).
  const isoLike = trimmed.replace(" ", "T") + (trimmed.length === 10 ? "T00:00:00" : "");
  const d = new Date(isoLike);
  return isNaN(d.getTime()) ? null : d;
}

function parseGenres(value: string | null | undefined): string[] {
  if (!value) return [];
  // CSV stores genres as "[""Drama"",""Romance""]"
  // Normalize double-quoted quotes to normal JSON quotes
  const normalized = value.replace(/""/g, '"');
  try {
    const arr = JSON.parse(normalized);
    return Array.isArray(arr) ? arr.map((g) => String(g)) : [];
  } catch {
    // Fallback: attempt to split by comma inside brackets
    const m = normalized.match(/^\[(.*)\]$/);
    if (!m) return [];
    return m[1]
      .split(",")
      .map((s) => s.trim().replace(/^"|"$/g, ""))
      .filter(Boolean);
  }
}

async function main() {
  const csvPathArg = process.argv.slice(2).find((a) => !a.startsWith("-"));
  const csvPath = csvPathArg ? path.resolve(process.cwd(), csvPathArg) : path.resolve(process.cwd(), "movies.csv");

  if (!fs.existsSync(csvPath)) {
    console.error(`CSV file not found: ${csvPath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(csvPath, "utf8");
  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as CsvRow[];

  console.log(`Parsed ${records.length} rows from ${path.basename(csvPath)}`);

  const batch: Parameters<typeof prisma.movies.upsert>[0][] = [] as any;

  for (const row of records) {
    const created_at = toDateOrNull(row.created_at)!;
    const updated_at = toDateOrNull(row.updated_at)!;
    const watched_at = toDateOrNull(row.watched_at || null);
    const release_date = toDateOrNull(row.release_date || null);
    const runtime = row.runtime ? Number(row.runtime) : null;
    const score = row.score ? Number(row.score) : null;
    const tmdb_id = row.tmdb_id ? Number(row.tmdb_id) : null;
    const imdb_id = row.imdb_id && row.imdb_id.trim() ? row.imdb_id.trim() : null;
    const genres = parseGenres(row.genres);

    // Use tmdb_id when present to keep uniqueness alignment
    const where = tmdb_id ? { tmdb_id } : { id: Number(row.id) };

    batch.push({
      where: where as any,
      update: {
        created_at,
        updated_at,
        watched_at,
        title: row.title,
        overview: row.overview,
        release_date,
        runtime,
        genres,
        poster_url: row.poster_url || null,
        score,
        tmdb_id: tmdb_id ?? undefined,
        imdb_id,
      },
      create: {
        created_at,
        updated_at,
        watched_at,
        title: row.title,
        overview: row.overview,
        release_date,
        runtime,
        genres,
        poster_url: row.poster_url || null,
        score,
        tmdb_id: tmdb_id ?? undefined,
        imdb_id,
      },
    });
  }

  // Execute sequentially to avoid overwhelming the DB and handle unique constraints deterministically
  let success = 0;
  for (const op of batch) {
    try {
      await prisma.movies.upsert(op as any);
      success += 1;
    } catch (e) {
      console.error("Failed to upsert row:", op.where, e);
    }
  }

  console.log(`Imported ${success}/${batch.length} rows.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


