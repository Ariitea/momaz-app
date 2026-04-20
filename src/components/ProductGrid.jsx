import { useEffect, useMemo, useRef, useState } from "react";
import HeroLanding from "./HeroLanding";
import ProductCard from "./ProductCard";
import ProductFocusOverlay from "./ProductFocusOverlay";
import UtilityRail from "./UtilityRail";
import { useCatalogProducts } from "../data/catalogClient";

const CATALOG_SCROLL_KEY = "momaz.catalog.scroll";

const SCENE_TEMPLATES = [
  {
    type: "prologue",
    heading: "Prologue",
    line: "A slow reveal with one dominant silhouette and quiet supporting echoes.",
    label: "Chapter I",
    chunkSize: 3,
    focalLayout: "hero",
    supportLayouts: ["aside-tall", "aside-wide"],
  },
  {
    type: "contrast",
    heading: "Contrast Study",
    line: "A tighter passage where material and proportion sharpen the gaze.",
    label: "Chapter II",
    chunkSize: 3,
    focalLayout: "panorama",
    supportLayouts: ["portrait", "portrait"],
  },
  {
    type: "cadence",
    heading: "Cadence",
    line: "A calmer tempo with breathing space around the core piece.",
    label: "Chapter III",
    chunkSize: 3,
    focalLayout: "landscape",
    supportLayouts: ["portrait", "portrait"],
  },
  {
    type: "echo",
    heading: "Echo",
    line: "Final movement where the strongest shape lingers in memory.",
    label: "Chapter IV",
    chunkSize: 2,
    focalLayout: "hero",
    supportLayouts: ["aside-wide"],
  },
];

function sortByStoryMomentum(products) {
  return [...products].sort(
    (left, right) => (right.updated_at_unix_ms || 0) - (left.updated_at_unix_ms || 0)
  );
}

function buildScenes(products) {
  const limit = products.slice(0, 18);
  const scenes = [];
  let cursor = 0;
  let sceneIndex = 0;

  while (cursor < limit.length) {
    const template = SCENE_TEMPLATES[sceneIndex % SCENE_TEMPLATES.length];
    const productsChunk = limit.slice(cursor, cursor + template.chunkSize);
    if (productsChunk.length === 0) {
      break;
    }

    scenes.push({
      id: `scene-${sceneIndex + 1}`,
      type: template.type,
      heading: template.heading,
      line: template.line,
      label: template.label,
      focal: {
        product: productsChunk[0],
        layout: template.focalLayout,
      },
      supporting: productsChunk.slice(1, 3).map((product, productIndex) => ({
        product,
        layout: template.supportLayouts[productIndex] || "portrait",
      })),
    });

    cursor += productsChunk.length;
    sceneIndex += 1;
  }

  return scenes;
}

