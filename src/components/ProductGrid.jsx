import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigationType, useSearchParams } from "react-router-dom";
import ProductCard from "./ProductCard";
import { useCatalogProducts } from "../data/catalogClient";

const PAGE_SIZE = 12;
const CATALOG_SCROLL_STORAGE_KEY = "momaz.catalog.scrollY";
const SCROLL_RESTORE_MAX_AGE_MS = 10 * 60 * 1000;
const SORT_DEFAULT = "updated_desc";
const SORT_OPTIONS = new Set([
  "updated_desc",
  "updated_asc",
  "title_asc",
  "title_desc",
]);

function parseCount(rawCount) {
  const parsed = Number.parseInt(rawCount || "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : PAGE_SIZE;
}

function parseCatalogState(searchParams) {
  const q = searchParams.get("q") || "";
  const cat = searchParams.get("cat") || "all";
  const sortParam = searchParams.get("sort") || SORT_DEFAULT;
  const sort = SORT_OPTIONS.has(sortParam) ? sortParam : SORT_DEFAULT;
  const count = parseCount(searchParams.get("count"));

  return { q, cat, sort, count };
}

function readStoredScrollY() {
  const rawValue = sessionStorage.getItem(CATALOG_SCROLL_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue);
    if (
      typeof parsed?.y === "number" &&
      Number.isFinite(parsed.y) &&
      typeof parsed?.storedAt === "number" &&
      Date.now() - parsed.storedAt <= SCROLL_RESTORE_MAX_AGE_MS
    ) {
      return parsed.y;
    }
  } catch {
    return null;
  }

  return null;
}

function sortLabel(sortBy) {
  if (sortBy === "updated_asc") {
    return "Mises a jour anciennes";
  }

  if (sortBy === "title_asc") {
    return "Titre A-Z";
  }

  if (sortBy === "title_desc") {
    return "Titre Z-A";
  }

  return "Mises a jour recentes";
}

