# Reference Audit — MovieBox

**Reference:** https://movie-box.co/  
**Audit status:** Initial high-level product reconnaissance only. This is not a source-code audit and does not establish ownership, API access, licensing, or playback rights.

## Observed product concepts to evaluate
The reference is used to understand common entertainment-discovery patterns such as:
- Featured or trending content areas.
- Movie and television browsing.
- Genre/category navigation.
- Search and title detail flows.
- Series seasons and episode guides.
- Language or regional discovery.

These are broad product conventions, not elements to reproduce pixel-for-pixel.

## ZEX BOX differentiation
- Original ZEX BOX brand, typography, colors, spacing, and component design.
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
- Current uptime, catalog completeness, or provider contracts.

## Safe investigation method
1. Inspect publicly visible pages and user-facing interactions.
2. Record page types, navigation, information hierarchy, and responsive behavior.
3. Use browser developer tools only for ordinary public page behavior; do not bypass access controls.
4. Do not copy proprietary assets, scrape protected catalogs, evade DRM, or reproduce private APIs.
5. Verify metadata, artwork, and playback rights independently before integration.

## Initial finding
MovieBox is a useful category-level reference for the shape of an entertainment discovery product. ZEX BOX will be an independent implementation with its own design and authorized data/playback integrations.
