import { useEffect, useMemo, useState } from "react";
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

function ProductCard({ product, variant = "default" }) {
  const imageCandidates = useMemo(
    () =>
      buildCatalogImageCandidates(product).map((source) =>
        optimizeCatalogImageUrl(source, { width: 820, quality: 68, format: "webp" })
      ),
    [product]
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const title = getDisplayTitle(product.title, { fallback: "Untitled", maxLength: 64 });
  const category = getCategoryLabel(product.category);
  const imageSrc = imageCandidates[activeImageIndex] || "";

  useEffect(() => {
    setActiveImageIndex(0);
  }, [product.id]);

  return (
    <Link to={`/product/${product.id}`} className={`editorial-card editorial-card--${variant}`}>
      <article>
        <div className="editorial-card__media">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={title}
              loading="lazy"
              decoding="async"
              onError={() => {
                setActiveImageIndex((current) => {
                  const next = current + 1;
                  return next < imageCandidates.length ? next : current;
                });
              }}
            />
          ) : (
            <div className="editorial-card__placeholder" aria-hidden="true" />
          )}
        </div>

        <div className="editorial-card__reveal">
          <p>{category}</p>
          <h2>{title}</h2>
          <strong>{formatPrice(product)}</strong>
          <p className="editorial-card__meta">{`ID ${product.id || "N/A"}`}</p>
          <span className="editorial-card__cta">View full profile</span>
        </div>
      </article>
    </Link>
  );
}

export default ProductCard;