function ProductGrid() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlState = useMemo(() => parseCatalogState(searchParams), [searchParams]);
  const { products, loading, error } = useCatalogProducts({ mode: "lite" });
  const [searchTerm, setSearchTerm] = useState(urlState.q);
  const [selectedCategory, setSelectedCategory] = useState(urlState.cat);
  const [sortBy, setSortBy] = useState(urlState.sort);
  const [visibleCount, setVisibleCount] = useState(urlState.count);
  const [heroLight, setHeroLight] = useState({ x: 50, y: 50 });

  useEffect(() => {
    setSearchTerm(urlState.q);
    setSelectedCategory(urlState.cat);
    setSortBy(urlState.sort);
    setVisibleCount(urlState.count);
  }, [urlState]);

  useEffect(() => {
    const nextParams = new URLSearchParams();
    const trimmedSearch = searchTerm.trim();

    if (trimmedSearch) {
      nextParams.set("q", trimmedSearch);
    }

    if (selectedCategory !== "all") {
      nextParams.set("cat", selectedCategory);
    }

    if (sortBy !== SORT_DEFAULT) {
      nextParams.set("sort", sortBy);
    }

    if (visibleCount !== PAGE_SIZE) {
      nextParams.set("count", String(visibleCount));
    }

    if (searchParams.toString() !== nextParams.toString()) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [searchTerm, selectedCategory, sortBy, visibleCount, searchParams, setSearchParams]);

  const categories = useMemo(() => {
    const map = new Map();

    for (const product of products) {
      const category = product.category || "Sans categorie";
      map.set(category, (map.get(category) || 0) + 1);
    }

    return [
      { value: "all", label: "Toutes les categories", count: products.length },
      ...Array.from(map.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([value, count]) => ({ value, label: value, count })),
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const title = (product.title || "").toLowerCase();
      const category = (product.category || "Sans categorie").toLowerCase();
      const sku = (product.sku || "").toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        title.includes(normalizedSearch) ||
        category.includes(normalizedSearch) ||
        sku.includes(normalizedSearch) ||
        product.id.toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        selectedCategory === "all" ||
        (product.category || "Sans categorie") === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    return filtered.sort((left, right) => {
      if (sortBy === "title_asc") {
        return (left.title || "").localeCompare(right.title || "");
      }

      if (sortBy === "title_desc") {
        return (right.title || "").localeCompare(left.title || "");
      }

      const leftUpdated = left.updated_at_unix_ms || 0;
      const rightUpdated = right.updated_at_unix_ms || 0;

      return sortBy === "updated_asc"
        ? leftUpdated - rightUpdated
        : rightUpdated - leftUpdated;
    });
  }, [products, searchTerm, selectedCategory, sortBy]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setVisibleCount(PAGE_SIZE);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setVisibleCount(PAGE_SIZE);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setVisibleCount(PAGE_SIZE);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSortBy(SORT_DEFAULT);
    setVisibleCount(PAGE_SIZE);
  };

  const hasActiveFilters =
    searchTerm.trim() || selectedCategory !== "all" || sortBy !== SORT_DEFAULT;

  useEffect(() => {
    if (loading || error) {
      return;
    }

    const shouldRestoreFromState = location.state?.restoreCatalogScroll === true;
    const shouldRestoreFromPop = navigationType === "POP";

    if (!shouldRestoreFromState && !shouldRestoreFromPop) {
      return;
    }

    const storedScrollY = readStoredScrollY();
    if (storedScrollY === null) {
      return;
    }

    requestAnimationFrame(() => {
      window.scrollTo({ top: storedScrollY, behavior: "auto" });
      sessionStorage.removeItem(CATALOG_SCROLL_STORAGE_KEY);
    });
  }, [loading, error, location.state, navigationType]);

  const handleNavigateToProduct = () => {
    sessionStorage.setItem(
      CATALOG_SCROLL_STORAGE_KEY,
      JSON.stringify({
        y: window.scrollY,
        storedAt: Date.now(),
      })
    );
  };

  const handleHeroPointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setHeroLight({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  const getCardVariant = (index) => {
    if (index === 0 || index % 9 === 0) {
      return "feature";
    }

    if (index % 5 === 0) {
      return "tall";
    }

    return "default";
  };

  if (loading) {
    return (
      <main className="app-shell">
        <p className="empty-state">Chargement du catalogue en cours...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="app-shell">
        <p className="empty-state">
          Le flux catalogue est indisponible temporairement. Rechargez la page.
        </p>
      </main>
    );
  }

  if (!products.length) {
    return (
      <main className="app-shell">
        <p className="empty-state">Aucun produit disponible dans le catalogue.</p>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <section
        className="catalog-hero"
        style={{
          "--hero-light-x": `${heroLight.x}%`,
          "--hero-light-y": `${heroLight.y}%`,
        }}
        onPointerMove={handleHeroPointerMove}
        aria-label="Presentation de la collection Momaz V4"
      >
        <p className="catalog-hero__kicker">Collection Momaz V4</p>
        <h1 className="catalog-hero__title">Commerce Premium, Curation Editoriale</h1>
        <p className="catalog-hero__subtitle">
          Un catalogue premium alimente par le flux produit en direct. Filtrez par
          categorie, analysez chaque fiche et naviguez rapidement au clavier.
        </p>
        <p className="catalog-hero__caption">
          Direction visuelle: Maison Modern, typographie editoriale et densite maitrisee.
        </p>
        <div className="catalog-hero__line" aria-hidden="true">
          Immersive Curated Selection
        </div>

        <div className="catalog-hero__stats" aria-label="Indicateurs cles du catalogue">
          <article>
            <span>Total pieces</span>
            <strong>{products.length}</strong>
          </article>
          <article>
            <span>Visibles</span>
            <strong>{visibleProducts.length}</strong>
          </article>
          <article>
            <span>Familles</span>
            <strong>{categories.length - 1}</strong>
          </article>
        </div>
      </section>

      <section className="catalog-panel" aria-label="Filtres et listing catalogue">
        <div className="catalog-panel__heading">
          <h2>Inventaire Maison</h2>
          <p aria-live="polite" role="status">
            {filteredProducts.length} resultat{filteredProducts.length === 1 ? "" : "s"}
            {" "}dans la source de verite active.
          </p>
        </div>

        <div className="products-toolbar" role="region" aria-label="Filtres produit">
          <label className="products-toolbar__field products-toolbar__field--search">
            <span>Recherche</span>
            <input
              className="products-toolbar__search"
              type="search"
              placeholder="Titre, categorie, SKU ou ID"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </label>

          <label className="products-toolbar__field">
            <span>Categorie</span>
            <select
              className="products-toolbar__select"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label} ({category.count})
                </option>
              ))}
            </select>
          </label>

          <label className="products-toolbar__field">
            <span>Tri</span>
            <select
              className="products-toolbar__select"
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="updated_desc">Mises a jour recentes</option>
              <option value="updated_asc">Mises a jour anciennes</option>
              <option value="title_asc">Titre A-Z</option>
              <option value="title_desc">Titre Z-A</option>
            </select>
          </label>

          <button
            type="button"
            className="products-toolbar__reset"
            onClick={resetFilters}
            disabled={!hasActiveFilters}
          >
            Reinitialiser
          </button>
        </div>

        <div className="products-toolbar__chips" aria-label="Etat actif du catalogue">
          {searchTerm.trim() && (
            <span className="products-toolbar__chip">
              Recherche: <strong>{searchTerm.trim()}</strong>
            </span>
          )}
          {selectedCategory !== "all" && (
            <span className="products-toolbar__chip">
              Categorie: <strong>{selectedCategory}</strong>
            </span>
          )}
          {sortBy !== SORT_DEFAULT && (
            <span className="products-toolbar__chip">
              Tri: <strong>{sortLabel(sortBy)}</strong>
            </span>
          )}
          {visibleCount !== PAGE_SIZE && (
            <span className="products-toolbar__chip">
              Nombre: <strong>{visibleCount}</strong>
            </span>
          )}
          {!hasActiveFilters && visibleCount === PAGE_SIZE && (
            <span className="products-toolbar__chip products-toolbar__chip--default">
              Vue par defaut
            </span>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <p className="empty-state">
            Aucun produit ne correspond a vos filtres. Elargissez la recherche.
          </p>
        ) : (
          <>
            <div className="products-grid products-grid--editorial">
              {visibleProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  linkSearch={location.search}
                  onNavigateToProduct={handleNavigateToProduct}
                  motionIndex={index}
                  variant={getCardVariant(index)}
                />
              ))}
            </div>

            {visibleCount < filteredProducts.length && (
              <div className="products-load-more">
                <button
                  className="products-load-more__button"
                  onClick={() =>
                    setVisibleCount((previous) => previous + PAGE_SIZE)
                  }
                >
                  Afficher {Math.min(PAGE_SIZE, filteredProducts.length - visibleCount)} de plus
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}

export default ProductGrid;
