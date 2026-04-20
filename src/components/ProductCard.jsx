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

function resolvePrimaryImage(product) {
  const firstCandidate = buildCatalogImageCandidates(product)[0] || "";
  return firstCandidate
    ? optimizeCatalogImageUrl(firstCandidate, {
        width: 1400,
        quality: 74,
        format: "webp",
      })
    : "";
}

function ProductCard({ product, layout = "portrait", onFocus }) {
  const title = getDisplayTitle(product?.title, { fallback: "Untitled", maxLength: 84 });
  const category = getCategoryLabel(product?.category);
  const image = resolvePrimaryImage(product);

  return (
    <article className={`scene-tile scene-tile--${layout}`}>
      <div className="scene-tile__media">
        {image ? (
          <img src={image} alt={title} loading="lazy" decoding="async" />
        ) : (
          <div className="scene-tile__placeholder" aria-hidden="true" />
        )}
      </div>
      <div className="scene-tile__veil" aria-hidden="true" />
      <div className="scene-tile__content">
        <p className="scene-tile__category">{category}</p>
        <h3>{title}</h3>
        <strong>{formatPrice(product)}</strong>
        <p className="scene-tile__meta">{`SKU ${product?.sku || "N/A"}`}</p>
        <div className="scene-tile__actions">
          <button type="button" onClick={() => onFocus(product)}>
            Enter focus
          </button>
          <Link to={`/product/${product.id}`}>Open detail</Link>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
