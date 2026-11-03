import type { CatalogItem, MediaKind } from "./catalog-types";

const API_BASE = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p";

type TmdbItem = {
  id: number;
  media_type?: string;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
};

export type TmdbResponse = {
  page?: number;
  total_pages?: number;
  results?: TmdbItem[];
  [key: string]: unknown;
};

export class TmdbError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = "TmdbError";
  }
}

function getToken() {
  const token = process.env.TMDB_API_READ_ACCESS_TOKEN;
  if (!token) return null;
  return token.trim();
}

export function isTmdbConfigured() {
  return Boolean(getToken());
}

export function tmdbImage(path: string | null | undefined, size = "w500") {
  return path ? `${IMAGE_BASE}/${size}${path}` : null;
}

function normalize(item: TmdbItem, fallbackKind: Exclude<MediaKind, "all"> | null): CatalogItem | null {
  const mediaType = item.media_type === "tv" || item.media_type === "movie"
    ? item.media_type
    : fallbackKind;
  if (!mediaType || !Number.isFinite(item.id)) return null;

  const date = mediaType === "movie" ? item.release_date : item.first_air_date;
  const title = (mediaType === "movie" ? item.title : item.name)?.trim();
  if (!title) return null;

  return {
    id: item.id,
    mediaType,
    title,
    overview: item.overview?.trim() ?? "",
    posterUrl: tmdbImage(item.poster_path, "w500"),
    backdropUrl: tmdbImage(item.backdrop_path, "w1280"),
    year: date?.slice(0, 4) || null,
    rating: typeof item.vote_average === "number" ? item.vote_average : null
  };
}

export async function tmdbRequest<T = TmdbResponse>(path: string, params: Record<string, string> = {}): Promise<T> {
  const token = getToken();
  if (!token) throw new TmdbError(503, "The catalog provider is not configured yet.");

  const url = new URL(`${API_BASE}${path}`);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, accept: "application/json" },
    next: { revalidate: 1800 }
  });

  if (!response.ok) {
    if (response.status === 429) throw new TmdbError(429, "The catalog provider rate limit was reached. Please try again shortly.");
    throw new TmdbError(response.status, "The catalog provider could not complete this request.");
  }
  return await response.json() as T;
}

export function normalizeResults(payload: TmdbResponse, fallbackKind: Exclude<MediaKind, "all"> | null) {
  return (payload.results ?? [])
    .map((item) => normalize(item, fallbackKind))
    .filter((item): item is CatalogItem => item !== null);
}
