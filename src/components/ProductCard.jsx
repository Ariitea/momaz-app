import { Link } from "react-router-dom";
import { prefetchFullCatalogProducts } from "../data/catalogClient";
import { optimizeCatalogImageUrl } from "../utils/imageUrl";

function formatPrice(product) {
  if (!product.price_amount || product.price_amount === "0.00") {
    return "Prix sur demande";
  }

  return `${product.price_amount} ${product.currency || ""}`.trim();
}

function ProductCard({
  product,
  linkSearch = "",
  onNavigateToProduct,
  motionIndex = 0,
}) {
  const imageSrc = product.image || product.images?.[0] || "https://via.placeholder.com/500x500?text=No+Image";
  const optimizedImageSrc = optimizeCatalogImageUrl(imageSrc, {
    width: 560,
    quality: 68,
    format: "webp",
  });

  const category = product.category || "Sans categorie";
  const title = product.title || "Produit sans titre";
  const availability = product.availability || "A confirmer";
  const sku = product.sku || "default";

  return (
    <Link
      to={{
        pathname: `/product/${product.id}`,
        search: linkSearch,
      }}
      className="product-card-link"
      style={{ "--card-index": String(motionIndex) }}
      onClick={onNavigateToProduct}
      onMouseEnter={prefetchFullCatalogProducts}
      onFocus={prefetchFullCatalogProducts}
      aria-label={`Ouvrir la fiche produit ${title}`}
    >
      <article className="product-card">
        <div className="product-card__media">
          <img
            className="product-card__image"
            src={optimizedImageSrc}
            alt={title}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            width="560"
            height="700"
          />
          <span className="product-card__badge">{category}</span>
        </div>

        <div className="product-card__content">
          <h3 className="product-card__title">{title}</h3>

          <div className="product-card__chips" aria-label="Metadonnees produit">
            <span>SKU {sku}</span>
            <span>{availability}</span>
          </div>

          <p className="product-card__price">{formatPrice(product)}</p>
          <span className="product-card__meta">ID {product.id}</span>
          <span className="product-card__cta">Voir la fiche complete</span>
        </div>
      </article>
    </Link>
  );
}

export default ProductCard;
