const shelves = [
  { title: "Trending now", eyebrow: "POPULAR THIS WEEK", items: ["The Last Horizon", "Midnight Signal", "Parallel", "Northbound"] },
  { title: "Stories worth finding", eyebrow: "EDITOR'S PICKS", items: ["Blue Static", "After the Rain", "Paper Moons", "The Quiet City"] }
];

function Poster({ title, index }: { title: string; index: number }) {
  return (
    <article className={`poster poster-${index % 4}`} aria-label={title}>
      <div className="poster-art"><span>{title.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span></div>
      <div className="poster-meta">
        <h3>{title}</h3>
        <p>Discover title details</p>
      </div>
    </article>
  );
}

export default function HomePage() {
  return (
    <main>
      <header className="topbar">
        <a className="brand" href="/" aria-label="ZEX BOX home"><span className="brand-mark">Z</span><span>ZEX <b>BOX</b></span></a>
        <nav aria-label="Main navigation"><a className="active" href="#discover">Discover</a><a href="#movies">Movies</a><a href="#series">Series</a><a href="#anime">Anime</a></nav>
        <a className="watchlist" href="#watchlist">Your list <span>↗</span></a>
      </header>

      <section className="hero" id="discover">
        <div className="hero-copy">
          <p className="eyebrow"><span className="live-dot" /> YOUR NEXT STORY STARTS HERE</p>
          <h1>Find your<br /><em>next favorite.</em></h1>
          <p className="hero-description">A better place to discover movies, series, and animation. No noise. Just stories.</p>
          <a className="primary-link" href="#trending">Explore the collection <span>→</span></a>
        </div>
        <div className="hero-orbit" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit-core">Z<span>·</span></div><span className="orbit-label label-one">DISCOVER</span><span className="orbit-label label-two">YOUR NEXT WATCH</span></div>
        <div className="hero-foot"><span>01 / DISCOVER</span><span>MADE FOR THE CURIOUS</span></div>
      </section>

      <section className="search-band" aria-label="Search titles">
        <div><span className="search-icon">⌕</span><span>Search movies, series, genres...</span></div>
        <span className="search-hint">SEARCH COMING SOON</span>
      </section>

      <div className="content-wrap" id="trending">
        {shelves.map((shelf, shelfIndex) => (
          <section className="shelf" key={shelf.title} id={shelfIndex === 0 ? "movies" : "series"}>
            <div className="section-heading"><div><p className="eyebrow">{shelf.eyebrow}</p><h2>{shelf.title}</h2></div><span className="section-count">0{shelfIndex + 1} / 02</span></div>
            <div className="poster-grid">{shelf.items.map((title, index) => <Poster title={title} index={index + shelfIndex * 2} key={title} />)}</div>
          </section>
        ))}
        <section className="promise" id="watchlist"><div><p className="eyebrow">THE ZEX BOX PROMISE</p><h2>Entertainment,<br /><em>without the extras.</em></h2></div><div className="promise-points"><p><b>NO ADS</b><span>Nothing between you and discovery.</span></p><p><b>NO ACCOUNT</b><span>Open the site and start exploring.</span></p><p><b>NO FEES</b><span>Free-to-use, with no subscription tiers.</span></p></div></section>
      </div>
      <footer><a className="brand" href="/"><span className="brand-mark">Z</span><span>ZEX <b>BOX</b></span></a><p>Independent discovery. Thoughtfully built.</p><span>© {new Date().getFullYear()} ZEX BOX</span></footer>
    </main>
  );
}
