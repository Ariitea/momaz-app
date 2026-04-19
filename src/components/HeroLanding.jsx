import { HERO_HOMEPAGE_IMAGE } from "../config/premiumAssets";

function HeroLanding() {
  const scrollToCatalog = () => {
    const section = document.getElementById("catalog-section");
    if (!section) {
      return;
    }

    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="hero-landing" aria-label="MOMAZ editorial intro">
      <div className="hero-landing__media" aria-hidden="true">
        <img src={HERO_HOMEPAGE_IMAGE} alt="" loading="eager" decoding="async" />
      </div>
      <div className="hero-landing__content">
        <p className="hero-landing__label">MOMAZ Editorial Selection</p>
        <h1>Curated Pieces for Modern Living</h1>
        <p className="hero-landing__subtitle">
          A curated rhythm of watchmaking, fashion, and accessories shaped as a single visual narrative.
        </p>
        <p className="hero-landing__line">Immersive Curated Selection</p>
        <button type="button" className="hero-landing__scroll" onClick={scrollToCatalog}>
          Enter the edit
        </button>
      </div>
    </section>
  );
}

export default HeroLanding;
