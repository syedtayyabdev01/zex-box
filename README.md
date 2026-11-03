# ZEX BOX

A free-to-use, ad-free, no-account entertainment discovery experience.

> ZEX BOX is an independent product. MovieBox is used only as a high-level product reference; this repository does not copy its source code, branding, assets, or proprietary interface.

## Product principles
- No ads, subscriptions, paywalls, or account requirement.
- Fast, responsive experience across desktop, tablet, and mobile.
- Original ZEX BOX visual identity and accessible interactions.
- Catalog metadata from sources we are permitted to use.
- Playback only through authorized, licensed, public-domain, or user-owned sources.
- No scraping, DRM circumvention, or unlicensed stream embedding.

## Current functionality
- Responsive original ZEX BOX landing experience.
- Live trending catalog and movie/series search through the TMDB API adapter.
- Filters for all titles, movies, and series.
- Device-local watchlist; no account or cloud profile.
- Explicit provider setup and failure states; no fabricated catalog results.
- TMDB attribution notice in the credits area.

## Configure catalog metadata
1. Create a TMDB account and request a developer API key at https://www.themoviedb.org/settings/api.
2. Copy the API Read Access Token into a local `.env.local` file as `TMDB_API_READ_ACCESS_TOKEN=...`.
3. Add the same variable in Vercel Project Settings → Environment Variables for Production, Preview, and Development as needed.
4. Restart the local dev server or redeploy after changing environment variables.

The token is read only on the server and must never be committed. TMDB's developer API is free for non-commercial use with attribution. A free-to-user app is not necessarily non-commercial; contact TMDB for written commercial licensing if the project is operated for revenue. Read the [official FAQ](https://developer.themoviedb.org/docs/faq).

## Development
Requirements: Node.js 20.9+ and npm.

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run build
```

Open http://localhost:3000.

## Deployment
Import this repository into Vercel. Configure `TMDB_API_READ_ACCESS_TOKEN` as a server-side environment variable. Never add secrets to source control. A public launch requires adding the approved TMDB logo to the credits area and confirming the project's license status.

## Playback status
The catalog adapter provides metadata only. No streaming source is configured. ZEX BOX will show a clear unavailable state until an authorized playback provider or licensed source is integrated.

## License
To be decided before public distribution. Third-party names, metadata, images, and trademarks remain the property of their respective owners.
