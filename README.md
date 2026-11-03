# ZEX BOX

A free-to-use, ad-free, no-account entertainment discovery experience.

> ZEX BOX is an independent product. MovieBox is used only as a high-level product reference; this repository does not copy its source code, branding, assets, or proprietary interface.

## Product principles

- No ads, subscriptions, paywalls, or account requirement.
- Fast, responsive experience across desktop, tablet, and mobile.
- Original ZEX BOX visual identity and accessible interactions.
- Discovery metadata from sources we are permitted to use.
- Playback only through authorized, licensed, public-domain, or user-owned sources.
- No scraping, DRM circumvention, or unlicensed stream embedding.

## Current status

**Phase 0 — repository and product foundation.** The repository is being initialized with product requirements, architecture, a risk-aware reference audit, and a minimal Next.js application shell. No MovieBox backend, catalog, or playback source is assumed to be available.

## Planned experience

- Home / featured content
- Movies, series, and anime discovery
- Search and filters
- Title details and episode guides
- Watchlist stored locally (no account)
- Authorized playback handoff / provider integration
- Vercel deployment

## Development

Requirements: Node.js 20.9+ and npm.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deployment

Import this repository into Vercel. The project uses standard Next.js conventions. Configure only the environment variables required by the selected, authorized metadata or playback provider; never commit secrets.

## Project documents

- [Product requirements](docs/PRODUCT-REQUIREMENTS.md)
- [Reference audit](docs/REFERENCE-AUDIT.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Implementation roadmap](docs/ROADMAP.md)
- [Data and playback policy](docs/DATA-AND-PLAYBACK-POLICY.md)

## License

To be decided before public distribution. Third-party names, metadata, images, and trademarks remain the property of their respective owners.
