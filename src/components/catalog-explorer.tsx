"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { CatalogItem, CatalogResponse, MediaKind } from "@/lib/catalog-types";

const WATCHLIST_KEY = "zex-box-watchlist-v1";

function itemKey(item: CatalogItem) {
  return `${item.mediaType}:${item.id}`;
}

function readWatchlist(): CatalogItem[] {
  try {
    const raw = window.localStorage.getItem(WATCHLIST_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as CatalogItem[] : [];
  } catch {
    return [];
  }
}

function PosterCard({ item, saved, onToggle }: {
  item: CatalogItem;
  saved: boolean;
  onToggle: (item: CatalogItem) => void;
}) {
  return (
    <article className="catalog-card">
      <div className="catalog-poster">
        {item.posterUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.posterUrl} alt={`${item.title} poster`} loading="lazy" />
        ) : <div className="poster-placeholder"><span>Z</span><small>NO ARTWORK</small></div>}
        <button className={`save-button${saved ? " is-saved" : ""}`} onClick={() => onToggle(item)} aria-label={saved ? `Remove ${item.title} from your list` : `Add ${item.title} to your list`} title={saved ? "Remove from your list" : "Add to your list"}>{saved ? "✓" : "+"}</button>
        <span className="media-chip">{item.mediaType === "movie" ? "FILM" : "SERIES"}</span>
      </div>
      <div className="catalog-card-meta">
        <h3>{item.title}</h3>
        <div><span>{item.year ?? "Year unknown"}</span>{item.rating !== null && <span className="rating">★ {item.rating.toFixed(1)}</span>}</div>
      </div>
    </article>
  );
}

export default function CatalogExplorer() {
  const [kind, setKind] = useState<MediaKind>("all");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [watchlist, setWatchlist] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [providerMissing, setProviderMissing] = useState(false);

  useEffect(() => setWatchlist(readWatchlist()), []);

  const loadCatalog = useCallback(async (searchText: string, selectedKind: MediaKind) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        mode: searchText ? "search" : "trending",
        kind: selectedKind,
        ...(searchText ? { query: searchText } : {})
      });
      const response = await fetch(`/api/catalog?${params.toString()}`);
      const data = await response.json() as CatalogResponse;
      if (data.error === "provider_not_configured") {
        setProviderMissing(true);
        setItems([]);
        setError(data.message ?? "Catalog provider setup is required.");
        return;
      }
      setProviderMissing(false);
      if (!response.ok) throw new Error(data.message ?? "Catalog request failed.");
      setItems(data.results);
      if (data.error) setError(data.message ?? "The catalog is temporarily unavailable.");
    } catch (requestError) {
      setItems([]);
      setError(requestError instanceof Error ? requestError.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const normalized = query.trim();
    if (normalized.length === 1) return;
    const timer = window.setTimeout(() => void loadCatalog(normalized, kind), normalized ? 350 : 0);
    return () => window.clearTimeout(timer);
  }, [query, kind, loadCatalog]);

  const savedKeys = useMemo(() => new Set(watchlist.map(itemKey)), [watchlist]);

  function toggleWatchlist(item: CatalogItem) {
    setWatchlist((current) => {
      const next = current.some((saved) => itemKey(saved) === itemKey(item))
        ? current.filter((saved) => itemKey(saved) !== itemKey(item))
        : [item, ...current];
      try { window.localStorage.setItem(WATCHLIST_KEY, JSON.stringify(next)); } catch { /* Private browsing may block storage. */ }
      return next;
    });
  }

  return (
    <>
      <section className="catalog-toolbar" id="catalog">
        <div className="catalog-search">
          <span aria-hidden="true">⌕</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search movies, series, and more..." aria-label="Search movies and series" />
          {query && <button onClick={() => setQuery("")} aria-label="Clear search">×</button>}
        </div>
        <div className="filter-tabs" aria-label="Filter catalog">
          {(["all", "movie", "tv"] as const).map((value) => (
            <button key={value} className={kind === value ? "selected" : ""} onClick={() => setKind(value)}>{value === "all" ? "Everything" : value === "movie" ? "Movies" : "Series"}</button>
          ))}
        </div>
      </section>

      <section className="catalog-section">
        <div className="catalog-heading">
          <div><p className="eyebrow">{query ? "SEARCH RESULTS" : "FRESH DISCOVERIES"}</p><h2>{query ? `Results for “${query}”` : "Trending this week"}</h2></div>
          <span className="section-count">{items.length ? `${items.length} TITLES` : "LIVE CATALOG"}</span>
        </div>
        {loading ? <div className="catalog-state"><span className="loader" />Finding something good...</div> : error ? (
          <div className="catalog-state error-state"><strong>{providerMissing ? "One quick setup step." : "Catalog taking a breather."}</strong><p>{error}</p>{providerMissing && <p className="setup-note">Create a free developer API key on TMDB, then add <code>TMDB_API_READ_ACCESS_TOKEN</code> to your local <code>.env.local</code> file and Vercel environment settings. Keep the token private.</p>}</div>
        ) : items.length ? (
          <div className="catalog-grid">{items.map((item) => <PosterCard key={itemKey(item)} item={item} saved={savedKeys.has(itemKey(item))} onToggle={toggleWatchlist} />)}</div>
        ) : <div className="catalog-state">No titles found. Try another search.</div>}
      </section>

      <section className="watchlist-section" id="watchlist">
        <div className="catalog-heading"><div><p className="eyebrow">SAVED ON THIS DEVICE</p><h2>Your watchlist</h2></div><span className="section-count">{watchlist.length} SAVED</span></div>
        {watchlist.length ? <div className="catalog-grid">{watchlist.map((item) => <PosterCard key={itemKey(item)} item={item} saved onToggle={toggleWatchlist} />)}</div> : <p className="watchlist-empty">Keep the titles you want to come back to. Your list stays in this browser — no account needed.</p>}
      </section>
    </>
  );
}
