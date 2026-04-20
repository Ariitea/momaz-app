import { useEffect, useMemo, useRef, useState } from "react";
import { useCatalogProducts } from "../data/catalogClient";

const APPLY_NOW_SEQUENCE = ["S01", "S02", "S04", "S07", "S08"];
const APPLY_NOW_ASSET_BY_KEY = {
  S01_fallback_v1: "/media/immersive-scenes/MOM-212/v1/S01_fallback_v1.svg",
  S01_primary_v1: "/media/immersive-scenes/MOM-212/v1/S01_primary_v1.svg",
  S02_primary_v2_lowglow_notext: "/media/immersive-scenes/MOM-212/v1/S02_primary_v1.svg",
  S02_fallback_v1: "/media/immersive-scenes/MOM-212/v1/S02_fallback_v1.svg",
  S04_primary_v2_badgesafe_notext: "/media/immersive-scenes/MOM-212/v1/S04_primary_v1.svg",
  S04_fallback_v1: "/media/immersive-scenes/MOM-212/v1/S04_fallback_v1.svg",
  S07_fallback_v1: "/media/immersive-scenes/MOM-212/v1/S07_fallback_v1.svg",
  S07_primary_v1: "/media/immersive-scenes/MOM-212/v1/S07_primary_v1.svg",
  S08_primary_v1: "/media/immersive-scenes/MOM-212/v1/S08_primary_v1.svg",
  S08_fallback_v1: "/media/immersive-scenes/MOM-212/v1/S08_fallback_v1.svg",
};
const APPLY_NOW_SCENES = [
  {
    id: "S01",
    title: "A singular frame, rebuilt with intent.",
    support: "We open with one focused composition and no competing actions.",
    primaryAssetKey: "S01_fallback_v1",
    fallbackAssetKey: "S01_primary_v1",
    ctaLabel: null,
    composition: "left",
  },
  {
    id: "S02",
    title: "Craft reveals itself in motion.",
    support: "Materials and finish progress scene by scene to sustain continuity.",
    primaryAssetKey: "S02_primary_v2_lowglow_notext",
    fallbackAssetKey: "S02_fallback_v1",
    ctaLabel: null,
    composition: "right",
  },
  {
    id: "S04",
    title: "Value is shown through restraint.",
    support: "Presence and precision lead the story without promotional pressure.",
    primaryAssetKey: "S04_primary_v2_badgesafe_notext",
    fallbackAssetKey: "S04_fallback_v1",
    ctaLabel: null,
    composition: "left",
  },
  {
    id: "S07",
    title: "The vision is now clear.",
    support: "If this direction matches your goals, continue to the final action.",
    primaryAssetKey: "S07_fallback_v1",
    fallbackAssetKey: "S07_primary_v1",
    ctaLabel: null,
    composition: "right",
  },
  {
    id: "S08",
    title: "Start your tailored redesign.",
    support: "Share your current site and we return a focused modernization plan.",
    primaryAssetKey: "S08_primary_v1",
    fallbackAssetKey: "S08_fallback_v1",
    ctaLabel: "Start tailored redesign",
    composition: "left",
  },
];
const APPLY_NOW_SAFE_ZONES = {
  S01: { desktop: { x: 96, y: 120, w: 634, h: 500 }, portrait: { x: 32, y: 96, w: 326, h: 604 } },
  S02: { desktop: { x: 120, y: 180, w: 700, h: 520 }, portrait: { x: 28, y: 110, w: 324, h: 570 } },
  S04: { desktop: { x: 540, y: 180, w: 760, h: 520 }, portrait: { x: 30, y: 100, w: 320, h: 560 } },
  S07: { desktop: { x: 96, y: 540, w: 664, h: 300 }, portrait: { x: 28, y: 110, w: 324, h: 590 } },
  S08: { desktop: { x: 520, y: 220, w: 820, h: 420 }, portrait: { x: 24, y: 96, w: 326, h: 634 } },
};
const APPLY_NOW_VIEWPORT_SYSTEMS = {
  desktop: { w: 1920, h: 1080 },
  portrait: { w: 390, h: 844 },
};

function clampPercent(value) {
  return Math.min(100, Math.max(0, value));
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPrefersReducedMotion(mediaQuery.matches);
    sync();
    mediaQuery.addEventListener("change", sync);
    return () => mediaQuery.removeEventListener("change", sync);
  }, []);

  return prefersReducedMotion;
}

function useIsPortraitSafeViewport() {
  const [isPortraitSafeViewport, setIsPortraitSafeViewport] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsPortraitSafeViewport(mediaQuery.matches);
    sync();
    mediaQuery.addEventListener("change", sync);
    return () => mediaQuery.removeEventListener("change", sync);
  }, []);

  return isPortraitSafeViewport;
}

function getApplyNowAsset(assetKey, fallbackAssetKey) {
  return APPLY_NOW_ASSET_BY_KEY[assetKey] || APPLY_NOW_ASSET_BY_KEY[fallbackAssetKey] || "";
}

