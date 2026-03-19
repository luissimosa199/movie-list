# Repository Guidelines

## Project Structure & Module Organization
This is a Next.js 16 App Router project for managing movies and series. Route files live under `app/`, including page routes and server API handlers in `app/api/`. Reusable UI lives in `components/`, with decision-flow widgets grouped in `components/decisions/`. Shared logic is split across `lib/` (server actions, Prisma client), `api/` (TMDB and DB helpers), `utils/`, `hooks/`, `stores/`, and `types/`. Database schema and migrations live in `prisma/`. Static assets belong in `public/`.

## Build, Test, and Development Commands
- `npm run dev`: start the local Next.js dev server on `http://localhost:3000`.
- `npm run build`: create a production build and catch compile-time issues.
- `npm run start`: run the built app locally after `npm run build`.
- `npm run lint`: run the Next.js ESLint configuration.
- `npx prisma generate`: regenerate the Prisma client if the schema changes.

## Coding Style & Naming Conventions
Use TypeScript with strict mode and the `@/*` path alias. Follow the existing style: 2-space indentation, double quotes, semicolons, and typed props for React components. Use `PascalCase` for components (`MovieCard.tsx`), `camelCase` for hooks and utilities (`useDebounce.ts`, `randomRecommendation.ts`), and lowercase route segment names in `app/`. Keep Tailwind utility ordering readable rather than aggressively compacted. Run `npm run lint` before opening a PR.

## Testing Guidelines
There is no committed automated test suite yet. For now, treat `npm run lint` and `npm run build` as the minimum verification gate. When adding tests, place them near the feature or in a `__tests__/` folder, and name files `*.test.ts` or `*.test.tsx`. Prioritize coverage for API routes, Prisma-backed flows, and decision utilities in `utils/`.

## Commit & Pull Request Guidelines
Recent history favors short, imperative commit subjects, usually with a Conventional Commit prefix such as `feat:` (`feat: enhance movie search...`). Keep commits focused and descriptive. PRs should include a concise summary, note any schema or env changes, link the related issue if one exists, and add screenshots or short recordings for UI work.

## Configuration & Data
Required environment values include `DATABASE_URL`, `DIRECT_DATABASE_URL`, and `TMDB_API_TOKEN`. Do not commit secrets or generated local state such as `.env` contents or `.next/` artifacts. If Prisma models change, include the migration under `prisma/migrations/`.
