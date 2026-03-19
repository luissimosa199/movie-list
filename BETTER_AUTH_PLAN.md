# Better Auth Implementation Plan

## Goal

Add a simple email/password login flow with Better Auth and protect the `/profile` route tree so unauthenticated users are redirected to sign in.

## Current Repo Constraints

- The app currently has no auth layer, no user/session models, and no auth dependencies in `package.json`.
- The Prisma schema only contains global `movies`, `movie_watch_events`, and `series` data.
- `/profile`, `/profile/latest-watched`, and `/profile/recently-added` are server-rendered pages that read directly from shared database helpers.
- Protecting `/profile` is straightforward, but the data is still global. This plan adds authentication, not per-user data ownership.

## Docs Used

- Better Auth email/password: https://better-auth.com/docs/authentication/email-password
- Better Auth Prisma adapter: https://better-auth.com/docs/adapters/prisma
- Better Auth Next.js integration: https://better-auth.com/docs/integrations/next

## Recommended Scope

Implement:

- Email + password sign-up and sign-in
- Session-backed auth with Better Auth
- Server-side protection for the `/profile` route tree
- Basic signed-in UI state in the header

Do not implement in this pass:

- OAuth providers
- Password reset email flow
- Role-based authorization
- Multi-user ownership for movies/series

## Implementation Steps

### 1. Install and configure Better Auth

- Add `better-auth` to dependencies.
- Create `lib/auth.ts` with a `betterAuth(...)` instance.
- Use the Prisma adapter against the existing Prisma client in `lib/prisma.ts`.
- Enable email/password auth in the Better Auth config.
- Add the `nextCookies()` plugin as the last plugin so cookie-setting actions work correctly in Next.js server actions.
- Set `baseURL` from environment configuration.

Expected new environment values:

- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`

## 2. Add Better Auth database schema

- Generate Better Auth’s Prisma models using the Better Auth CLI, then merge them into `prisma/schema.prisma`.
- Run a Prisma migration to create Better Auth tables such as user, session, account, and verification-related tables required by the chosen config.
- Regenerate the Prisma client.

Notes:

- Keep the existing movie and series tables unchanged for the initial auth rollout.
- Better Auth stores password credentials in its account table rather than on the user table.

### 3. Mount the Better Auth handler in Next.js

- Add an auth catch-all route at `app/api/auth/[...all]/route.ts`.
- Export Better Auth’s handler for the required HTTP methods.
- This gives the app the standard Better Auth endpoints used by the client and server APIs.

### 4. Create a reusable auth client

- Add `lib/auth-client.ts` using `createAuthClient(...)`.
- Use this client in client components for sign-in, sign-up, sign-out, and session state.
- Keep server-only session access in `lib/auth.ts` via `auth.api.getSession(...)`.

### 5. Build the auth screens

- Add a sign-in route such as `app/sign-in/page.tsx`.
- Add a sign-up route such as `app/sign-up/page.tsx`, or combine both flows into a single auth page if you want less UI surface area.
- Keep the form minimal:
  - email
  - password
  - optional display name for sign-up
- On success, redirect to `/profile`.
- Render useful inline errors for invalid credentials, duplicate emails, and weak inputs.

### 6. Protect the `/profile` route tree on the server

- Add a shared `app/profile/layout.tsx` guard or repeat the guard in each profile page.
- Preferred approach: in the profile layout, call `auth.api.getSession({ headers: await headers() })`.
- If no session exists, `redirect("/sign-in")`.
- This matches Better Auth’s documented recommendation to do the real auth check in each page or route, not rely only on proxy/middleware.

This should cover:

- `/profile`
- `/profile/latest-watched`
- `/profile/recently-added`

### 7. Add optional optimistic redirecting with `proxy.ts`

- Optionally add `proxy.ts` for a fast cookie-presence check on `/profile/:path*`.
- Use it only as an optimization to reduce unnecessary page work.
- Do not treat proxy-only checks as the security boundary; keep the server component session guard in place.

### 8. Update the header/navigation

- Replace the always-visible `Profile` link with auth-aware navigation.
- Recommended behavior:
  - signed out: show `Sign in`
  - signed in: show `Profile` and `Sign out`
- If header auth state is implemented in a client component, use the Better Auth client session hook/store there.

### 9. Decide whether the home page stays public

- Keep the dashboard-like home page public for now unless you want the entire app gated.
- Only protect `/profile` in this pass, since that is the stated requirement.

### 10. Verify the full flow

- Manual verification:
  - sign up with email/password
  - sign out
  - sign in with the created account
  - visit `/profile` while signed in
  - visit `/profile` while signed out and confirm redirect to `/sign-in`
  - confirm `/profile/latest-watched` and `/profile/recently-added` are also protected
- Project verification:
  - `npx prisma generate`
  - `npm run lint`
  - `npm run build`

## File Plan

Likely new files:

- `lib/auth.ts`
- `lib/auth-client.ts`
- `app/api/auth/[...all]/route.ts`
- `app/sign-in/page.tsx`
- `app/sign-up/page.tsx` or a shared auth page
- `app/profile/layout.tsx`
- `proxy.ts` if the optional optimization is added

Likely updated files:

- `package.json`
- `prisma/schema.prisma`
- `components/Header.tsx`
- Possibly `app/layout.tsx` if auth-aware providers are introduced

## Current Status

Completed:

- Better Auth email/password login is implemented
- Better Auth Prisma tables are added and migrated
- Sign-in and sign-up pages exist
- `/profile` routes are protected behind a session check
- Header navigation is auth-aware

Current limitation:

- app data is still global
- the first signed-in user can authenticate, but movies, series, and watch events are not yet owned by a specific user

## Next Phase: Per-User Ownership

### Goal

Assign all existing records to the first created Better Auth user, then refactor reads and writes so authenticated users only see and mutate their own data. If there is no valid session, redirect to login.

### Schema Changes

- Add `userId` to `movies`
- Add `userId` to `movie_watch_events`
- Add `userId` to `series`
- Add Prisma relations from those tables back to `User`
- Replace global uniqueness with user-scoped uniqueness where appropriate

Recommended uniqueness rules:

- `movies`: use composite uniqueness like `@@unique([userId, tmdb_id])` instead of global `tmdb_id`
- `series`: use composite uniqueness like `@@unique([userId, tmdb_id])`
- keep record `id` as the primary key

Notes:

- `movie_watch_events` should belong to both `movie` and `user`
- if `poster_url`, `imdb_id`, or similar fields remain unique globally, that can block multiple users from saving the same title; review those constraints during the ownership migration

### Data Backfill

- Find the first Better Auth user in the `user` table
- Assign all existing `movies`, `movie_watch_events`, and `series` rows to that user
- Run this as a migration or a one-time script immediately after the schema change

Backfill safety checks:

- fail clearly if no auth user exists
- make the backfill idempotent or easy to reason about
- verify row counts before and after updating ownership

### Auth Enforcement

- Add a shared `requireUser()` helper that resolves the server session and returns the authenticated user
- Redirect to `/sign-in` if there is no session
- Use this helper in pages, server actions, and route handlers that read or mutate personal data

### DB Helper Refactor

- Refactor all helpers in `api/db.ts` to accept `userId`
- Every query must filter by `userId`
- Every create/update/delete must write against records owned by `userId`
- Remove any remaining global reads for profile/list/watch state

This includes:

- dashboard/profile stats
- latest watched
- recently added
- movie existence checks
- add/remove from list
- mark as watched
- scoring
- series watch state

### Route and Action Refactor

- Update `lib/actions.ts` so all mutations resolve the current user before writing
- Update `app/api/movies/*` and `app/api/series/*` handlers to scope requests to the authenticated user
- Reject or redirect unauthenticated requests consistently

### UI Behavior

- Personal pages should require login
- Personal mutations should require login
- If public browsing remains allowed, signed-out users can view public pages but should be redirected before saving, rating, or marking watched

### Verification

- Sign in as the first user and confirm existing data is still visible after backfill
- Create a second user and confirm they start with an empty dataset
- Add the same movie for both users and confirm records do not collide
- Mark watched and score titles for each user and confirm isolation
- Verify `/profile`, `/movies`, `/series`, and mutation endpoints all enforce auth correctly
- Run:
  - `npx prisma generate`
  - `npm run lint`
  - `npm run build`

## Suggested Order of Work

1. Add `userId` ownership to Prisma models and adjust uniqueness constraints.
2. Create and run the backfill for the first Better Auth user.
3. Add a shared `requireUser()` server helper.
4. Refactor `api/db.ts` to be fully user-scoped.
5. Refactor server actions and API routes to derive `userId` from the session.
6. Protect remaining personal routes and mutation entry points.
7. Verify isolation with at least two users.
