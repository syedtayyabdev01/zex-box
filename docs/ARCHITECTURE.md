# ZEX BOX — Architecture

## Proposed stack
- Next.js App Router + React + TypeScript.
- CSS Modules or a small global CSS system for the initial UI; avoid unnecessary dependencies.
- Vercel for hosting and preview deployments.
- Server-side provider adapters for catalog metadata where API terms permit.
- Browser localStorage for a small, non-sensitive watchlist; no account backend.

## High-level structure
```text
src/
  app/
    layout.tsx
    page.tsx
    globals.css
  components/
    site-header.tsx
    content-section.tsx
  lib/
    providers/
      catalog-provider.ts
    types.ts
docs/
```

## Provider boundaries
Define typed interfaces rather than coupling pages to one vendor:
- CatalogProvider: search, browse, and fetch title metadata.
- ArtworkProvider: return image URLs only where display rights and provider terms allow.
- PlaybackProvider: resolve only authorized playback or provider handoff options.

Provider credentials stay server-side in Vercel environment variables. Never expose private keys in client bundles or commit secrets.

## Playback states
- `available`: a provider has returned a verified, authorized playback target.
- `external`: a legitimate provider handoff is available.
- `unavailable`: metadata exists but no authorized playback source is configured.
- `error`: provider lookup failed.

A title must never be marked playable merely because an arbitrary URL exists.

## Privacy and no-login design
- No user accounts, authentication, or identity collection in the MVP.
- Watchlist is local to the visitor's browser.
- Avoid third-party ad scripts and ad networks entirely.
- Avoid analytics by default; any later telemetry requires a privacy review.

## Vercel
- Connect the GitHub repository to a Vercel project.
- Use preview deployments for pull requests and production deployment from main.
- Add provider keys only through Vercel environment settings.
- Configure a custom domain only after the deployment is verified.
