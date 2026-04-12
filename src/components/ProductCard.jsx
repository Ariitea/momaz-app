import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const imageSrc =
    product.images?.[0] || "https://via.placeholder.com/400x400?text=No+Image";

  const displayPrice =
    !product.price_amount || product.price_amount === "0.00"
      ? "Price on request"
      : `${product.price_amount} ${product.currency || ""}`;

  return (
    <Link to={`/product/${product.id}`} className="product-card-link">
      <article className="product-card">
        <img
          className="product-card__image"
          src={imageSrc}
          alt={product.title || "Product image"}
          loading="lazy"
        />

        <div className="product-card__content">
          <h3 className="product-card__title">
            {product.title || "Untitled product"}
          </h3>

          <p className="product-card__category">
            {product.category || "Uncategorized"}
          </p>

          <p className="product-card__price">{displayPrice}</p>
        </div>
      </article>
    </Link>
  );
}

export default ProductCard;