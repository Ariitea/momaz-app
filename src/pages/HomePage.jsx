import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LOADER_HOLD_MS = 1250;
const LOADER_EXIT_MS = 360;
const EXIT_DURATION_MS = 520;

function supportsReducedMotion() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function HomePage() {
  const navigate = useNavigate();
  const [loaderPhase, setLoaderPhase] = useState(() => (supportsReducedMotion() ? "hidden" : "visible"));
  const [isEnteringCatalog, setIsEnteringCatalog] = useState(false);

  useEffect(() => {
    if (loaderPhase !== "visible") return undefined;

    const exitTimer = window.setTimeout(() => {
      setLoaderPhase("leaving");
    }, LOADER_HOLD_MS);

    const hideTimer = window.setTimeout(() => {
      setLoaderPhase("hidden");
    }, LOADER_HOLD_MS + LOADER_EXIT_MS);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(hideTimer);
    };
  }, [loaderPhase]);

  function enterCatalog() {
    if (isEnteringCatalog) return;
    setIsEnteringCatalog(true);

    window.setTimeout(() => {
      navigate("/catalog", { state: { entryTransition: "crossfade" } });
    }, EXIT_DURATION_MS);
  }

  return (
    <main className={`entry-home ${isEnteringCatalog ? "is-leaving" : ""}`}>
      {loaderPhase !== "hidden" ? (
        <div className={`entry-loader ${loaderPhase === "leaving" ? "is-leaving" : ""}`} aria-hidden="true">
          <span>MOMAZ™</span>
        </div>
      ) : null}

      <div className="entry-home__grain" aria-hidden="true" />
      <div className="entry-home__orb entry-home__orb--left" aria-hidden="true" />
      <div className="entry-home__orb entry-home__orb--right" aria-hidden="true" />

      <section className="entry-home__hero">
        <p className="entry-home__eyebrow">Paris Curated Archive</p>
        <h1>MOMAZ™</h1>
        <p>Rare pieces. Quiet confidence. A controlled entry into the catalog.</p>
        <button type="button" onClick={enterCatalog}>
          <span>Enter</span>
          <em aria-hidden="true">→</em>
        </button>
      </section>
    </main>
  );
}
