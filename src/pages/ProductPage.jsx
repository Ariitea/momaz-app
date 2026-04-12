import { Link, useParams } from "react-router-dom";
import productsData from "../data/products.json";

function ProductPage() {
  const { id } = useParams();
  const products = productsData.products || [];

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <main className="app-shell">
        <p>Product not found.</p>
        <Link to="/">Back to catalog</Link>
      </main>
    );
  }

  const imageSrc =
    product.images?.[0] || "https://via.placeholder.com/600x600?text=No+Image";

  const displayPrice =
    !product.price_amount || product.price_amount === "0.00"
      ? "Price on request"
      : `${product.price_amount} ${product.currency || ""}`;

  return (
    <main className="app-shell">
      <Link to="/">← Back to catalog</Link>

      <div style={{ marginTop: "20px" }}>
        <img
          src={imageSrc}
          alt={product.title || "Product image"}
          style={{
            width: "100%",
            maxWidth: "500px",
            borderRadius: "12px",
            display: "block",
            marginBottom: "20px",
          }}
        />

        <h1>{product.title || "Untitled product"}</h1>
        <p>{product.category || "Uncategorized"}</p>
        <p>{displayPrice}</p>
        <p>ID: {product.id}</p>

        {product.product_url && (
          <a href={product.product_url} target="_blank" rel="noreferrer">
            View original product
          </a>
        )}
      </div>
    </main>
  );
}

export default ProductPage;