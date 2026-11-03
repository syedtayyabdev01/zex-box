# ZEX BOX — Product Requirements

## Vision
Build an original, polished entertainment discovery app that is free to use, contains no advertising, and requires no login. The product should feel fast and calm rather than cluttered.

## Non-negotiable principles
1. No ads, sponsored placements, subscription prompts, or paywalls.
2. No account creation or login gate.
3. Mobile-first responsive layouts with keyboard accessibility.
4. Original name, visual system, layout composition, copy, and code.
5. Use only metadata, artwork, and playback sources whose use is authorized.
6. Never imply that a title can play until an authorized source has been verified.

## Core user journeys
- Open the home page and browse featured titles.
- Explore movies, series, and anime.
- Search by title and refine by category, year, language, or genre where metadata supports it.
- Open a title detail page and inspect synopsis, metadata, seasons, and episodes.
- Save or remove titles from a local watchlist without creating an account.
- Start playback only when a verified, authorized source is available; otherwise show a clear availability state and legitimate alternatives.

## UX quality bar
- Fast initial render; avoid large client bundles.
- Clear loading, empty, error, and unavailable states.
- Reduced-motion support and visible focus states.
- Responsive navigation and touch-friendly controls.
- No autoplay with sound; no deceptive controls.
- Do not display fabricated ratings, availability, episode counts, or provider labels.

## Initial release scope
**MVP:** landing page, navigation, discovery sections, search UI, title details, local watchlist, provider abstraction, and Vercel-ready deployment.

**Later:** provider-backed catalog, pagination, filters, episode guide, accessible player handoff, analytics only if privacy-respecting and explicitly approved (no ad tracking).

## Success criteria
- A visitor can browse without an account.
- No advertising or payment flow exists in the product.
- Search and watchlist have useful empty/error states.
- Playback is gated by source authorization, not by a fabricated playable URL.
- Lighthouse and real-device checks are part of release validation.
