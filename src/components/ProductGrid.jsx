import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCatalogProducts } from "../data/catalogClient";

const categories = ["all knitwear", "dress", "shorts", "leggings", "skirts", "joggers", "sweater"];

function removeChinese(text = "") {
  return text
    .replace(/[\u3400-\u9FFF]+/g, "")
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanTitle(title = "") {
  const cleaned = removeChinese(title);
  return cleaned || "Selected piece";
}

function cleanCategory(category = "") {
  const cleaned = removeChinese(category);
  return cleaned || "curated";
}

function ProductGrid() {
  const navigate = useNavigate();
  const { products, loading, error } = useCatalogProducts({ mode: "lite" });
  const visibleProducts = useMemo(() => products.slice(0, 24), [products]);
  const [activeProductId, setActiveProductId] = useState(null);
  const [leavingProductId, setLeavingProductId] = useState(null);
  const [rowY, setRowY] = useState(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false });

  const activeProduct =
    visibleProducts.find((product) => product.id === activeProductId) ||
    visibleProducts[0];

  const activeProductIndex = Math.max(
    0,
    visibleProducts.findIndex((product) => product.id === activeProduct?.id),
  );

  const activeImage =
    activeProduct?.images?.[0] ||
    activeProduct?.image ||
    "";

  function activateProduct(event, productId) {
    const rect = event.currentTarget.getBoundingClientRect();
    setActiveProductId(productId);
    setRowY(rect.top + rect.height / 2);
  }

  function openProduct(productId) {
    setActiveProductId(productId);
    setLeavingProductId(productId);
    window.setTimeout(() => {
      navigate(`/product/${productId}`);
    }, 520);
  }

  if (loading) return <main className="catalog-page">Loading products...</main>;
  if (error || !visibleProducts.length) return <main className="catalog-page">Unable to load products.</main>;

  return (
    <main className={`catalog-page catalog-page--list ${leavingProductId ? "is-leaving" : ""}`}>
      <div
        className={`catalog-hover-band ${rowY ? "is-visible" : ""}`}
        style={rowY ? { top: `${rowY}px` } : undefined}
        aria-hidden="true"
      />

      <aside className="catalog-side">
        {categories.map((category) => (
          <a key={category} href={`#${category.replaceAll(" ", "-")}`}>
            {category}
          </a>
        ))}
      </aside>

      <section className="catalog-list-panel">
        <div className="catalog-list-panel__bg">
          {activeImage ? <img key={activeProduct?.id} src={activeImage} alt="" /> : null}
        </div>

        <div
          className="catalog-list"
          onMouseMove={(event) =>
            setCursor({
              x: event.clientX,
              y: event.clientY,
              visible: true,
            })
          }
          onMouseLeave={() => {
            setCursor((current) => ({ ...current, visible: false }));
            setRowY(null);
            setActiveProductId(null);
          }}
        >
          {visibleProducts.map((product, index) => (
            <button
              key={product.id}
              type="button"
              className={`catalog-row ${product.id === activeProduct?.id ? "is-active" : ""} ${product.id === leavingProductId ? "is-leaving" : ""}`}
              onMouseEnter={(event) => activateProduct(event, product.id)}
              onFocus={(event) => activateProduct(event, product.id)}
              onClick={() => openProduct(product.id)}
            >
              <span>{String(index + 1).padStart(3, "0")}</span>
              <strong>{cleanTitle(product.title)}</strong>
              <em>{cleanCategory(product.category)}</em>
            </button>
          ))}
        </div>
      </section>

      <aside className="catalog-right-panel" aria-label="Active product details">
        <span>{String(activeProductIndex + 1).padStart(3, "0")}</span>
        <strong>{cleanTitle(activeProduct?.title)}</strong>
        <em>{cleanCategory(activeProduct?.category)}</em>
        <p>Hover selection / click to open product view</p>
      </aside>

      <div
        key={`preview-${activeProduct?.id || "empty"}`}
        className={`catalog-cursor-preview ${cursor.visible ? "is-visible" : ""}`}
        aria-hidden="true"
        style={{
          left: `${cursor.x}px`,
          top: `${cursor.y}px`,
        }}
      >
        {activeImage ? <img src={activeImage} alt="" /> : null}
      </div>
    </main>
  );
}

export default ProductGrid;
