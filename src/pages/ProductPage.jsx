import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CATALOG_FALLBACK_IMAGES,
  PDP_STORYTELLING_POSTER,
  PDP_STORYTELLING_VIDEO,
} from "../config/premiumAssets";
import { useCatalogProducts } from "../data/catalogClient";
import { optimizeCatalogImageUrl } from "../utils/imageUrl";
import { getCategoryLabel, getDisplayTitle } from "../utils/copy";

const SELECTION_STORAGE_KEY = "momaz.selection.list";

function formatPrice(product) {
  if (!product?.price_amount || product.price_amount === "0.00") {
    return "Price on request";
  }

  return `${product.price_amount} ${product.currency || ""}`.trim();
}

function ProductPage() {
  const { id } = useParams();
  const currentProductId = id || "";
  const { products, loading, error } = useCatalogProducts({ mode: "full" });
  const [size, setSize] = useState("M");
  const [added, setAdded] = useState(false);
  const [storytellingVideoState, setStorytellingVideoState] = useState({
    productId: currentProductId,
    index: 0,
    failed: false,
  });
  const [transitionProgress, setTransitionProgress] = useState(0);
  const rafRef = useRef(0);
  const progressRef = useRef(0);

  const product = useMemo(() => products.find((item) => item.id === id), [products, id]);
  const storytellingVideoIndex =
    storytellingVideoState.productId === currentProductId ? storytellingVideoState.index : 0;
  const storytellingVideoFailed =
    storytellingVideoState.productId === currentProductId ? storytellingVideoState.failed : false;

  useEffect(() => {
    const clamp = (value) => Math.min(1, Math.max(0, value));
    const triggerOffset = 28;
    const transitionDistance = 360;

    const computeTarget = () => {
      if (typeof window === "undefined") {
        return 0;
      }
      const raw = (window.scrollY - triggerOffset) / transitionDistance;
      return clamp(raw);
    };

    const animate = () => {
      const target = computeTarget();
      const current = progressRef.current;
      const next = current + (target - current) * 0.12;
      const snapped = Math.abs(target - next) < 0.001 ? target : next;

      progressRef.current = snapped;
      setTransitionProgress(snapped);

      if (typeof document !== "undefined") {
        document.body.classList.toggle("product-immersive-active", snapped > 0.6);
      }

      if (Math.abs(target - snapped) > 0.001) {
        rafRef.current = window.requestAnimationFrame(animate);
      } else {
        rafRef.current = 0;
      }
    };

    const onScroll = () => {
      if (rafRef.current === 0) {
        rafRef.current = window.requestAnimationFrame(animate);
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
      }
      document.body.classList.remove("product-immersive-active");
    };
  }, []);

  if (loading) {
    return <main className="product-page"><p className="catalog-state">Loading product page...</p></main>;
  }

  if (error) {
    return (
      <main className="product-page">
        <div className="catalog-state catalog-state--error">
          <h1>Catalog unavailable</h1>
          <p>We cannot load the product feed right now. Please try again shortly.</p>
        </div>
        <Link className="product-back" to="/">Back to catalog</Link>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="product-page">
        <div className="catalog-state catalog-state--error">
          <h1>Product unavailable</h1>
          <p>This product is not available in the current catalog feed.</p>
        </div>
        <Link className="product-back" to="/">Back to catalog</Link>
      </main>
    );
  }

  const images = Array.isArray(product.images) && product.images.length > 0 ? product.images : [];
  const frontImageSource = images[0] || CATALOG_FALLBACK_IMAGES[0] || "";
  const frontImage = optimizeCatalogImageUrl(frontImageSource, { width: 920, quality: 76, format: "webp" });
  const sideImage = optimizeCatalogImageUrl(images[1] || images[0] || "", { width: 600, quality: 68, format: "webp" });
  const productTitle = getDisplayTitle(product.title, { fallback: "Untitled product", maxLength: 110 });
  const productCategory = getCategoryLabel(product.category);
  const storytellingVideoCandidates = [product.storytelling_video, product.video, PDP_STORYTELLING_VIDEO]
    .filter((value) => typeof value === "string" && value.trim().length > 0)
    .map((source) => source.trim());
  const activeStorytellingVideo = storytellingVideoCandidates[storytellingVideoIndex] || "";
  const prefersReducedMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const shouldUseStorytellingPoster =
    prefersReducedMotion || storytellingVideoFailed || !activeStorytellingVideo;

  const addToSelection = () => {
    let current = [];
    try {
      const parsed = JSON.parse(localStorage.getItem(SELECTION_STORAGE_KEY) || "[]");
      current = Array.isArray(parsed) ? parsed : [];
    } catch {
      current = [];
    }

    const alreadyExists = current.some((item) => item.id === product.id);
    const next = alreadyExists
      ? current
      : [...current, { id: product.id, title: product.title || "Untitled", size, productUrl: product.product_url || "" }];

    localStorage.setItem(SELECTION_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("momaz-selection-updated"));
    setAdded(true);
  };

  return (
    <main
      className="product-page product-page--immersive"
      style={{ "--immersive-progress": transitionProgress }}
    >
      <section className="product-stage" aria-label="Editorial product stage">
        <div className="product-stage__left">
          <p>{productCategory}</p>
          <h1>{productTitle}</h1>
          <p className="product-stage__description">
            {`${productTitle} belongs to the ${productCategory} collection. This page clarifies the piece and its premium positioning at a glance.`}
          </p>

          <div className="product-stage__sizes">
            { ["XS", "S", "M", "L", "XL"].map((sizeOption) => (
              <button
                key={sizeOption}
                type="button"
                className={sizeOption === size ? "is-active" : ""}
                onClick={() => setSize(sizeOption)}
              >
                {sizeOption}
              </button>
            ))}
          </div>
        </div>

        <div className="product-stage__center">
          {frontImage ? <img src={frontImage} alt={productTitle || "Product visual"} /> : <div className="editorial-card__placeholder" />}
        </div>

        <aside className="product-stage__right">
          <section className="product-storytelling" aria-label="Editorial storytelling media">
            {shouldUseStorytellingPoster ? (
              <img
                src={PDP_STORYTELLING_POSTER}
                alt={`${productTitle} storytelling visual`}
                loading="lazy"
                decoding="async"
              />
            ) : (
              <video
                key={activeStorytellingVideo}
                className="product-storytelling__video product-storytelling__video--immersive"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                poster={PDP_STORYTELLING_POSTER}
                onError={() => {
                  setStorytellingVideoState((current) => {
                    const base =
                      current.productId === currentProductId
                        ? current
                        : { productId: currentProductId, index: 0, failed: false };
                    const next = base.index + 1;

                    if (next < storytellingVideoCandidates.length) {
                      return { productId: currentProductId, index: next, failed: false };
                    }

                    return { productId: currentProductId, index: base.index, failed: true };
                  });
                }}
              >
                <source src={activeStorytellingVideo} type="video/mp4" />
              </video>
            )}
            <p className="product-storytelling__caption">Story sequence</p>
          </section>

          <strong>{formatPrice(product)}</strong>
          <p>Save this piece to your selection list for inquiry.</p>
          <button type="button" onClick={addToSelection}>
            {added ? "Added to selection" : "Add to selection"}
          </button>
          {product.product_url ? (
            <>
              <a href={product.product_url} target="_blank" rel="noreferrer">
                View external source
              </a>
              <p className="product-stage__source-note">The source link opens the origin site in a new tab.</p>
            </>
          ) : (
            <p className="product-stage__source-note" role="status">
              No external source is available for this product.
            </p>
          )}
        </aside>

        <div className="product-stage__blur product-stage__blur--left" aria-hidden="true">
          {sideImage ? <img src={sideImage} alt="" /> : null}
        </div>
        <div className="product-stage__blur product-stage__blur--right" aria-hidden="true">
          {sideImage ? <img src={sideImage} alt="" /> : null}
        </div>
      </section>

      <Link className="product-back" to="/">Back to catalog</Link>
    </main>
  );
}

export default ProductPage;
