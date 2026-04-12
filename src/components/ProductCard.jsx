import { Link } from "react-router-dom";

function formatPrice(product) {
  if (!product.price_amount || product.price_amount === "0.00") {
    return "Price on request";
  }

  return `${product.price_amount} ${product.currency || ""}`.trim();
}

function ProductCard({ product }) {
  const imageSrc =
    product.images?.[0] || "https://via.placeholder.com/500x500?text=No+Image";

  const category = product.category || "Uncategorized";
  const title = product.title || "Untitled product";

  return (
    <Link to={`/product/${product.id}`} className="product-card-link">
      <article className="product-card">
        <div className="product-card__media">
          <img
            className="product-card__image"
            src={imageSrc}
            alt={title}
            loading="lazy"
          />
          <span className="product-card__badge">{category}</span>
        </div>

        <div className="product-card__content">
          <h3 className="product-card__title">{title}</h3>
          <p className="product-card__meta">SKU: {product.sku || "default"}</p>
          <p className="product-card__price">{formatPrice(product)}</p>
          <span className="product-card__cta">View details</span>
        </div>
      </article>
    </Link>
  );
}

export default ProductCard;
