import { NextResponse } from "next/server";
import { isTmdbConfigured, tmdbImage, tmdbRequest, TmdbError } from "@/lib/tmdb";
import type { SeasonResponse } from "@/lib/catalog-types";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string; season: string }> };
type RawSeason = {
  season_number: number;
  name?: string;
  episodes?: Array<{
    id: number;
    episode_number: number;
    name?: string;
    overview?: string;
    still_path?: string | null;
    air_date?: string;
    runtime?: number | null;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  if (!isTmdbConfigured()) {
    return NextResponse.json({ error: "provider_not_configured", message: "The catalog provider is not configured." }, { status: 503 });
  }

  const { id, season } = await context.params;
  if (!/^\d{1,12}$/.test(id) || !/^\d{1,3}$/.test(season)) {
    return NextResponse.json({ error: "invalid_request", message: "A valid series and season are required." }, { status: 400 });
  }

  try {
    const data = await tmdbRequest<RawSeason>(`/tv/${id}/season/${season}`, { language: "en-US" });
    const result: SeasonResponse = {
      seasonNumber: data.season_number,
      name: data.name ?? `Season ${data.season_number}`,
      episodes: (data.episodes ?? []).map((episode) => ({
        id: episode.id,
        episodeNumber: episode.episode_number,
        name: episode.name ?? `Episode ${episode.episode_number}`,
        overview: episode.overview ?? "",
        stillUrl: tmdbImage(episode.still_path, "w500"),
        airDate: episode.air_date ?? null,
        runtime: episode.runtime ?? null
      }))
    };
    return NextResponse.json(result, {
      headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" }
    });
  } catch (error) {
    const status = error instanceof TmdbError ? error.status : 502;
    return NextResponse.json({
      error: status === 429 ? "rate_limited" : "provider_error",
      message: error instanceof Error ? error.message : "Season information is temporarily unavailable."
    }, { status: status >= 400 && status < 600 ? status : 502 });
  }
}
