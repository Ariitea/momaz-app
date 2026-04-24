import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCatalogProducts } from "../data/catalogClient";

function cleanText(text = "") {
  return text
    .replace(/[\u3400-\u9FFF]+/g, "")
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function ProductPage() {
  const { id } = useParams();
  const { products, loading } = useCatalogProducts({ mode: "full" });

  const product = useMemo(
    () => products.find((p) => p.id === id),
    [products, id]
  );

  const railRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const baseImages = product?.images?.length
    ? product.images
    : [product?.image].filter(Boolean);

  // 🔁 triple array (infinite illusion)
  const images = [...baseImages, ...baseImages, ...baseImages];

  // 🎯 center on middle set
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const items = rail.querySelectorAll(".pdp-focus__item");
    if (!items.length) return;

    const itemWidth = items[0].offsetWidth + 90;
    const centerIndex = Math.floor(images.length / 3);

    rail.scrollLeft = centerIndex * itemWidth;
  }, [product?.id]);

  // 🧠 detect center image
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    let raf = null;

    function update() {
      const center = rail.scrollLeft + rail.clientWidth / 2;
      const items = Array.from(
        rail.querySelectorAll(".pdp-focus__item")
      );

      let closest = 0;
      let min = Infinity;

      items.forEach((el, i) => {
        const rect = el.offsetLeft + el.offsetWidth / 2;
        const dist = Math.abs(rect - center);

        if (dist < min) {
          min = dist;
          closest = i;
        }
      });

      setActiveIndex(closest);
    }

    function onScroll() {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);

      // infinite reposition
      const total = rail.scrollWidth;
      const visible = rail.clientWidth;

      if (rail.scrollLeft < visible * 0.5) {
        rail.scrollLeft += total / 3;
      } else if (rail.scrollLeft > total - visible * 1.5) {
        rail.scrollLeft -= total / 3;
      }
    }

    rail.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      rail.removeEventListener("scroll", onScroll);
    };
  }, [product?.id, images.length]);

  if (loading || !product) {
    return <main className="pdp">Loading...</main>;
  }

  const displayTitle = cleanText(product.title) || "Selected piece";
  const displayCategory = cleanText(product.category) || "Curated selection";
  const realImageIndex = baseImages.length ? (activeIndex % baseImages.length) + 1 : 1;

  return (
    <main className="pdp pdp--focus">
      <Link to="/" className="pdp-back">← Back</Link>

      <div className="pdp-focus">
        <div ref={railRef} className="pdp-focus__rail">
          {images.map((img, i) => (
            <div
              key={i}
              className={
                "pdp-focus__item " +
                (i === activeIndex ? "is-active" : "")
              }
            >
              <img src={img} alt="" />
            </div>
          ))}
        </div>

        <aside className="pdp-focus__info">
          <p>{displayCategory}</p>
          <h1>{displayTitle}</h1>
        </aside>

        <aside className="pdp-focus__summary">
          <span>{String(realImageIndex).padStart(2, "0")} / {String(baseImages.length).padStart(2, "0")}</span>
          <a href="/#tailored-redesign">Start tailored redesign</a>
        </aside>
      </div>
    </main>
  );
}
