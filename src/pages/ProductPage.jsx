import { useEffect, useMemo, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { CATALOG_FALLBACK_IMAGES } from "../config/premiumAssets";
import { useCatalogProducts } from "../data/catalogClient";
import { optimizeCatalogImageUrl } from "../utils/imageUrl";
import { getCategoryLabel, getDisplayTitle } from "../utils/copy";

function formatPrice(product) {
  if (!product?.price_amount || product.price_amount === "0.00") {
    return "Price upon request";
  }

  return `${product.price_amount} ${product.currency || ""}`.trim();
}

function getAvailabilityLabel(rawAvailability) {
  const normalized = typeof rawAvailability === "string"
    ? rawAvailability.replaceAll("_", " ").trim().toLowerCase()
    : "";

  if (!normalized || normalized === "unknown") {
    return "Selected edition";
  }

  return normalized;
}

function ProductPage() {
  const { id } = useParams();
  const { products, loading, error } = useCatalogProducts({ mode: "full" });
  const product = useMemo(() => products.find((item) => item.id === id), [products, id]);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!rootRef.current) {
      return undefined;
    }

    const sceneNodes = rootRef.current.querySelectorAll("[data-story-scene]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-active");
          } else {
            entry.target.classList.remove("is-active");
          }
        });
      },
      {
        threshold: 0.55,
      },
    );

    sceneNodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [product?.id]);

  if (loading) {
    return (
      <main className="product-story" aria-label="Product storytelling page">
        <section className="catalog-state" role="status">
          <h1>Loading product chapter</h1>
          <p>Preparing immersive scenes.</p>
        </section>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="product-story" aria-label="Product storytelling page">
        <section className="catalog-state catalog-state--error" role="alert">
          <h1>Product unavailable</h1>
          <p>This piece could not be loaded.</p>
          <Link to="/">Return to sequence</Link>
        </section>
      </main>
    );
  }

  const title = getDisplayTitle(product.title, { fallback: "Untitled product", maxLength: 110 });
  const category = getCategoryLabel(product.category);
  const price = formatPrice(product);
  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image, ...CATALOG_FALLBACK_IMAGES].filter(Boolean);

  const heroImage = optimizeCatalogImageUrl(images[0] || "", {
    width: 1800,
    quality: 76,
    format: "webp",
  });

  const detailImages = images.slice(1, 4).map((source) =>
    optimizeCatalogImageUrl(source || "", {
      width: 1320,
      quality: 72,
      format: "webp",
    }),
  ).filter(Boolean);

  return (
    <main ref={rootRef} className="product-story" aria-label="Immersive product storytelling page">
      <section className="product-story__hero" data-story-scene>
        <div className="product-story__hero-media" aria-hidden="true">
          {heroImage ? <img src={heroImage} alt="" /> : <div className="catalog-scene__fallback" />}
        </div>
        <div className="product-story__veil" />

        <article className="product-story__hero-copy">
          <Link to="/" className="product-story__back">Back to sequence</Link>
          <p>{category}</p>
          <h1>{title}</h1>
          <strong>{price}</strong>
        </article>
      </section>

      <section className="product-story__chapter product-story__chapter--material" data-story-scene>
        <article>
          <h2>Material expression</h2>
          <p>
            Focus on silhouette, finish, and presence. The storytelling remains vertical and
            uninterrupted so attention stays on one object at a time.
          </p>
          <p>
            Availability: {getAvailabilityLabel(product.availability)}
          </p>
        </article>
      </section>

      {detailImages.map((source, index) => (
        <section
          key={`${product.id}-detail-${index}`}
          className={`product-story__frame ${index % 2 === 0 ? "product-story__frame--anchored" : "product-story__frame--offset"}`}
          data-story-scene
        >
          <figure>
            <img src={source} alt="" loading="lazy" decoding="async" />
          </figure>
        </section>
      ))}

      <section className="product-story__action product-story__action--finale" data-story-scene>
        <article>
          <h2>Start tailored redesign</h2>
          <p>Return to the sequence and begin your tailored redesign path.</p>
          <Link to="/#tailored-redesign">Start tailored redesign</Link>
        </article>
      </section>
    </main>
  );
}

export default ProductPage;
