import { useMemo, useState } from "react";
import HeroLanding from "./HeroLanding";
import ProductCard from "./ProductCard";
import { useCatalogProducts } from "../data/catalogClient";
import { getCategoryLabel } from "../utils/copy";

const SORT_OPTIONS = {
  recent: "recent",
  priceAsc: "price-asc",
  priceDesc: "price-desc",
};

function ProductGrid() {
  const { products, loading, error } = useCatalogProducts({ mode: "lite" });
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.recent);
  const [query, setQuery] = useState("");

  const categories = useMemo(() => {
    const unique = new Set(products.map((item) => item.category).filter(Boolean));
    return ["all", ...Array.from(unique).sort((a, b) => a.localeCompare(b))];
  }, [products]);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filteredByCategory =
      category === "all"
        ? products
        : products.filter((product) => (product.category || "") === category);

    const filtered = normalizedQuery
      ? filteredByCategory.filter((product) => {
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
      : filteredByCategory;

    return [...filtered].sort((left, right) => {
      if (sortBy === SORT_OPTIONS.priceAsc) {
        return Number.parseFloat(left.price_amount || "Infinity") - Number.parseFloat(right.price_amount || "Infinity");
      }

      if (sortBy === SORT_OPTIONS.priceDesc) {
        return Number.parseFloat(right.price_amount || "-Infinity") - Number.parseFloat(left.price_amount || "-Infinity");
      }

      return (right.updated_at_unix_ms || 0) - (left.updated_at_unix_ms || 0);
    });
  }, [products, category, sortBy, query]);

  const selectedCategoryLabel = category === "all" ? "All categories" : getCategoryLabel(category);
  const hasDefaultFilters = category === "all" && sortBy === SORT_OPTIONS.recent && query.trim() === "";

  return (
    <main className="catalog-page">
      <HeroLanding />

      <section id="catalog-section" className="catalog-shell" aria-label="Catalog gallery">
        <aside className="catalog-sidebar">
          <p>Collections</p>
          <ul>
            {categories.slice(1, 9).map((item) => (
              <li key={item}>
                <button
                  type="button"
                  className={item === category ? "is-active" : ""}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>

          <div className="catalog-sidebar__switch">
            <button type="button" onClick={() => setCategory("all")} className={category === "all" ? "is-active" : ""}>
              all
            </button>
            <button type="button" className="is-muted" aria-disabled="true">
              grid
            </button>
          </div>
        </aside>

        <section className="catalog-main">
          <header className="catalog-panel__heading">
            <h2>The Collection</h2>
            <p role="status">{`${visibleProducts.length} piece(s) ready to explore.`}</p>
          </header>

          <div className="catalog-toolbar">
            <label>
              Search
              <input
                type="search"
                className="catalog-toolbar__search"
                value={query}
                placeholder="Piece name or collection"
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>

            <label>
              Collection
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item === "all" ? "All categories" : getCategoryLabel(item)}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Sort by
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value={SORT_OPTIONS.recent}>Most recent</option>
                <option value={SORT_OPTIONS.priceAsc}>Price low to high</option>
                <option value={SORT_OPTIONS.priceDesc}>Price high to low</option>
              </select>
            </label>

            <button
              type="button"
              className="catalog-toolbar__reset"
              onClick={() => {
                setQuery("");
                setCategory("all");
                setSortBy(SORT_OPTIONS.recent);
              }}
            >
              Reset
            </button>
          </div>

          <div className="catalog-toolbar__chips" aria-live="polite">
            {hasDefaultFilters && <span className="catalog-toolbar__chip catalog-toolbar__chip--default">Curated view</span>}
            {query.trim() !== "" && <span className="catalog-toolbar__chip">{`Query: ${query.trim()}`}</span>}
            {category !== "all" && <span className="catalog-toolbar__chip">{`Collection: ${selectedCategoryLabel}`}</span>}
            {sortBy !== SORT_OPTIONS.recent && (
              <span className="catalog-toolbar__chip">
                {`Sort: ${sortBy === SORT_OPTIONS.priceAsc ? "Price low to high" : "Price high to low"}`}
              </span>
            )}
            <span className="catalog-toolbar__chip">{`Pieces: ${visibleProducts.length}`}</span>
          </div>

          {loading && <p className="catalog-state">Loading curated products...</p>}
          {error && (
            <div className="catalog-state catalog-state--error">
              <h3>Catalog unavailable</h3>
              <p>We cannot load the product feed right now. Please try again shortly.</p>
            </div>
          )}

          {!loading && !error && visibleProducts.length === 0 && (
            <p className="catalog-state">No product matches these filters. Broaden your search.</p>
          )}

          {!loading && !error && visibleProducts.length > 0 && (
            <div className="editorial-grid">
              {visibleProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant={index % 8 === 0 ? "hero" : "default"}
                />
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default ProductGrid;
