import CatalogExplorer from "@/components/catalog-explorer";

export default function HomePage() {
  return (
    <main>
      <header className="topbar">
        <a className="brand" href="/" aria-label="ZEX BOX home"><span className="brand-mark">Z</span><span>ZEX <b>BOX</b></span></a>
        <nav aria-label="Main navigation"><a className="active" href="#catalog">Discover</a><a href="#catalog">Movies</a><a href="#catalog">Series</a><a href="#watchlist">My list</a></nav>
        <a className="watchlist-link" href="#watchlist">Your list <span>↗</span></a>
      </header>

      <section className="hero" id="discover">
        <div className="hero-copy">
          <p className="eyebrow"><span className="live-dot" /> YOUR NEXT STORY STARTS HERE</p>
          <h1>Find your<br /><em>next favorite.</em></h1>
          <p className="hero-description">A calmer place to discover movies and series. No noise, no account, no subscription. Just stories worth finding.</p>
          <a className="primary-link" href="#catalog">Explore the collection <span>→</span></a>
        </div>
        <div className="hero-orbit" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit-core">Z</div><span className="orbit-label label-one">DISCOVER</span><span className="orbit-label label-two">YOUR NEXT WATCH</span></div>
        <div className="hero-foot"><span>01 / DISCOVER</span><span>MADE FOR THE CURIOUS</span></div>
      </section>

      <div className="content-wrap">
        <CatalogExplorer />
        <section className="promise"><div><p className="eyebrow">THE ZEX BOX PROMISE</p><h2>Entertainment,<br /><em>without the extras.</em></h2></div><div className="promise-points"><p><b>NO ADS</b><span>Nothing between you and discovery.</span></p><p><b>NO ACCOUNT</b><span>Open the site and start exploring.</span></p><p><b>NO FEES</b><span>Free-to-use, with no subscription tiers.</span></p><p><b>YOUR LIST, YOUR DEVICE</b><span>Saved locally. No profile required.</span></p></div></section>
      </div>
      <footer>
        <a className="brand" href="/"><span className="brand-mark">Z</span><span>ZEX <b>BOX</b></span></a>
        <p>Independent discovery. Thoughtfully built.</p>
        <span>© {new Date().getFullYear()} ZEX BOX</span>
        <div className="tmdb-credit"><a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">The Movie Database (TMDB)</a><span>This product uses the TMDB API but is not endorsed or certified by TMDB.</span></div>
      </footer>
    </main>
  );
}
