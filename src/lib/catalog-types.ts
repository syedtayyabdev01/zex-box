export type MediaKind = "movie" | "tv" | "all";

export interface CatalogItem {
  id: number;
  mediaType: "movie" | "tv";
  title: string;
  overview: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  year: string | null;
  rating: number | null;
}

export interface CatalogResponse {
  results: CatalogItem[];
  page: number;
  totalPages: number;
  provider: "tmdb";
  error?: "provider_not_configured" | "provider_error" | "rate_limited";
  message?: string;
}
