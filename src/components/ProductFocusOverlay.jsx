import { useEffect } from "react";
import { Link } from "react-router-dom";
import { buildCatalogImageCandidates } from "../config/premiumAssets";
import { optimizeCatalogImageUrl } from "../utils/imageUrl";
import { getCategoryLabel, getDisplayTitle } from "../utils/copy";

function formatPrice(product) {
  if (!product?.price_amount || product.price_amount === "0.00") {
    return "Price on request";
  }

  return `${product.price_amount} ${product.currency || ""}`.trim();
}

function ProductFocusOverlay({ product, onClose, onOpenDetail }) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  if (!product) {
    return null;
  }

  const title = getDisplayTitle(product.title, { fallback: "Untitled", maxLength: 100 });
  const category = getCategoryLabel(product.category);
  const images = buildCatalogImageCandidates(product)
    .slice(0, 4)
    .map((source, index) => ({
      id: `${product.id}-${index}`,
      src: optimizeCatalogImageUrl(source, {
        width: index === 0 ? 1440 : 960,
        quality: 76,
        format: "webp",
      }),
    }));

  const heroImage = images[0];
  const gallery = images.slice(1);

  return (
    <section
      className="focus-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} focus mode`}
    >
      <button type="button" className="focus-overlay__close" onClick={onClose}>
        Close
      </button>

      <div className="focus-overlay__media">
        {heroImage ? (
          <figure className="focus-overlay__hero">
            <img src={heroImage.src} alt={title} loading="lazy" decoding="async" />
          </figure>
        ) : null}

        <div className="focus-overlay__gallery">
          {gallery.map((image) => (
            <figure key={image.id}>
              <img src={image.src} alt={title} loading="lazy" decoding="async" />
            </figure>
          ))}
        </div>
      </div>

      <div className="focus-overlay__details">
        <p>{category}</p>
        <h2>{title}</h2>
        <strong>{formatPrice(product)}</strong>
        <p>{`Edition ${product.sku || "N/A"} · Reference ${product.id || "N/A"}`}</p>
        <div className="focus-overlay__actions">
          <Link to={`/product/${product.id}`} onClick={onOpenDetail}>
            Open full product detail
          </Link>
          <button type="button" onClick={onClose}>
            Return to stream
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProductFocusOverlay;
