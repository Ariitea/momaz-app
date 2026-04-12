import { useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useCatalogProducts } from "../data/catalogClient";
import { optimizeCatalogImageUrl } from "../utils/imageUrl";

function formatPrice(product) {
  if (!product.price_amount || product.price_amount === "0.00") {
    return "Prix sur demande";
  }

  return `${product.price_amount} ${product.currency || ""}`.trim();
}

function ProductPage() {
  const { id } = useParams();
  const location = useLocation();
  const { products, loading, error } = useCatalogProducts({ mode: "full" });
  const product = products.find((item) => item.id === id);
  const backSearch = location.search;

  const [galleryState, setGalleryState] = useState({
    productId: id,
    activeImageIndex: 0,
  });

  const relatedProducts = useMemo(() => {
    if (!product) {
      return [];
    }

    return products
      .filter(
        (item) =>
          item.id !== product.id &&
          (item.category || "Sans categorie") ===
            (product.category || "Sans categorie")
      )
      .sort((left, right) => (right.updated_at_unix_ms || 0) - (left.updated_at_unix_ms || 0))
      .slice(0, 4);
  }, [products, product]);

  if (loading) {
    return (
      <main className="app-shell">
        <p className="empty-state">Chargement de la fiche produit...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="app-shell">
        <div className="detail-not-found" role="alert">
          <h1>Catalogue indisponible</h1>
          <p>
            Impossible de charger le flux produit pour le moment. Reessayez dans
            quelques secondes.
          </p>
          <Link
            className="detail-back-link"
            to={{
              pathname: "/",
              search: backSearch,
            }}
            state={{ restoreCatalogScroll: true }}
          >
            Retour au catalogue
          </Link>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="app-shell">
        <div className="detail-not-found" role="alert">
          <h1>Produit introuvable</h1>
          <p>Ce produit n&apos;est pas disponible dans le flux catalogue actuel.</p>
          <Link
            className="detail-back-link"
            to={{
              pathname: "/",
              search: backSearch,
            }}
            state={{ restoreCatalogScroll: true }}
          >
            Retour au catalogue
          </Link>
        </div>
      </main>
    );
  }

  const images = product.images?.length
    ? product.images
    : ["https://via.placeholder.com/700x700?text=No+Image"];

  const activeImageIndex =
    galleryState.productId === id ? galleryState.activeImageIndex : 0;
  const safeImageIndex = Math.min(activeImageIndex, images.length - 1);
  const activeImage = optimizeCatalogImageUrl(images[safeImageIndex], {
    width: 1200,
    quality: 80,
    format: "webp",
  });

  const updateActiveImage = (nextIndex) => {
    const boundedIndex = Math.max(0, Math.min(images.length - 1, nextIndex));
    setGalleryState({
      productId: id,
      activeImageIndex: boundedIndex,
    });
  };

  const handleThumbnailKeyDown = (event, index) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      updateActiveImage(index === images.length - 1 ? 0 : index + 1);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      updateActiveImage(index === 0 ? images.length - 1 : index - 1);
    }

    if (event.key === "Home") {
      event.preventDefault();
      updateActiveImage(0);
    }

    if (event.key === "End") {
      event.preventDefault();
      updateActiveImage(images.length - 1);
    }
  };

  return (
    <main className="app-shell">
      <section className="product-detail">
        <div className="product-detail__nav">
          <Link
            className="detail-back-link"
            to={{
              pathname: "/",
              search: backSearch,
            }}
            state={{ restoreCatalogScroll: true }}
          >
            Retour au catalogue
          </Link>
          <span className="detail-id">ID: {product.id}</span>
        </div>

        <header className="product-detail__headline">
          <p>{product.category || "Sans categorie"}</p>
          <h1>{product.title || "Produit sans titre"}</h1>
          <strong>{formatPrice(product)}</strong>
        </header>

        <div className="product-detail__layout">
          <section className="product-gallery" aria-label="Galerie produit">
            <img
              key={activeImage}
              className="product-gallery__main"
              src={activeImage}
              alt={`${product.title || "Produit"} visuel principal`}
              decoding="async"
              fetchPriority="high"
            />
            {images.length > 1 && (
              <ul className="product-gallery__thumbs" aria-label="Miniatures produit">
                {images.map((image, index) => (
                  <li key={image}>
                    <button
                      type="button"
                      className={`product-gallery__thumb ${
                        index === safeImageIndex ? "is-active" : ""
                      }`}
                      onClick={() => updateActiveImage(index)}
                      onKeyDown={(event) => handleThumbnailKeyDown(event, index)}
                      aria-label={`Afficher l'image ${index + 1}`}
                      aria-current={index === safeImageIndex ? "true" : undefined}
                    >
                      <img
                        src={optimizeCatalogImageUrl(image, {
                          width: 180,
                          quality: 62,
                          format: "webp",
                        })}
                        alt={`${product.title || "Produit"} miniature ${index + 1}`}
                        loading="lazy"
                        decoding="async"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <article className="product-detail__panel" aria-label="Narration produit">
            <section className="product-detail__block">
              <h2>1. Identite</h2>
              <p>
                {product.title || "Produit sans titre"} appartient a la collection{" "}
                {product.category || "Sans categorie"}. Cette fiche clarifie la piece et
                son positionnement premium en un seul regard.
              </p>
            </section>

            <section className="product-detail__block">
              <h2>2. Attributs</h2>
              <dl className="product-detail__meta">
                <div>
                  <dt>Disponibilite</dt>
                  <dd>{product.availability || "A confirmer"}</dd>
                </div>
                <div>
                  <dt>SKU</dt>
                  <dd>{product.sku || "default"}</dd>
                </div>
                <div>
                  <dt>Devise</dt>
                  <dd>{product.currency || "N/A"}</dd>
                </div>
                <div>
                  <dt>Collection</dt>
                  <dd>{product.category || "Sans categorie"}</dd>
                </div>
              </dl>
            </section>

            <section className="product-detail__block">
              <h2>3. Action</h2>
              {product.product_url ? (
                <a
                  className="product-detail__source"
                  href={product.product_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Ouvrir la source externe pour ${product.title || "ce produit"} (nouvel onglet)`}
                >
                  Voir la source externe
                </a>
              ) : (
                <p className="product-detail__source-note" role="status">
                  Aucune source externe disponible pour ce produit.
                </p>
              )}
              <p className="product-detail__source-note">
                Le lien source ouvre le site d&apos;origine dans un nouvel onglet.
              </p>
            </section>
          </article>
        </div>
      </section>

      <section className="related-products" aria-label="Produits similaires">
        <div className="related-products__heading">
          <h2>Selection associee</h2>
          <p aria-live="polite" role="status">
            {relatedProducts.length > 0
              ? "Pieces issues de la meme collection, triees par mise a jour recente."
              : "Aucun autre produit disponible dans cette collection."}
          </p>
        </div>

        {relatedProducts.length > 0 && (
          <div className="products-grid">
            {relatedProducts.map((item, index) => (
              <ProductCard
                key={item.id}
                product={item}
                linkSearch={location.search}
                motionIndex={index}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default ProductPage;
