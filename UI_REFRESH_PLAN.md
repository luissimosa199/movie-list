# UI Refresh Plan

## Objective

Upgrade the app from "functional dark theme" to a more intentional, production-grade interface without abandoning the existing product feel. The goal is not a full rebrand. The goal is a sharper, more cohesive experience across navigation, browsing pages, decision pages, and auth.

## Product Context

This app is a personal movie and series tracker with discovery features, watchlist flows, and decision games. The interface should feel cinematic, clear, and slightly editorial rather than generic SaaS.

## Design Direction

### Tone

Dark cinema dashboard with editorial structure:

- confident typography
- stronger spacing rhythm
- more deliberate hierarchy
- restrained but polished motion
- richer surface treatment than flat black sections

### Visual Thesis

The UI should feel like a curated film notebook, not a default Tailwind grid. Browsing should feel dense and useful. Decision pages should feel playful and premium. Utility pages should still carry atmosphere instead of looking like placeholders.

### Constraints

- Preserve the existing dark visual baseline
- Keep the app responsive on desktop and mobile
- Avoid novelty that slows browsing or search
- Respect current Next.js and Tailwind setup
- Improve accessibility while increasing personality

## Audit Summary

Based on the Playwright screenshot pass, the main issues are:

1. The mobile header is overcrowded and behaves like a desktop nav squeezed into a phone layout.
2. The movies page has weak above-the-fold hierarchy, especially on mobile.
3. Top-of-page alignment and container widths are inconsistent between search, promo, and grid sections.
4. Utility pages like About and Sign In feel visually unfinished because they sit in too much empty space.
5. Typography is underscaled in several places, especially nav text, support copy, and card metadata.
6. The series page repeats heading intent without adding value.
7. The decisions page has the best visual direction, but its copy scale and hierarchy still lag behind the card shells and CTAs.

## Success Criteria

The refresh is successful when:

- mobile navigation feels intentionally designed instead of compressed
- page tops establish one clear primary action or content focus
- section widths and spacing feel systematized across the app
- utility pages feel finished, not empty
- the interface keeps good browsing density without becoming visually noisy
- cards, banners, and CTAs feel like one product family

## Implementation Strategy

### Phase 1: Foundation

Establish a visual system before touching individual pages.

- define shared color tokens for backgrounds, panels, borders, muted text, and accents
- standardize max-width containers and horizontal padding behavior
- establish typography scale for nav, page titles, section titles, body copy, and metadata
- unify radius, border, and shadow treatment across cards and panels
- add a subtle atmospheric background treatment so pages are not sitting on flat black

### Phase 2: Navigation and Shell

Fix the app frame first because every page inherits it.

- redesign the header for mobile with a real compact navigation pattern
- keep desktop nav minimal, but increase clarity and perceived quality
- make the view toggle feel intentional and self-explanatory
- tighten vertical rhythm between header and page content

### Phase 3: Discovery Pages

Focus on `/movies` and `/series` because they carry the most repeated browsing behavior.

- rebuild the hero/top section so search, title, and discovery prompts are clearly prioritized
- stop mixing unrelated container widths in the same viewport band
- improve section intros and heading hierarchy
- refine grid density and card spacing for better scanability
- remove redundant headings on the series page
- ensure mobile gets to actual content faster

### Phase 4: Decision Experience

Push the strongest existing page into a finished state.

- keep the game-card concept, but improve typography scale and internal spacing
- create more deliberate contrast between each game mode without making the page noisy
- make the intro and back-link area feel connected to the cards below
- improve mobile pacing between stacked cards

### Phase 5: Utility and Auth Pages

Turn placeholder-feeling pages into deliberate screens.

- give About a stronger reading layout with better proportions and section rhythm
- turn Sign In and Sign Up into centered, atmospheric auth views with better balance
- add subtle page framing so these screens do not float in empty space

## Page-by-Page Plan

### Header

- introduce a true mobile menu or mobile-specific nav treatment
- reduce visual crowding in the top bar
- clarify the icon-only toggle with stronger affordance
- improve alignment between nav, auth actions, and view controls

### Movies

- add a clear page hero with title, short supporting copy, and search as the primary interaction
- demote or integrate the decision-games promo so it supports browsing instead of displacing it
- unify the top layout into one clean composition
- improve spacing between major sections

### Series

- mirror the improved discovery structure from Movies
- replace redundant titles with one strong heading and one useful section label
- keep the browse grid visually consistent with Movies

### Decisions

- preserve the colorful, game-oriented energy
- scale supporting text up slightly and improve contrast
- refine the card layout so each option reads faster
- strengthen the intro region and footer polish

### About

- convert the page into a designed editorial layout
- increase type size and line length quality for desktop reading
- add visual anchors so the page does not feel like plain text on a blank canvas

### Auth

- increase presence and balance of the auth card
- create a stronger page composition around the form
- keep the form simple, but make the screen feel finished

## Design Principles During Implementation

- Lead with hierarchy, not decoration
- Use one strong accent system instead of many random highlights
- Make dark surfaces layered, not flat
- Keep dense browsing areas practical
- Use motion sparingly and only where it reinforces structure
- Prefer a small number of strong layout decisions over many cosmetic tweaks

## Verification Plan

After implementation:

1. Capture new Playwright screenshots for desktop and mobile on the same routes used in the audit.
2. Compare header density, above-the-fold hierarchy, and overall balance page by page.
3. Run `npm run lint`.
4. Run `npm run build`.

## Recommended Execution Order

1. Global tokens, spacing, and shell
2. Header redesign
3. Movies page refresh
4. Series page alignment with Movies
5. Decisions page polish
6. About page editorial treatment
7. Auth page finish

## Notes

- This plan assumes incremental code changes inside the existing app, not a parallel redesign branch.
- The best outcome will come from treating this as a system refresh, not a set of isolated one-off fixes.
