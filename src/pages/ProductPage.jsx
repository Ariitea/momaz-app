import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import productsData from "../data/products.json";
import ProductCard from "../components/ProductCard";

function formatPrice(product) {
  if (!product.price_amount || product.price_amount === "0.00") {
    return "Price on request";
  }

  return `${product.price_amount} ${product.currency || ""}`.trim();
}

function ProductPage() {
  const { id } = useParams();
  const products = useMemo(() => productsData.products || [], []);
  const product = products.find((item) => item.id === id);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const relatedProducts = useMemo(() => {
    if (!product) {
      return [];
    }

    return products
      .filter(
        (item) =>
          item.id !== product.id &&
          (item.category || "Uncategorized") ===
            (product.category || "Uncategorized")
      )
      .slice(0, 4);
  }, [products, product]);

  if (!product) {
    return (
      <main className="app-shell">
        <div className="detail-not-found">
          <h1>Product not found</h1>
          <p>This product is not available in the current catalog feed.</p>
          <Link className="detail-back-link" to="/">
            Back to catalog
          </Link>
        </div>
      </main>
    );
  }

  const images = product.images?.length
    ? product.images
    : ["https://via.placeholder.com/700x700?text=No+Image"];

  const safeImageIndex = Math.min(activeImageIndex, images.length - 1);
  const activeImage = images[safeImageIndex];

  return (
    <main className="app-shell">
      <section className="product-detail">
        <div className="product-detail__nav">
          <Link className="detail-back-link" to="/">
            Back to catalog
          </Link>
          <span className="detail-id">ID: {product.id}</span>
        </div>

        <div className="product-detail__layout">
          <div className="product-gallery">
            <img className="product-gallery__main" src={activeImage} alt={product.title} />
            {images.length > 1 && (
              <div className="product-gallery__thumbs" role="list">
                {images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    className={`product-gallery__thumb ${
                      index === safeImageIndex ? "is-active" : ""
                    }`}
                    onClick={() => setActiveImageIndex(index)}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img src={image} alt={`${product.title} ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <article className="product-detail__panel">
            <p className="product-detail__category">
              {product.category || "Uncategorized"}
            </p>
            <h1 className="product-detail__title">
              {product.title || "Untitled product"}
            </h1>
            <p className="product-detail__price">{formatPrice(product)}</p>

            <dl className="product-detail__meta">
              <div>
                <dt>Availability</dt>
                <dd>{product.availability || "Unknown"}</dd>
              </div>
              <div>
                <dt>SKU</dt>
                <dd>{product.sku || "default"}</dd>
              </div>
              <div>
                <dt>Currency</dt>
                <dd>{product.currency || "N/A"}</dd>
              </div>
            </dl>

            {product.product_url && (
              <a
                className="product-detail__source"
                href={product.product_url}
                target="_blank"
                rel="noreferrer"
              >
                Open original product source
              </a>
            )}
          </article>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="related-products">
          <h2>More in this category</h2>
          <div className="products-grid">
            {relatedProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default ProductPage;
