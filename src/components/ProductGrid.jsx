import { useEffect, useMemo, useRef, useState } from "react";
import HeroLanding from "./HeroLanding";
import ProductCard from "./ProductCard";
import ProductFocusOverlay from "./ProductFocusOverlay";
import UtilityRail from "./UtilityRail";
import { useCatalogProducts } from "../data/catalogClient";

const SORT_OPTIONS = {
  recent: "recent",
  priceAsc: "price-asc",
  priceDesc: "price-desc",
};

const CATALOG_SCROLL_KEY = "momaz.catalog.scroll";

const SCENE_TEMPLATES = [
  {
    type: "prologue",
    heading: "Prologue",
    line: "Slow opening with hero pieces and broad silhouettes.",
    label: "Chapter I",
  },
  {
    type: "contrast",
    heading: "Contrast Study",
    line: "A denser cut with tighter rhythm and controlled tension.",
    label: "Chapter II",
  },
  {
    type: "cadence",
    heading: "Cadence",
    line: "Settled pacing with focal products in a calm sequence.",
    label: "Chapter III",
  },
  {
    type: "echo",
    heading: "Echo",
    line: "Final chapter that lets the strongest pieces breathe.",
    label: "Chapter IV",
  },
];

function normalizePriceValue(rawPrice, emptyFallback) {
  const value = Number.parseFloat(rawPrice);
  return Number.isFinite(value) ? value : emptyFallback;
}

function sortProducts(products, sortBy) {
  if (sortBy === SORT_OPTIONS.priceAsc) {
    return [...products].sort(
      (left, right) =>
        normalizePriceValue(left.price_amount, Number.POSITIVE_INFINITY) -
        normalizePriceValue(right.price_amount, Number.POSITIVE_INFINITY)
    );
  }

  if (sortBy === SORT_OPTIONS.priceDesc) {
    return [...products].sort(
      (left, right) =>
        normalizePriceValue(right.price_amount, Number.NEGATIVE_INFINITY) -
        normalizePriceValue(left.price_amount, Number.NEGATIVE_INFINITY)
    );
  }

  return [...products].sort(
    (left, right) =>
      (right.updated_at_unix_ms || 0) - (left.updated_at_unix_ms || 0)
  );
}

function buildScenes(products) {
  const limit = products.slice(0, 24);
  const scenes = [];

  for (let index = 0; index < limit.length; index += 4) {
    const productsChunk = limit.slice(index, index + 4);
    if (productsChunk.length === 0) {
      break;
    }

    const sceneIndex = Math.floor(index / 4);
    const template = SCENE_TEMPLATES[sceneIndex % SCENE_TEMPLATES.length];

    scenes.push({
      id: `scene-${sceneIndex + 1}`,
      type: template.type,
      heading: template.heading,
      line: template.line,
      label: template.label,
      products: productsChunk,
    });
  }

  return scenes;
}

function ProductGrid() {
  const { products, loading, error } = useCatalogProducts({ mode: "lite" });
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.recent);
  const [query, setQuery] = useState("");
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

    const onScroll = () => setIsRailCollapsed(window.scrollY > 220);
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

  const categories = useMemo(() => {
    const unique = new Set(products.map((item) => item.category).filter(Boolean));
    return ["all", ...Array.from(unique).sort((a, b) => a.localeCompare(b))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const categoryFiltered =
      category === "all"
        ? products
        : products.filter((item) => (item.category || "") === category);

    const queryFiltered = normalizedQuery
      ? categoryFiltered.filter((product) => {
          const title = (product.title || "").toLowerCase();
          const categoryLabel = (product.category || "").toLowerCase();
          const sku = (product.sku || "").toLowerCase();
          const id = (product.id || "").toLowerCase();
          return (
            title.includes(normalizedQuery) ||
            categoryLabel.includes(normalizedQuery) ||
            sku.includes(normalizedQuery) ||
            id.includes(normalizedQuery)
          );
        })
      : categoryFiltered;

    return sortProducts(queryFiltered, sortBy);
  }, [products, category, sortBy, query]);

  const scenes = useMemo(() => buildScenes(filteredProducts), [filteredProducts]);

  useEffect(() => {
    if (scenes.length === 0) {
      setActiveSceneId("");
      return;
    }

    setActiveSceneId((current) => current || scenes[0].id);

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
  const chapterProgress =
    scenes.length > 0
      ? Math.round((((activeSceneIndex >= 0 ? activeSceneIndex : 0) + 1) / scenes.length) * 100)
      : 0;

  return (
    <main className="catalog-page catalog-page--editorial">
      <HeroLanding />

      <UtilityRail
        query={query}
        onQueryChange={setQuery}
        category={category}
        onCategoryChange={setCategory}
        categories={categories}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        itemCount={filteredProducts.length}
        isCollapsed={isRailCollapsed}
        activeSceneLabel={activeSceneIndex >= 0 ? scenes[activeSceneIndex]?.label || "" : ""}
        chapterProgress={chapterProgress}
      />

      {loading && <p className="catalog-state">Loading curated products...</p>}
      {error && (
        <div className="catalog-state catalog-state--error">
          <h3>Catalog unavailable</h3>
          <p>We cannot load the product feed right now. Please try again shortly.</p>
        </div>
      )}

      {!loading && !error && scenes.length === 0 && (
        <p className="catalog-state">No product matches these filters. Broaden your search.</p>
      )}

      {!loading && !error && scenes.length > 0 && (
        <section className="editorial-stream" aria-label="Immersive editorial stream">
          {scenes.map((scene, sceneIndex) => {
            const isActive = scene.id === activeSceneId;
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
                  {scene.products.map((product, productIndex) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      layout={
                        productIndex === 0
                          ? "hero"
                          : sceneIndex % 2 === 0 && productIndex === 2
                            ? "landscape"
                            : "portrait"
                      }
                      onFocus={openFocusMode}
                    />
                  ))}
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
