"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { CatalogItem, CatalogResponse } from "@/lib/catalog-types";

type ShelfKey = "top10" | "anime" | "indian" | "asian" | "upcoming" | "hollywood";
type ShelfConfig = { key: ShelfKey; title: string; eyebrow: string; description: string; id: string };
const shelves: ShelfConfig[] = [
  { key: "top10", title: "Top 10 today", eyebrow: "THE DAILY CHART", description: "What is moving across movies and series right now.", id: "top10" },
  { key: "anime", title: "Anime universe", eyebrow: "ANIMATION FROM JAPAN", description: "Series and stories from the world of Japanese animation.", id: "anime" },
  { key: "indian", title: "Indian cinema", eyebrow: "FROM THE SUBCONTINENT", description: "Popular films from across India's film industries.", id: "indian-cinema" },
  { key: "asian", title: "Asian drama", eyebrow: "SERIES SPOTLIGHT", description: "Explore drama from Korea, Japan, China and Thailand.", id: "asian-drama" },
  { key: "hollywood", title: "Hollywood picks", eyebrow: "THE BIG SCREEN", description: "Popular films from the United States.", id: "hollywood" },
  { key: "upcoming", title: "Coming soon", eyebrow: "UP NEXT", description: "Upcoming releases listed in the catalog.", id: "coming-soon" }
];

function ShelfCard({ item, rank }: { item: CatalogItem; rank?: number }) {
  return (
    <Link className="shelf-card" href={`/title/${item.mediaType}/${item.id}`}>
      <div className="shelf-poster">
        {item.posterUrl ? <img src={item.posterUrl} alt={`${item.title} poster`} loading="lazy" /> : <span className="shelf-placeholder">Z</span>}
        {typeof rank === "number" && <span className="shelf-rank">{String(rank).padStart(2, "0")}</span>}
        <span className="shelf-type">{item.mediaType === "movie" ? "FILM" : "SERIES"}</span>
      </div>
      <div className="shelf-meta">
        <strong>{item.title}</strong>
        <span>{item.year ?? "Release date TBA"}{item.rating !== null ? ` · ★ ${item.rating.toFixed(1)}` : ""}</span>
      </div>
    </Link>
  );
}

export default function DiscoveryShelves() {
  const [data, setData] = useState<Partial<Record<ShelfKey, CatalogItem[]>>>({});
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      const entries = await Promise.all(shelves.map(async (shelf) => {
        try {
          const response = await fetch(`/api/catalog?mode=collection&collection=${shelf.key}&page=1`, { signal: controller.signal });
          const payload = await response.json() as CatalogResponse;
          if (!response.ok) throw new Error(payload.message ?? "Collection unavailable");
          return [shelf.key, payload.results] as const;
        } catch (error) {
          if (error instanceof Error && error.name === "AbortError") throw error;
          return [shelf.key, []] as const;
        }
      }));
      if (!controller.signal.aborted) {
        const next = Object.fromEntries(entries) as Record<ShelfKey, CatalogItem[]>;
        setData(next);
        setFailed(entries.every(([, items]) => items.length === 0));
        setLoading(false);
      }
    }
    void load().catch(() => {
      if (!controller.signal.aborted) { setFailed(true); setLoading(false); }
    });
    return () => controller.abort();
  }, []);

  if (failed && !loading) return null;

  return (
    <section className="discovery-shelves" aria-label="Curated discovery">
      <div className="shelves-intro">
        <div><p className="eyebrow">A WORLD OF STORIES</p><h2>Pick your <em>next obsession.</em></h2></div>
        <p>Daily charts, anime, Indian cinema and stories from across Asia — all in one place.</p>
      </div>
      {shelves.map((shelf, index) => {
        const items = data[shelf.key] ?? [];
        if (!loading && items.length === 0) return null;
        return (
          <section className="discovery-shelf" id={shelf.id} key={shelf.key}>
            <div className="shelf-heading">
              <div><p className="eyebrow">{shelf.eyebrow}</p><h3>{shelf.title}</h3><p className="shelf-description">{shelf.description}</p></div>
              <span className="section-count">{loading ? "LOADING" : `${items.length} TITLES`}</span>
            </div>
            <div className="shelf-track">
              {loading ? Array.from({ length: 6 }, (_, i) => <div className="shelf-skeleton" key={i} />) : items.slice(0, shelf.key === "top10" ? 10 : 14).map((item, i) => <ShelfCard key={`${item.mediaType}:${item.id}`} item={item} rank={shelf.key === "top10" ? i + 1 : undefined} />)}
            </div>
          </section>
        );
      })}
    </section>
  );
}
