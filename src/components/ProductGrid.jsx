import { useMemo, useState } from "react";
import productsData from "../data/products.json";
import ProductCard from "./ProductCard";

const PAGE_SIZE = 24;

function ProductGrid() {
  const products = useMemo(() => productsData.products || [], []);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("updated_desc");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const categories = useMemo(() => {
    const map = new Map();

    for (const product of products) {
      const category = product.category || "Uncategorized";
      map.set(category, (map.get(category) || 0) + 1);
    }

    return [
      { value: "all", label: "All categories", count: products.length },
      ...Array.from(map.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([value, count]) => ({ value, label: value, count })),
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const title = (product.title || "").toLowerCase();
      const category = (product.category || "Uncategorized").toLowerCase();
      const sku = (product.sku || "").toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        title.includes(normalizedSearch) ||
        category.includes(normalizedSearch) ||
        sku.includes(normalizedSearch) ||
        product.id.toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        selectedCategory === "all" ||
        (product.category || "Uncategorized") === selectedCategory;

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
    setSortBy("updated_desc");
    setVisibleCount(PAGE_SIZE);
  };

  const hasActiveFilters =
    searchTerm.trim() || selectedCategory !== "all" || sortBy !== "updated_desc";

  if (!products.length) {
    return (
      <main className="app-shell">
        <p className="empty-state">No products found in the catalog.</p>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="catalog-hero">
        <p className="catalog-hero__eyebrow">Momaz Catalog</p>
        <h1 className="catalog-hero__title">Curated Product Inventory</h1>
        <p className="catalog-hero__subtitle">
          Browse, filter, and inspect the current product feed from one source of
          truth.
        </p>
      </header>

      <section className="catalog-panel">
        <div className="catalog-summary">
          <h2>Catalog</h2>
          <p>
            Showing <strong>{visibleProducts.length}</strong> of{" "}
            <strong>{filteredProducts.length}</strong> result
            {filteredProducts.length === 1 ? "" : "s"} ({products.length} total)
          </p>
        </div>

        <div className="products-toolbar" role="region" aria-label="Product filters">
          <label className="products-toolbar__field">
            <span>Search</span>
            <input
              className="products-toolbar__search"
              type="search"
              placeholder="Search title, category, SKU, or ID"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </label>

          <label className="products-toolbar__field">
            <span>Category</span>
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
            <span>Sort</span>
            <select
              className="products-toolbar__select"
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="updated_desc">Recently updated</option>
              <option value="updated_asc">Oldest updated</option>
              <option value="title_asc">Title A-Z</option>
              <option value="title_desc">Title Z-A</option>
            </select>
          </label>

          <button
            type="button"
            className="products-toolbar__reset"
            onClick={resetFilters}
            disabled={!hasActiveFilters}
          >
            Reset
          </button>
        </div>

        {filteredProducts.length === 0 ? (
          <p className="empty-state">
            No matching products found. Try broadening your search.
          </p>
        ) : (
          <>
            <div className="products-grid">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
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
                  Load {Math.min(PAGE_SIZE, filteredProducts.length - visibleCount)} more
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
