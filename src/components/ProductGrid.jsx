import { useMemo, useState } from "react";
import productsData from "../data/products.json";
import ProductCard from "./ProductCard";

function ProductGrid() {
  const products = productsData.products || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [visibleCount, setVisibleCount] = useState(50);

  const categories = useMemo(() => {
    const values = products
      .map((product) => product.category || "Uncategorized")
      .filter(Boolean);

    return ["all", ...Array.from(new Set(values)).sort((a, b) => a.localeCompare(b))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const title = (product.title || "").toLowerCase();
      const category = (product.category || "Uncategorized").toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        title.includes(normalizedSearch) ||
        category.includes(normalizedSearch);

      const matchesCategory =
        selectedCategory === "all" ||
        (product.category || "Uncategorized") === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setVisibleCount(50);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setVisibleCount(50);
  };

  if (!products.length) {
    return <p>No products found.</p>;
  }

  return (
    <section>
      <div className="products-header">
        <h2>Product Catalog</h2>
        <p>
          {filteredProducts.length} result{filteredProducts.length > 1 ? "s" : ""} / {products.length} products
        </p>
      </div>

      <div className="products-toolbar">
        <input
          className="products-toolbar__search"
          type="text"
          placeholder="Search by title or category"
          value={searchTerm}
          onChange={handleSearchChange}
        />

        <select
          className="products-toolbar__select"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === "all" ? "All categories" : category}
            </option>
          ))}
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <p>No matching products found.</p>
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
                onClick={() => setVisibleCount((prev) => prev + 50)}
              >
                Load more
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default ProductGrid;