function ProductGrid() {
  const { products, loading, error } = useCatalogProducts({ mode: "lite" });
  const [focusedProduct, setFocusedProduct] = useState(null);
  const [isRailCollapsed, setIsRailCollapsed] = useState(false);
  const [activeSceneId, setActiveSceneId] = useState("");
  const previousScrollYRef = useRef(0);

  useEffect(() => {
    const restoreValue = Number.parseFloat(
      sessionStorage.getItem(CATALOG_SCROLL_KEY) || "NaN"
    );
    if (Number.isFinite(restoreValue)) {
      window.scrollTo({ top: restoreValue, behavior: "auto" });
      sessionStorage.removeItem(CATALOG_SCROLL_KEY);
    }

    const onScroll = () => {
      const collapsed = window.scrollY > 220;
      setIsRailCollapsed(collapsed);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!focusedProduct) {
      document.body.style.removeProperty("overflow");
      return;
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.removeProperty("overflow");
    };
  }, [focusedProduct]);

  const curatedProducts = useMemo(() => sortByStoryMomentum(products), [products]);
  const scenes = useMemo(() => buildScenes(curatedProducts), [curatedProducts]);

  useEffect(() => {
    if (scenes.length === 0) {
      return;
    }

    const sceneNodes = Array.from(document.querySelectorAll("[data-scene-id]"));
    if (sceneNodes.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio);

        if (visible[0]) {
          const nextSceneId = visible[0].target.getAttribute("data-scene-id") || "";
          if (nextSceneId) {
            setActiveSceneId(nextSceneId);
          }
        }
      },
      {
        threshold: [0.2, 0.35, 0.5, 0.7],
        rootMargin: "-20% 0px -35% 0px",
      }
    );

    sceneNodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [scenes]);

  const openFocusMode = (product) => {
    previousScrollYRef.current = window.scrollY;
    setFocusedProduct(product);
  };

  const closeFocusMode = () => {
    setFocusedProduct(null);
    window.scrollTo({ top: previousScrollYRef.current, behavior: "auto" });
  };

  const markScrollBeforeRoute = () => {
    sessionStorage.setItem(CATALOG_SCROLL_KEY, String(window.scrollY));
  };

  const activeSceneIndex = scenes.findIndex((scene) => scene.id === activeSceneId);
  const effectiveActiveSceneIndex = activeSceneIndex >= 0 ? activeSceneIndex : 0;
  const chapterProgress =
    scenes.length > 0
      ? Math.round(((effectiveActiveSceneIndex + 1) / scenes.length) * 100)
      : 0;

  return (
    <main className="catalog-page catalog-page--editorial">
      <HeroLanding />

      <UtilityRail
        itemCount={curatedProducts.length}
        isCollapsed={isRailCollapsed}
        activeSceneLabel={scenes[effectiveActiveSceneIndex]?.label || ""}
        activeSceneLine={scenes[effectiveActiveSceneIndex]?.line || ""}
        chapterProgress={chapterProgress}
        sceneCount={scenes.length}
      />

      {loading && <p className="catalog-state">Loading curated products...</p>}
      {error && (
        <div className="catalog-state catalog-state--error">
          <h3>Catalog unavailable</h3>
          <p>We cannot load the product feed right now. Please try again shortly.</p>
        </div>
      )}

      {!loading && !error && scenes.length === 0 && (
        <p className="catalog-state">No product is available to compose the sequence right now.</p>
      )}

      {!loading && !error && scenes.length > 0 && (
        <section className="editorial-stream" aria-label="Immersive editorial stream">
          {scenes.map((scene, sceneIndex) => {
            const isActive = activeSceneId
              ? scene.id === activeSceneId
              : sceneIndex === 0;
            return (
              <article
                key={scene.id}
                className={`editorial-scene editorial-scene--${scene.type} ${isActive ? "is-active" : ""}`}
                data-scene-id={scene.id}
                aria-label={`${scene.label}: ${scene.heading}`}
              >
                <header>
                  <p className="editorial-scene__label">{scene.label}</p>
                  <h2>{scene.heading}</h2>
                  <p className="editorial-scene__line">{scene.line}</p>
                </header>
                <div className="editorial-scene__rail">
                  <ProductCard
                    key={scene.focal.product.id}
                    product={scene.focal.product}
                    layout={scene.focal.layout}
                    emphasis="focal"
                    onFocus={openFocusMode}
                  />

                  <div className="editorial-scene__support">
                    {scene.supporting.map((sceneProduct) => (
                      <ProductCard
                        key={sceneProduct.product.id}
                        product={sceneProduct.product}
                        layout={sceneProduct.layout}
                        emphasis="supporting"
                        onFocus={openFocusMode}
                      />
                    ))}
                  </div>

                  {scene.supporting.length === 0 ? (
                    <aside className="editorial-scene__support-note">
                      <p>This chapter holds the focal piece in isolation to preserve visual dominance.</p>
                    </aside>
                  ) : null}
                </div>
              </article>
            );
          })}
        </section>
      )}

      {focusedProduct ? (
        <ProductFocusOverlay
          product={focusedProduct}
          onClose={closeFocusMode}
          onOpenDetail={markScrollBeforeRoute}
        />
      ) : null}
    </main>
  );
}

export default ProductGrid;
