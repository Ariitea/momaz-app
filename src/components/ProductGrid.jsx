import { Link } from "react-router-dom";
import { useCatalogProducts } from "../data/catalogClient";

function ProductGrid() {
  const { products, loading, error } = useCatalogProducts({ mode: "lite" });

  if (loading) {
    return (
      <main className="catalog">
        <p>Loading products...</p>
      </main>
    );
  }

  if (error || !products?.length) {
    return (
      <main className="catalog">
        <p>Unable to load products.</p>
      </main>
    );
  }

  return (
    <main className="catalog">
      <section className="catalog-grid">
        {products.slice(0, 20).map((product) => {
          const image =
            product?.images?.[0] ||
            product?.image ||
            "";

          return (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="catalog-item"
            >
              <div className="catalog-item__media">
                {image ? (
                  <img src={image} alt={product.title} />
                ) : (
                  <div className="catalog-item__placeholder" />
                )}
              </div>

              <div className="catalog-item__info">
                <h3>{product.title}</h3>
                <p>{product.price_amount || "—"} {product.currency || ""}</p>
              </div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}

export default ProductGrid;
