import { NextRequest, NextResponse } from "next/server";
import type { CatalogDetail, WatchProvider } from "@/lib/catalog-types";
import { isTmdbConfigured, tmdbImage, tmdbRequest, TmdbError } from "@/lib/tmdb";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ mediaType: string; id: string }> };
type RawTitle = {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  tagline?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  genres?: Array<{ id: number; name: string }>;
  runtime?: number | null;
  episode_run_time?: number[];
  status?: string;
  seasons?: Array<{ id: number; season_number: number; name: string; episode_count: number }>;
};
type RawCredits = { cast?: Array<{ id: number; name: string; character?: string; profile_path?: string | null }> };
type RawVideos = { results?: Array<{ key: string; site: string; type: string; official?: boolean }> };
type RawProviders = { results?: Record<string, {
  link?: string;
  flatrate?: Array<{ provider_id: number; provider_name: string; logo_path: string }>;
  rent?: Array<{ provider_id: number; provider_name: string; logo_path: string }>;
  buy?: Array<{ provider_id: number; provider_name: string; logo_path: string }>;
  free?: Array<{ provider_id: number; provider_name: string; logo_path: string }>;
  ads?: Array<{ provider_id: number; provider_name: string; logo_path: string }>;
}> };

export async function GET(request: NextRequest, context: RouteContext) {
  if (!isTmdbConfigured()) {
    return NextResponse.json({ error: "provider_not_configured", message: "Add TMDB_API_READ_ACCESS_TOKEN to the server environment." }, { status: 503 });
  }

  const { mediaType, id } = await context.params;
  if ((mediaType !== "movie" && mediaType !== "tv") || !/^\d{1,12}$/.test(id)) {
    return NextResponse.json({ error: "invalid_request", message: "A valid movie or TV title ID is required." }, { status: 400 });
  }

  const regionInput = request.nextUrl.searchParams.get("region") ?? process.env.TMDB_WATCH_REGION ?? "PK";
  const region = /^[A-Z]{2}$/i.test(regionInput) ? regionInput.toUpperCase() : "PK";

  try {
    const [title, credits, videos, watchData] = await Promise.all([
      tmdbRequest<RawTitle>(`/${mediaType}/${id}`, { language: "en-US" }),
      tmdbRequest<RawCredits>(`/${mediaType}/${id}/credits`, { language: "en-US" }),
      tmdbRequest<RawVideos>(`/${mediaType}/${id}/videos`, { language: "en-US" }),
      tmdbRequest<RawProviders>(`/${mediaType}/${id}/watch/providers`)
    ]);

    const regional = watchData.results?.[region];
    const providers: WatchProvider[] = [];
    const addProviders = (items: RawProviders["results"] extends Record<string, infer T> ? T[keyof T] : never, type: WatchProvider["type"]) => {
      if (!Array.isArray(items)) return;
      for (const item of items) {
        if (!item || typeof item !== "object" || !("provider_id" in item)) continue;
        const provider = item as { provider_id: number; provider_name: string; logo_path: string };
        if (!providers.some((existing) => existing.id === provider.provider_id)) {
          providers.push({
            id: provider.provider_id,
            name: provider.provider_name,
            logoUrl: tmdbImage(provider.logo_path, "w92"),
            type
          });
        }
      }
    };

    addProviders(regional?.flatrate, "stream");
    addProviders(regional?.free, "free");
    addProviders(regional?.ads, "with-ads");
    addProviders(regional?.rent, "rent");
    addProviders(regional?.buy, "buy");

    const date = mediaType === "movie" ? title.release_date : title.first_air_date;
    const normalized: CatalogDetail = {
      id: title.id,
      mediaType,
      title: (mediaType === "movie" ? title.title : title.name) ?? "Untitled",
      overview: title.overview ?? "",
      posterUrl: tmdbImage(title.poster_path, "w500"),
      backdropUrl: tmdbImage(title.backdrop_path, "w1280"),
      year: date?.slice(0, 4) || null,
      rating: typeof title.vote_average === "number" ? title.vote_average : null,
      tagline: title.tagline ?? "",
      genres: (title.genres ?? []).map((genre) => genre.name),
      runtime: mediaType === "movie" ? title.runtime ?? null : title.episode_run_time?.[0] ?? null,
      status: title.status ?? null,
      cast: (credits.cast ?? []).slice(0, 12).map((person) => ({
        id: person.id,
        name: person.name,
        character: person.character ?? "",
        profileUrl: tmdbImage(person.profile_path, "w185")
      })),
      providers,
      providerLink: regional?.link ?? null,
      providerRegion: region,
      trailerUrl: videos.results?.find((video) => video.site === "YouTube" && video.type === "Trailer" && video.official)?.key
        ? `https://www.youtube.com/watch?v=${videos.results.find((video) => video.site === "YouTube" && video.type === "Trailer" && video.official)!.key}`
        : null,
      seasons: (title.seasons ?? []).filter((season) => season.season_number > 0).map((season) => ({
        id: season.id,
        seasonNumber: season.season_number,
        name: season.name,
        episodeCount: season.episode_count
      }))
    };

    return NextResponse.json(normalized, {
      headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" }
    });
  } catch (error) {
    const status = error instanceof TmdbError ? error.status : 502;
    return NextResponse.json({
      error: status === 429 ? "rate_limited" : "provider_error",
      message: error instanceof Error ? error.message : "The title details are temporarily unavailable."
    }, { status: status >= 400 && status < 600 ? status : 502 });
  }
}
