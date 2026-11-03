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

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profileUrl: string | null;
}

export interface WatchProvider {
  id: number;
  name: string;
  logoUrl: string | null;
  type: "stream" | "rent" | "buy" | "free" | "with-ads";
}

export interface SeasonSummary {
  id: number;
  seasonNumber: number;
  name: string;
  episodeCount: number;
}

export interface EpisodeItem {
  id: number;
  episodeNumber: number;
  name: string;
  overview: string;
  stillUrl: string | null;
  airDate: string | null;
  runtime: number | null;
}

export interface SeasonResponse {
  seasonNumber: number;
  name: string;
  episodes: EpisodeItem[];
}

export interface CatalogDetail extends CatalogItem {
  tagline: string;
  genres: string[];
  runtime: number | null;
  status: string | null;
  cast: CastMember[];
  providers: WatchProvider[];
  providerLink: string | null;
  providerRegion: string;
  trailerUrl: string | null;
  seasons: SeasonSummary[];
}
