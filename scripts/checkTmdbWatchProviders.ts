import fs from "node:fs";
import path from "node:path";

function loadEnvFile() {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) {
    return;
  }

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    if (!line || line.trim().startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, "");

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile();

const movieId = Number(process.argv[2] || "550");
const region = (process.argv[3] || "AR").toUpperCase();
const token = process.env.TMDB_API_TOKEN;

if (!token) {
  console.error("Missing TMDB_API_TOKEN in environment.");
  process.exit(1);
}

async function main() {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/watch/providers`,
    {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`TMDB request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const regionData = data?.results?.[region] ?? null;

  console.log(`Movie ID: ${movieId}`);
  console.log(`Region: ${region}`);
  console.log("");
  console.log("Top-level result regions:");
  console.log(Object.keys(data?.results ?? {}).join(", "));
  console.log("");

  if (!regionData) {
    console.log(`No watch provider data found for region ${region}.`);
    return;
  }

  const bucketNames = Object.keys(regionData).filter((key) =>
    Array.isArray(regionData[key])
  );

  console.log(`Region link: ${regionData.link ?? "none"}`);
  console.log(`Available buckets: ${bucketNames.join(", ") || "none"}`);
  console.log("");

  for (const bucketName of bucketNames) {
    const providers = regionData[bucketName] ?? [];
    console.log(`[${bucketName}] ${providers.length} providers`);

    for (const provider of providers) {
      console.log(
        `- ${provider.provider_name} | id=${provider.provider_id} | logo=${provider.logo_path ?? "none"}`
      );
    }

    console.log("");
  }

  console.log("Raw region payload:");
  console.log(JSON.stringify(regionData, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
