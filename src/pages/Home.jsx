import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">THE SUMMER EDIT · 2026</p>
          <h1>
            Objects worth
            <br />
            living with.
          </h1>
          <p>
            Everyday essentials with uncommon character—selected for quality,
            utility, and a lighter footprint.
          </p>
          <Link className="button" to="/products">
            Explore the collection <span>→</span>
          </Link>
        </div>
        <div className="hero-art" aria-label="Curated lifestyle collection">
          <div className="sun" />
          <div className="arch" />
          <p>
            01—36
            <br />
            CURATED GOODS
          </p>
        </div>
      </section>
      <section className="value-strip">
        <p>
          <b>01</b> Independent makers
        </p>
        <p>
          <b>02</b> Carbon-neutral delivery
        </p>
        <p>
          <b>03</b> 30-day returns
        </p>
      </section>
      <section className="intro-grid">
        <p className="eyebrow">OUR POINT OF VIEW</p>
        <div>
          <h2>
            Buy less.
            <br />
            Choose better.
          </h2>
          <p>
            We look for enduring design and honest materials, so every object
            earns its place in your home.
          </p>
        </div>
      </section>
    </>
  );
}
