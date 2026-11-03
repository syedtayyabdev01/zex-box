# ZEX BOX — Implementation roadmap

## Phase 0 — foundation
- [x] Create independent product identity and repository.
- [x] Audit the public reference homepage without copying its implementation.
- [x] Define playback authorization and metadata boundaries.
- [x] Build responsive Next.js application shell.

## Phase 1 — discovery MVP
- [x] Add server-side TMDB catalog adapter.
- [x] Add trending titles endpoint.
- [x] Add movie and TV search.
- [x] Add media-type filters.
- [x] Add device-local watchlist without login.
- [x] Add provider setup and error states.
- [ ] Add approved TMDB logo asset to credits before public launch.
- [ ] Configure TMDB developer token and verify live API behavior.
- [ ] Run install, typecheck, lint, and production build.

## Phase 2 — title experience
- [ ] Title detail pages with overview, genres, cast, seasons, and episode guide.
- [ ] Trailer links from official/authorized providers.
- [ ] Region-aware availability where a permitted source provides it.
- [ ] Clear unavailable playback state when no authorized source exists.

## Phase 3 — authorized playback
- [ ] Identify licensed/public-domain/user-owned content sources.
- [ ] Integrate only provider-approved playback URLs or official embeds.
- [ ] Verify desktop/mobile playback, errors, subtitles, and accessibility.
- [ ] No scraping, DRM bypass, or unlicensed streams.

## Phase 4 — release quality
- [ ] Add privacy/about/credits pages and legal contact route.
- [ ] Add metadata-provider attribution logo and verify licensing.
- [ ] Test keyboard navigation, reduced motion, responsive layouts, and performance.
- [ ] Deploy to Vercel and verify production routes.
- [ ] Connect a custom domain only after production smoke tests.
