import { Link } from "react-router-dom";

export default function Home() {
  const moveHero = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    event.currentTarget.style.setProperty("--sun-x", `${x * -18}px`);
    event.currentTarget.style.setProperty("--sun-y", `${y * -14}px`);
    event.currentTarget.style.setProperty("--arch-x", `${x * 12}px`);
    event.currentTarget.style.setProperty("--arch-y", `${y * 10}px`);
  };

  const resetHero = (event) => {
    event.currentTarget.style.setProperty("--sun-x", "0px");
    event.currentTarget.style.setProperty("--sun-y", "0px");
    event.currentTarget.style.setProperty("--arch-x", "0px");
    event.currentTarget.style.setProperty("--arch-y", "0px");
  };

  return (
    <>
      <section
        className="hero isolate"
        onPointerMove={moveHero}
        onPointerLeave={resetHero}
      >
        <div className="hero-copy">
          <p className="eyebrow text-northstar-orange">THE SUMMER EDIT · 2026</p>
          <h1>
            Objects worth
            <br />
            living with.
          </h1>
          <p>
            Everyday essentials with uncommon character—selected for quality,
            utility, and a lighter footprint.
          </p>
          <Link className="button transition-colors duration-200" to="/products">
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
