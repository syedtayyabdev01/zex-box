import { NextRequest, NextResponse } from "next/server";
import type { MediaKind } from "@/lib/catalog-types";
import { isTmdbConfigured, normalizeResults, tmdbRequest, TmdbError } from "@/lib/tmdb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const validKinds: MediaKind[] = ["movie", "tv", "all"];
const collections = ["top10", "anime", "indian", "asian", "upcoming", "hollywood"] as const;
type Collection = (typeof collections)[number];

function collectionRequest(collection: Collection) {
  const common = { language: "en-US", include_adult: "false" };
  switch (collection) {
    case "top10":
      return { path: "/trending/all/day", kind: null, params: common };
    case "anime":
      return { path: "/discover/tv", kind: "tv" as const, params: { ...common, with_genres: "16", with_original_language: "ja", sort_by: "popularity.desc" } };
    case "indian":
      return { path: "/discover/movie", kind: "movie" as const, params: { ...common, with_origin_country: "IN", sort_by: "popularity.desc" } };
    case "asian":
      return { path: "/discover/tv", kind: "tv" as const, params: { ...common, with_origin_country: "KR|JP|CN|TH", sort_by: "popularity.desc" } };
    case "upcoming":
      return { path: "/movie/upcoming", kind: "movie" as const, params: common };
    case "hollywood":
      return { path: "/discover/movie", kind: "movie" as const, params: { ...common, with_origin_country: "US", sort_by: "popularity.desc" } };
  }
}

export async function GET(request: NextRequest) {
  if (!isTmdbConfigured()) {
    return NextResponse.json({
      results: [], page: 1, totalPages: 0, provider: "tmdb",
      error: "provider_not_configured",
      message: "The catalog is ready to connect. Add the TMDB API read access token to the server environment."
    }, { status: 503 });
  }

  const params = request.nextUrl.searchParams;
  const mode = params.get("mode") === "search" ? "search" : params.get("mode") === "collection" ? "collection" : "trending";
  const kindValue = params.get("kind") ?? "all";
  const kind: MediaKind = validKinds.includes(kindValue as MediaKind) ? kindValue as MediaKind : "all";
  const query = (params.get("query") ?? "").trim().slice(0, 100);
  const page = Math.min(500, Math.max(1, Number.parseInt(params.get("page") ?? "1", 10) || 1));

  if (mode === "search" && query.length < 2) {
    return NextResponse.json({ results: [], page: 1, totalPages: 0, provider: "tmdb" });
  }

  try {
    let path: string;
    let fallbackKind: "movie" | "tv" | null = null;
    let requestParams: Record<string, string> = { language: "en-US", page: String(page), include_adult: "false" };

    if (mode === "collection") {
      const collection = params.get("collection") as Collection | null;
      if (!collection || !collections.includes(collection)) {
        return NextResponse.json({ results: [], page: 1, totalPages: 0, provider: "tmdb", error: "provider_error", message: "Unknown discovery collection." }, { status: 400 });
      }
      const selected = collectionRequest(collection);
      path = selected.path;
      fallbackKind = selected.kind;
      requestParams = { ...selected.params, page: String(page) };
    } else if (mode === "search") {
      path = kind === "all" ? "/search/multi" : `/search/${kind}`;
      if (kind !== "all") fallbackKind = kind;
      requestParams = { ...requestParams, query };
    } else {
      path = `/trending/${kind}/week`;
      if (kind !== "all") fallbackKind = kind;
    }

    const payload = await tmdbRequest(path, requestParams);
    const results = normalizeResults(payload, fallbackKind);
    return NextResponse.json({
      results,
      page: payload.page ?? page,
      totalPages: payload.total_pages ?? 0,
      provider: "tmdb"
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const status = error instanceof TmdbError ? error.status : 502;
    const code = status === 429 ? "rate_limited" : "provider_error";
    const message = error instanceof Error ? error.message : "The catalog provider is temporarily unavailable.";
    return NextResponse.json({
      results: [], page, totalPages: 0, provider: "tmdb", error: code, message
    }, { status: status >= 400 && status < 600 ? status : 502 });
  }
}
