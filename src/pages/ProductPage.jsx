import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCatalogProducts } from "../data/catalogClient";

function formatPrice(product) {
  if (!product?.price_amount || product.price_amount === "0.00") {
    return "Price upon request";
  }

  return `${product.price_amount} ${product.currency || ""}`.trim();
}

function ProductPage() {
  const { id } = useParams();
  const { products, loading, error } = useCatalogProducts({ mode: "full" });
  const product = useMemo(() => products.find((item) => item.id === id), [products, id]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (loading) {
    return <main className="pdp"><p>Loading product...</p></main>;
  }

  if (error || !product) {
    return (
      <main className="pdp">
        <p>Product unavailable.</p>
        <Link to="/">Back to products</Link>
      </main>
    );
  }

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image].filter(Boolean);

  const activeImage = images[activeImageIndex] || images[0] || "";
  const price = formatPrice(product);

  return (
    <main className="pdp">
      <Link className="pdp__back" to="/">← Back</Link>

      <section className="pdp__layout">
        <div className="pdp__gallery">
          <div className="pdp__main-image">
            {activeImage ? (
              <img src={activeImage} alt={product.title} />
            ) : (
              <div className="pdp__placeholder" />
            )}
          </div>

          {images.length > 1 ? (
            <div className="pdp__thumbs" aria-label="Product images">
              {images.slice(0, 8).map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  className={index === activeImageIndex ? "is-active" : ""}
                  onClick={() => setActiveImageIndex(index)}
                  aria-label={`View image ${index + 1}`}
                >
                  <img src={image} alt="" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <aside className="pdp__info" aria-label="Product information">
          <p className="pdp__category">{product.category || "Selected piece"}</p>
          <h1>{product.title}</h1>
          <p className="pdp__price">{price}</p>

          <div className="pdp__meta">
            <p><span>Availability</span>{product.availability || "Selected edition"}</p>
            <p><span>Source</span>{product.source || "Curated feed"}</p>
          </div>

          <a className="pdp__cta" href="/#tailored-redesign">
            Start tailored redesign
          </a>
        </aside>
      </section>
    </main>
  );
}

export default ProductPage;