function ProductGrid() {
  const { products, loading, error } = useCatalogProducts({ mode: "full" });
  const rootRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isPortraitSafeViewport = useIsPortraitSafeViewport();
  const [briefSubmitted, setBriefSubmitted] = useState(false);

  const showEvidenceOverlay = useMemo(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return new URLSearchParams(window.location.search).get("evidence") === "1";
  }, []);

  const scenes = useMemo(() => {
    const safeZoneMode = isPortraitSafeViewport ? "portrait" : "desktop";
    const viewportBounds = APPLY_NOW_VIEWPORT_SYSTEMS[safeZoneMode] || APPLY_NOW_VIEWPORT_SYSTEMS.desktop;

    return APPLY_NOW_SCENES.map((scene, index) => {
      const sceneProduct = products[index] || products[0] || null;
      const safeZone = APPLY_NOW_SAFE_ZONES[scene.id]?.[safeZoneMode]
        || APPLY_NOW_SAFE_ZONES.S01.desktop;
      const focusX = clampPercent(((safeZone.x + safeZone.w / 2) / viewportBounds.w) * 100);
      const focusY = clampPercent(((safeZone.y + safeZone.h / 2) / viewportBounds.h) * 100);
      const safeZoneStyle = {
        left: `${clampPercent((safeZone.x / viewportBounds.w) * 100)}%`,
        top: `${clampPercent((safeZone.y / viewportBounds.h) * 100)}%`,
        width: `${clampPercent((safeZone.w / viewportBounds.w) * 100)}%`,
        height: `${clampPercent((safeZone.h / viewportBounds.h) * 100)}%`,
      };
      const image = prefersReducedMotion
        ? getApplyNowAsset(scene.fallbackAssetKey, scene.primaryAssetKey)
        : getApplyNowAsset(scene.primaryAssetKey, scene.fallbackAssetKey);

      return {
        ...scene,
        image,
        focusStyle: { objectPosition: `${focusX}% ${focusY}%` },
        safeZoneStyle,
        safeZoneMode,
        productId: sceneProduct?.id || null,
        step: scene.id,
        rhythm: ["drift", "impact", "quiet"][index % 3],
      };
    });
  }, [products, prefersReducedMotion, isPortraitSafeViewport]);

  useEffect(() => {
    if (!rootRef.current) {
      return undefined;
    }

    const sceneNodes = rootRef.current.querySelectorAll("[data-scene]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-active");
          } else {
            entry.target.classList.remove("is-active");
          }
        });
      },
      {
        threshold: 0.55,
      },
    );

    sceneNodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, [scenes.length]);

  if (loading) {
    return (
      <main className="immersive-catalog" aria-label="Immersive scene flow">
        <section className="catalog-state" role="status">
          <h1>Loading immersive story</h1>
          <p>Building scene sequence from the live source feed.</p>
        </section>
      </main>
    );
  }

  if (error || scenes.length === 0) {
    return (
      <main className="immersive-catalog" aria-label="Immersive scene flow">
        <section className="catalog-state catalog-state--error" role="alert">
          <h1>Scene feed unavailable</h1>
          <p>We could not compose the scene flow from the source feed.</p>
        </section>
      </main>
    );
  }

  return (
    <main ref={rootRef} className="immersive-catalog" aria-label="Immersive single-product flow">
      <section className="intro-scene" data-scene>
        <p className="intro-scene__eyebrow">MOMAZ curated sequence</p>
        <h1>A cinematic sequence for apply-now momentum.</h1>
        <p>
          Each viewport carries one focal moment. The narrative stays immersive from
          first frame to final detail.
        </p>
        <a href="#scene-0">Begin story</a>
      </section>

      {scenes.map((scene, index) => (
        <section
          key={scene.id}
          id={`scene-${index}`}
          className={`catalog-scene catalog-scene--${scene.rhythm} catalog-scene--${scene.composition}`}
          data-scene
          data-scene-step={scene.step}
          aria-label={`Apply-now scene ${scene.step}`}
        >
          <div className="catalog-scene__image-wrap" aria-hidden="true">
            {scene.image ? (
              <img
                src={scene.image}
                alt={`${scene.id} immersive frame`}
                loading={index < 2 ? "eager" : "lazy"}
                decoding="async"
                style={scene.focusStyle}
              />
            ) : (
              <div className="catalog-scene__fallback" />
            )}
            {showEvidenceOverlay ? (
              <div
                className="catalog-scene__safe-zone"
                data-safe-zone
                data-safe-zone-mode={scene.safeZoneMode}
                style={scene.safeZoneStyle}
              />
            ) : null}
          </div>

          <div className="catalog-scene__shade" />

          <article className="catalog-scene__content">
            <h2>{scene.title}</h2>
            <p>{scene.support}</p>
            {scene.id === "S08" ? (
              <a href="#tailored-redesign">{scene.ctaLabel}</a>
            ) : null}
          </article>
        </section>
      ))}

      <section id="tailored-redesign" className="tailored-redesign" data-scene aria-label="Tailored redesign start">
        <article className="tailored-redesign__content">
          <p className="catalog-scene__meta">
            <span>Tailored redesign</span>
            <span>Step 1</span>
          </p>
          <h2>Start your redesign brief</h2>
          <p>
            Share your current website, contact details, and one priority outcome.
            MOMAZ uses this brief to start your tailored redesign path.
          </p>
          <form
            className="tailored-redesign__form"
            onSubmit={(event) => {
              event.preventDefault();
              setBriefSubmitted(true);
            }}
          >
            <label>
              Current website URL
              <input name="websiteUrl" type="url" placeholder="https://example.com" required />
            </label>
            <label>
              Contact email
              <input name="email" type="email" placeholder="you@company.com" required />
            </label>
            <label>
              Main redesign goal
              <textarea name="goal" rows={4} placeholder="What should improve first?" required />
            </label>
            <button type="submit">Continue tailored redesign</button>
          </form>
          {briefSubmitted ? (
            <p className="tailored-redesign__confirmation" role="status">
              Brief started. MOMAZ will continue with a tailored redesign plan.
            </p>
          ) : null}
        </article>
      </section>
    </main>
  );
}

export default ProductGrid;
