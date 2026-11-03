# Data, artwork, and playback policy

## Catalog metadata
The initial catalog adapter uses The Movie Database (TMDB) API. Developer API access is free for non-commercial use with required attribution. A commercial project requires contacting TMDB for a separate license. A free-to-user product is not automatically non-commercial; if ZEX BOX is operated to generate revenue or otherwise meets TMDB's commercial definition, obtain written permission before production use.

Required notice: "This product uses the TMDB API but is not endorsed or certified by TMDB."

TMDB also requires its approved logo in the application, placed less prominently than ZEX BOX branding, and attribution in an About/Credits area. The current footer contains the required text and TMDB link; adding the approved logo asset is a pre-launch checklist item. Follow the official [TMDB FAQ](https://developer.themoviedb.org/docs/faq) and [logos and attribution guidance](https://www.themoviedb.org/about/logos-attribution).

API credentials are server-side only in `TMDB_API_READ_ACCESS_TOKEN`. Never commit the token or expose it through a `NEXT_PUBLIC_` variable. Requests are not persistently cached by this app. Respect provider rate limits and current terms.

## Artwork
Artwork URLs are generated from TMDB image paths for display only, subject to TMDB's terms and the rights of the underlying image owners. Do not download, mirror, or repackage artwork. Do not treat metadata availability as a grant of streaming rights.

## Playback
ZEX BOX does not scrape protected catalogs, bypass DRM, defeat authentication/paywalls, or embed unlicensed streams. A playable title requires a verified authorized source. Otherwise show a clear unavailable state or a legitimate provider handoff. Metadata, trailer availability, and watch-provider listings do not themselves grant playback rights.

## Privacy
No ZEX BOX account is required. Watchlist entries are stored in the visitor's browser localStorage. No analytics or advertising scripts are included by default.
