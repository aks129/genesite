export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-name">
      <div className="hero-text">
        <div className="dateline">
          Pittsburgh, Pennsylvania <span className="sep">·</span> April 2026
        </div>
        <h1 id="hero-name">Eugene Vestel</h1>
        <p className="lede">
          VP of AI building data and AI systems — agentic tools and the
          governance around them, in healthcare and beyond — and writing about
          what's coming next.
        </p>
        <p className="hero-callout">
          <span className="tag">Upcoming</span>
          Speaking at{" "}
          <a href="https://devdays.com" target="_blank" rel="noopener noreferrer">FHIR DevDays</a>
          {" "}<span className="sep">·</span> June 2026
        </p>
      </div>
    </section>
  );
}
