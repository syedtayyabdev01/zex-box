# Reference Audit — MovieBox

**Reference:** https://movie-box.co/  
**Audit date:** 2026-11-03  
**Audit status:** Public homepage inspection completed. This is a user-facing product audit, not a source-code, API, licensing, or backend audit.

## Public homepage structure observed
The publicly accessible homepage exposes:
- Search input for movies and TV shows.
- Download/app promotion for mobile, Android TV, macOS, and Windows.
- Language options including English, Arabic, French, Bahasa Indonesia, Hindi, Urdu, and Filipino.
- Featured title tiles followed by category shelves.
- Shelves such as Trending Drama, Trending Movie, Trending in Indian Cinema, Hollywood Movie, Hot Short TV, Asian Drama, Western TV, Anime in Hindi, Movie New Release, TV Series New Release, Bollywood Movie, South Indian Movie, Top Punjabi Movies, Trending Bengali Movies, Indian Drama, and Popular Anime.
- A Coming Soon area with dates and booking counts.
- A Discover More promotional area.

The homepage also displays a disclaimer stating that video and picture copyrights belong to original creators and that MovieBox presents webpage services. This statement is not independent proof that any specific title or stream is licensed.

## UX observations and ZEX BOX opportunities
1. **Navigation and discovery:** ZEX BOX should make Movies, Series, Anime, and Search easy to reach, with a compact mobile navigation pattern.
2. **Content hierarchy:** Use fewer, clearer shelves with meaningful labels, consistent card sizes, and predictable spacing.
3. **Language support:** Plan language metadata and filters; do not claim a dub/subtitle exists unless the catalog provider confirms it.
4. **Coming soon:** Add release dates only when supplied by a reliable metadata source; omit unsupported popularity/booking counters.
5. **Download promotion:** ZEX BOX is a web-first Vercel app in the MVP. Do not promote unbuilt native apps.
6. **No-account promise:** Keep browsing open and store an optional watchlist locally in the browser.
7. **Playback clarity:** Distinguish metadata discovery from actual playback. Show an unavailable state unless an authorized playback provider is configured.

## ZEX BOX differentiation
- Original ZEX BOX brand, typography, colors, spacing, layout composition, and copy.
- Cleaner hierarchy and less visual clutter.
- Responsive mobile-first navigation.
- Better loading, empty, offline, and unavailable states.
- No ads, account prompts, subscriptions, or paid tiers.
- Transparent playback availability and source attribution.

## Not verified
- Reference site's internal source code or framework.
- Any private API, undocumented endpoint, database, or admin system.
- Rights to reuse its text, artwork, logos, or video streams.
- Whether any displayed stream is licensed for redistribution or embedding.
- Current catalog completeness, provider contracts, or regional availability.

## Safe investigation method
1. Inspect publicly visible pages and user-facing interactions.
2. Record page types, navigation, information hierarchy, and responsive behavior.
3. Use browser developer tools only for ordinary public page behavior; do not bypass access controls.
4. Do not copy proprietary assets, scrape protected catalogs, evade DRM, or reproduce private APIs.
5. Verify metadata, artwork, and playback rights independently before integration.

## Initial finding
MovieBox's homepage is a discovery-first entertainment catalog with many regional and format-specific shelves. ZEX BOX can improve the experience through stronger hierarchy, responsive navigation, transparent source availability, and a genuinely account-free interface. This is a reference for product patterns, not a template to clone.
