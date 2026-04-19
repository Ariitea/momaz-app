import { useEffect, useMemo, useState } from "react";
import heroImage from "../assets/hero.png";
import { useLocation, useSearchParams } from "react-router-dom";
import ProductCard from "./ProductCard";
import { useCatalogProducts } from "../data/catalogClient";

const PAGE_SIZE = 12;
const SORT_DEFAULT = "updated_desc";

function ProductGrid() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const { products, loading, error } = useCatalogProducts({ mode: "lite" });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState(SORT_DEFAULT);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const categories = useMemo(() => {
    const map = new Map();
    products.forEach((p) => {
      const cat = p.category || "Sans categorie";
      map.set(cat, (map.get(cat) || 0) + 1);
    });

    return [
      { value: "all", label: "Toutes les categories", count: products.length },
      ...Array.from(map.entries()).map(([value, count]) => ({ value, label: value, count })),
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const text = (p.title || "").toLowerCase();
      const search = searchTerm.toLowerCase();
      const matchSearch = !search || text.includes(search);
      const matchCat = selectedCategory === "all" || p.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [products, searchTerm, selectedCategory]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  if (loading) return <main className="app-shell">Chargement...</main>;
  if (error) return <main className="app-shell">Erreur</main>;

  return (
    <main className="app-shell">

      {/* HERO IMMERSIF TYPE CARTIER */}
      <section className="hero-v2">
        <img src={heroImage} className="hero-v2__bg" />
        <div className="hero-v2__overlay" />

        <div className="hero-v2__content">
          <p className="hero-v2__kicker">MOMAZ COLLECTION</p>

          <h1>
            Curated objects.
            <br />
            Editorial presence.
          </h1>

          <p>
            Une approche editoriale du catalogue. Chaque piece est selectionnee
            pour son impact visuel et sa lecture.
          </p>

          <div className="hero-v2__cta">
            <a href="#catalog">Explorer</a>
          </div>
        </div>
      </section>


      {/* SECTION IMMERSIVE TYPE OAP / WRK */}
      <section className="story-block">
        <div className="story-block__left">
          <h2>Une experience avant un catalogue</h2>
          <p>
            On ne presente pas simplement des produits.
            On construit une narration visuelle avant la selection.
          </p>
        </div>

        <div className="story-block__right">
          <div className="story-card">01 — Selection</div>
          <div className="story-card">02 — Exploration</div>
          <div className="story-card">03 — Conversion</div>
        </div>
      </section>


      {/* FEATURE STRIP TYPE LUXE */}
      <section className="featured-v2">
        <h2>Focus pieces</h2>

        <div className="featured-v2__grid">
          {filteredProducts.slice(0, 3).map((p, i) => (
            <ProductCard key={p.id} product={p} variant="feature" />
          ))}
        </div>
      </section>


      {/* CATALOGUE */}
      <section id="catalog" className="catalog-v2">

        <div className="catalog-v2__header">
          <h2>Catalogue</h2>
          <span>{filteredProducts.length} produits</span>
        </div>

        <div className="catalog-v2__filters">
          <input
            placeholder="Recherche"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select onChange={(e) => setSelectedCategory(e.target.value)}>
            {categories.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <div className="catalog-v2__grid">
          {visibleProducts.map((p, i) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {visibleCount < filteredProducts.length && (
          <button onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}>
            Load more
          </button>
        )}
      </section>

    </main>
  );
}

export default ProductGrid;