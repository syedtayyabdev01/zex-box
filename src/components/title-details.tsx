"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CatalogDetail, CatalogItem, SeasonResponse } from "@/lib/catalog-types";

const WATCHLIST_KEY = "zex-box-watchlist-v1";

type Props = { mediaType: "movie" | "tv"; id: string };

function readWatchlist(): CatalogItem[] {
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(WATCHLIST_KEY) ?? "[]");
    return Array.isArray(value) ? value as CatalogItem[] : [];
  } catch {
    return [];
  }
}

function formatRuntime(minutes: number | null) {
  if (!minutes) return null;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return hours ? `${hours}h ${remainder}m` : `${remainder}m`;
}

export default function TitleDetails({ mediaType, id }: Props) {
  const [detail, setDetail] = useState<CatalogDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [watchlist, setWatchlist] = useState<CatalogItem[]>([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [season, setSeason] = useState<SeasonResponse | null>(null);
  const [seasonLoading, setSeasonLoading] = useState(false);
  const [seasonError, setSeasonError] = useState<string | null>(null);

  useEffect(() => setWatchlist(readWatchlist()), []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    fetch(`/api/catalog/${mediaType}/${id}?region=PK`, { signal: controller.signal })
      .then(async (response) => {
        const data = await response.json() as CatalogDetail & { message?: string };
        if (!response.ok) throw new Error(data.message ?? "Title details could not be loaded.");
        setDetail(data);
        if (data.seasons.length) setSelectedSeason(data.seasons[0].seasonNumber);
      })
      .catch((cause: unknown) => {
        if (cause instanceof Error && cause.name === "AbortError") return;
        setError(cause instanceof Error ? cause.message : "Something went wrong.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [mediaType, id]);

  useEffect(() => {
    if (mediaType !== "tv" || selectedSeason < 0) return;
    const controller = new AbortController();
    setSeasonLoading(true);
    setSeasonError(null);
    fetch(`/api/catalog/tv/${id}/season/${selectedSeason}`, { signal: controller.signal })
      .then(async (response) => {
        const data = await response.json() as SeasonResponse & { message?: string };
        if (!response.ok) throw new Error(data.message ?? "Episodes could not be loaded.");
        setSeason(data);
      })
      .catch((cause: unknown) => {
        if (cause instanceof Error && cause.name === "AbortError") return;
        setSeasonError(cause instanceof Error ? cause.message : "Episodes are unavailable.");
        setSeason(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) setSeasonLoading(false);
      });
    return () => controller.abort();
  }, [mediaType, id, selectedSeason]);

  const saved = useMemo(
    () => watchlist.some((item) => item.id === Number(id) && item.mediaType === mediaType),
    [watchlist, id, mediaType]
  );

  function toggleWatchlist() {
    if (!detail) return;
    const item: CatalogItem = {
      id: detail.id,
      mediaType: detail.mediaType,
      title: detail.title,
      overview: detail.overview,
      posterUrl: detail.posterUrl,
      backdropUrl: detail.backdropUrl,
      year: detail.year,
      rating: detail.rating
    };
    setWatchlist((current) => {
      const next = current.some((entry) => entry.id === item.id && entry.mediaType === item.mediaType)
        ? current.filter((entry) => !(entry.id === item.id && entry.mediaType === item.mediaType))
        : [item, ...current];
      try { window.localStorage.setItem(WATCHLIST_KEY, JSON.stringify(next)); } catch { /* Local storage may be unavailable in private browsing. */ }
      return next;
    });
  }

  if (loading) {
    return <main className="detail-shell"><Link className="back-link" href="/">← Back to discover</Link><div className="detail-state"><span className="loader" />Loading title details...</div></main>;
  }

  if (error || !detail) {
    return <main className="detail-shell"><Link className="back-link" href="/">← Back to discover</Link><div className="detail-state"><strong>We couldn't load this title.</strong><p>{error ?? "The title may be unavailable."}</p><Link className="detail-action secondary-action" href="/">Return to ZEX BOX</Link></div></main>;
  }

  const runtime = formatRuntime(detail.runtime);

  return (
    <main className="detail-page">
      <div className="detail-backdrop" style={detail.backdropUrl ? { backgroundImage: `linear-gradient(90deg, #090b0d 8%, #090b0ddd 48%, #090b0d88), linear-gradient(0deg, #090b0d, transparent 70%), url("${detail.backdropUrl}")` } : undefined} />
      <div className="detail-shell">
        <Link className="back-link" href="/">← Back to discover</Link>
        <section className="detail-hero">
          <div className="detail-poster">
            {detail.posterUrl ? <img src={detail.posterUrl} alt={`${detail.title} poster`} /> : <div className="poster-placeholder"><span>Z</span><small>NO ARTWORK</small></div>}
          </div>
          <div className="detail-copy">
            <p className="eyebrow">{detail.mediaType === "movie" ? "FEATURE FILM" : "TELEVISION SERIES"} · ZEX BOX</p>
            <h1>{detail.title}</h1>
            {detail.tagline && <p className="detail-tagline">{detail.tagline}</p>}
            <div className="detail-facts">
              {detail.year && <span>{detail.year}</span>}
              {runtime && <span>{runtime}</span>}
              {detail.status && <span>{detail.status}</span>}
              {detail.rating !== null && <span className="rating">★ {detail.rating.toFixed(1)} / 10</span>}
            </div>
            <div className="genre-list">{detail.genres.map((genre) => <span key={genre}>{genre}</span>)}</div>
            <p className="detail-overview">{detail.overview || "No synopsis is available for this title yet."}</p>
            <div className="detail-actions">
              <button className="detail-action primary-action" onClick={toggleWatchlist}>{saved ? "✓ In your list" : "+ Add to my list"}</button>
              {detail.trailerUrl && <a className="detail-action secondary-action" href={detail.trailerUrl} target="_blank" rel="noreferrer">Watch trailer ↗</a>}
            </div>
          </div>
        </section>

        {mediaType === "tv" && detail.seasons.length > 0 && (
          <section className="detail-section">
            <div className="detail-section-heading"><div><p className="eyebrow">EPISODE GUIDE</p><h2>Seasons & episodes</h2></div>
              <label className="season-picker">Season <select value={selectedSeason} onChange={(event) => setSelectedSeason(Number(event.target.value))}>{detail.seasons.map((entry) => <option key={entry.id} value={entry.seasonNumber}>{entry.name}</option>)}</select></label>
            </div>
            {seasonLoading ? <div className="detail-state compact-state"><span className="loader" />Loading episodes...</div> : seasonError ? <div className="detail-state compact-state">{seasonError}</div> : (
              <div className="episode-list">{season?.episodes.map((episode) => (
                <article className="episode-row" key={episode.id}>
                  <div className="episode-still">{episode.stillUrl ? <img src={episode.stillUrl} alt="" loading="lazy" /> : <span>{String(episode.episodeNumber).padStart(2, "0")}</span>}</div>
                  <div className="episode-copy"><p className="episode-number">EPISODE {String(episode.episodeNumber).padStart(2, "0")}{episode.airDate ? ` · ${episode.airDate}` : ""}</p><h3>{episode.name}</h3><p>{episode.overview || "Episode synopsis not available."}</p></div>
                  {episode.runtime && <span className="episode-runtime">{episode.runtime} MIN</span>}
                </article>
              ))}</div>
            )}
          </section>
        )}

        <section className="detail-section">
          <div className="detail-section-heading"><div><p className="eyebrow">AUTHORIZED VIEWING</p><h2>Where to watch</h2></div><span className="region-label">REGION: {detail.providerRegion}</span></div>
          {detail.providers.length ? (
            <>
              <div className="provider-list">{detail.providers.map((provider) => <div className="provider-card" key={provider.id}>{provider.logoUrl ? <img src={provider.logoUrl} alt="" loading="lazy" /> : <span className="provider-fallback">{provider.name.slice(0, 1)}</span>}<div><strong>{provider.name}</strong><small>{provider.type === "stream" ? "Subscription streaming" : provider.type === "free" ? "Free" : provider.type === "with-ads" ? "Free with ads" : provider.type === "rent" ? "Rent" : "Buy"}</small></div></div>)}</div>
              {detail.providerLink && <a className="provider-link" href={detail.providerLink} target="_blank" rel="noreferrer">See availability and open provider links ↗</a>}
              <p className="provider-note">Availability is supplied by JustWatch through TMDB. Provider links open the service or its availability page; ZEX BOX does not host or embed video streams.</p>
            </>
          ) : <div className="detail-state compact-state">No authorized streaming provider is listed for this title in {detail.providerRegion}. Availability can vary by country.</div>}
        </section>

        {detail.cast.length > 0 && <section className="detail-section"><div className="detail-section-heading"><div><p className="eyebrow">ON SCREEN</p><h2>Top cast</h2></div></div><div className="cast-grid">{detail.cast.map((person) => <article className="cast-card" key={person.id}>{person.profileUrl ? <img src={person.profileUrl} alt="" loading="lazy" /> : <div className="cast-placeholder">{person.name.slice(0, 1)}</div>}<strong>{person.name}</strong><span>{person.character}</span></article>)}</div></section>}

        <footer className="detail-footer"><Link className="brand" href="/"><span className="brand-mark">Z</span><span>ZEX <b>BOX</b></span></Link><p>Independent discovery. Thoughtfully built.</p><Link href="/">Back to discovery ↑</Link></footer>
      </div>
    </main>
  );
}
