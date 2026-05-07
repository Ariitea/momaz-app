import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCatalogProducts } from "../data/catalogClient";

const categories = [
  { label: "all", value: "all" },
  { label: "watches", value: "watches" },
  { label: "bags", value: "bags" },
  { label: "shoes", value: "shoes" },
  { label: "clothes", value: "clothes" },
];

const sortOptions = [
  { label: "Default (relevance)", value: "relevance" },
  { label: "A -> Z", value: "az" },
  { label: "Z -> A", value: "za" },
];

const DEBOUNCE_MS = 200;
const PAGE_SIZE = 24;

const categoryTokens = {
  watches: [
    "watch",
    "watches",
    "rolex",
    "daytona",
    "datejust",
    "submariner",
    "patek",
    "philippe",
    "richard",
    "mille",
    "rm011",
    "rm27",
    "tudor",
    "omega",
    "hublot",
    "audemars",
    "男表",
    "迪通拿",
    "日志型",
  ],
  bags: ["bag", "bags", "handbag", "dior", "chanel", "lv", "louis", "vuitton", "ysl", "prada", "女包"],
  shoes: ["shoe", "shoes", "sneaker", "sneakers", "boot", "boots", "鞋"],
  clothes: [
    "clothes",
    "clothing",
    "jacket",
    "jackets",
    "parka",
    "coat",
    "outerwear",
    "shirt",
    "tee",
    "hoodie",
    "pants",
    "trousers",
    "sweatpants",
    "joggers",
    "衣",
    "裤",
  ],
};

function normalizeSearchText(text = "") {
  return String(text)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function removeChinese(text = "") {
  return text
    .replace(/[\u3400-\u9FFF]+/g, "")
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanTitle(title = "") {
  const cleaned = removeChinese(title);
  if (!cleaned) return "Selected piece";

  const normalized = cleaned
    .replace(/\b(BBF|Factory|Extreme|Reproduction|custom edition|replica|ultimate|highest|version|market|product|classic|sale|hot|new|model|watch|watches|series)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  const modelPatterns = [
    { pattern: /cosmograph\s+daytona|daytona/i, label: "Daytona" },
    { pattern: /date\s*just\s*41|datejust\s*41/i, label: "Datejust 41" },
    { pattern: /date\s*just\s*36|datejust\s*36/i, label: "Datejust 36" },
    { pattern: /date\s*just|datejust/i, label: "Datejust" },
    { pattern: /submariner/i, label: "Submariner" },
    { pattern: /nautilus/i, label: "Nautilus" },
    { pattern: /calatrava/i, label: "Calatrava" },
    { pattern: /rm\s*011|rm011/i, label: "RM 011" },
    { pattern: /rm\s*027|rm27/i, label: "RM 027" },
    { pattern: /big\s*bang/i, label: "Big Bang" },
    { pattern: /sang\s*bleu/i, label: "Big Bang Sang Bleu" },
    { pattern: /royal\s*oak/i, label: "Royal Oak" },
    { pattern: /speedmaster/i, label: "Speedmaster" },
    { pattern: /seamaster/i, label: "Seamaster" },
  ];

  const modelMatch = modelPatterns.find(({ pattern }) => pattern.test(cleaned));
  if (modelMatch) return modelMatch.label;

  const preferred = normalized || cleaned;
  return preferred.length > 28 ? `${preferred.slice(0, 28).trim()}…` : preferred;
}

function cleanCategory(category = "") {
  const cleaned = removeChinese(category);
  return cleaned || "curated";
}

function searchTokens(query = "") {
  return normalizeSearchText(query).split(" ").filter(Boolean);
}

function getProductSearchFields(product = {}) {
  return {
    title: normalizeSearchText(product.title),
    category: normalizeSearchText(product.category),
    brand: normalizeSearchText(product.brand),
  };
}

function productSearchText(product = {}) {
  return [
    product.title,
    product.category,
    product.brand,
    product.name,
    product.sku,
    ...(Array.isArray(product.tags) ? product.tags : []),
  ]
    .map(normalizeSearchText)
    .filter(Boolean)
    .join(" ");
}

function matchesCategory(product, category) {
  if (category === "all") return true;
  const text = productSearchText(product);
  return (categoryTokens[category] || []).some((token) => text.includes(normalizeSearchText(token)));
}

function matchesQuery(product, queryTokens) {
  if (!queryTokens.length) return true;

  const fields = getProductSearchFields(product);
  const merged = [fields.title, fields.category, fields.brand].filter(Boolean).join(" ");
  return queryTokens.every((token) => merged.includes(token));
}

function computeRelevance(product, queryTokens) {
  if (!queryTokens.length) return 0;

  const fields = getProductSearchFields(product);
  const merged = [fields.title, fields.category, fields.brand].filter(Boolean).join(" ");

  return queryTokens.reduce((score, token) => {
    if (!merged.includes(token)) return score;
    if (fields.title.includes(token)) return score + 5;
    if (fields.brand.includes(token)) return score + 3;
    return score + 2;
  }, 0);
}

function sortProducts(products, sortBy, queryTokens) {
  if (sortBy === "az") {
    return [...products].sort((a, b) => cleanTitle(a.title).localeCompare(cleanTitle(b.title)));
  }

  if (sortBy === "za") {
    return [...products].sort((a, b) => cleanTitle(b.title).localeCompare(cleanTitle(a.title)));
  }

  if (!queryTokens.length) return products;

  return [...products].sort((a, b) => {
    const byScore = computeRelevance(b, queryTokens) - computeRelevance(a, queryTokens);
    if (byScore !== 0) return byScore;
    return cleanTitle(a.title).localeCompare(cleanTitle(b.title));
  });
}

function getDisplayIndex(pageIndex, indexOnPage) {
  return String(pageIndex * PAGE_SIZE + indexOnPage + 1).padStart(3, "0");
}

function ProductGrid() {
  const navigate = useNavigate();
  const location = useLocation();
  const { products, loading, error } = useCatalogProducts({ mode: "lite" });
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [pageIndex, setPageIndex] = useState(0);
  const [activeProductId, setActiveProductId] = useState(null);
  const [leavingProductId, setLeavingProductId] = useState(null);
  const [rowY, setRowY] = useState(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false });
  const [isEnteringFromHome, setIsEnteringFromHome] = useState(() => location.state?.entryTransition === "crossfade");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (!location.state?.entryTransition) return undefined;

    const timer = window.setTimeout(() => {
      setIsEnteringFromHome(false);
      window.history.replaceState({}, document.title);
    }, 520);

    return () => window.clearTimeout(timer);
  }, [location.state]);

  const queryTokens = useMemo(() => searchTokens(debouncedQuery), [debouncedQuery]);
  const categoryFilteredProducts = useMemo(
    () => products.filter((product) => matchesCategory(product, activeCategory)),
    [products, activeCategory],
  );
  const searchedProducts = useMemo(
    () => categoryFilteredProducts.filter((product) => matchesQuery(product, queryTokens)),
    [categoryFilteredProducts, queryTokens],
  );
  const filteredProducts = useMemo(
    () => sortProducts(searchedProducts, sortBy, queryTokens),
    [searchedProducts, sortBy, queryTokens],
  );

  const totalResults = filteredProducts.length;
  const pageCount = Math.max(1, Math.ceil(totalResults / PAGE_SIZE));
  const currentPageIndex = Math.min(pageIndex, pageCount - 1);
  const visibleProducts = useMemo(() => {
    const startIndex = currentPageIndex * PAGE_SIZE;
    return filteredProducts.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredProducts, currentPageIndex]);

  const activeProduct = visibleProducts.find((product) => product.id === activeProductId) || visibleProducts[0];
  const activeProductIndex = Math.max(0, visibleProducts.findIndex((product) => product.id === activeProduct?.id));

  const activeImage = activeProduct?.images?.[0] || activeProduct?.image || "";

  function resetInteractionState() {
    setActiveProductId(null);
    setRowY(null);
    setCursor((current) => ({ ...current, visible: false }));
  }

  function clearFilters() {
    setActiveCategory("all");
    setSearchQuery("");
    setDebouncedQuery("");
    setSortBy("relevance");
    setPageIndex(0);
    resetInteractionState();
  }

  function activateProduct(event, productId) {
    const rect = event.currentTarget.getBoundingClientRect();
    setActiveProductId(productId);
    setRowY(rect.top + rect.height / 2);
  }

  function openProduct(productId) {
    setActiveProductId(productId);
    setLeavingProductId(productId);

    window.dispatchEvent(
      new CustomEvent("momaz:catalog-product-transition", {
        detail: { y: rowY || window.innerHeight / 2 },
      }),
    );

    window.setTimeout(() => {
      navigate(`/product/${productId}`);
    }, 80);
  }

  if (loading) return <main className="catalog-page">Loading products...</main>;
  if (error || !products.length) return <main className="catalog-page">Unable to load products.</main>;

  return (
    <main
      className={`catalog-page catalog-page--list ${leavingProductId ? "is-leaving" : ""} ${isEnteringFromHome ? "is-entering" : ""}`}
    >
      <div
        className={`catalog-hover-band ${rowY ? "is-visible" : ""}`}
        style={rowY ? { top: `${rowY}px` } : undefined}
        aria-hidden="true"
      />

      <aside className="catalog-side">
        {categories.map((category) => (
          <button
            key={category.value}
            type="button"
            className={activeCategory === category.value ? "is-active" : undefined}
            onClick={() => {
              setActiveCategory(category.value);
              setPageIndex(0);
              resetInteractionState();
            }}
          >
            {category.label}
          </button>
        ))}
      </aside>

      <section className="catalog-list-panel">
        <div className="catalog-list-panel__bg">{activeImage ? <img key={activeProduct?.id} src={activeImage} alt="" /> : null}</div>

        <header className="catalog-toolbar">
          <label className="catalog-toolbar__search" htmlFor="catalog-search-input">
            <span>Search</span>
            <input
              id="catalog-search-input"
              type="search"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setPageIndex(0);
                resetInteractionState();
              }}
              placeholder="Search title, category, brand"
              autoComplete="off"
            />
          </label>
          <label className="catalog-toolbar__sort" htmlFor="catalog-sort-select">
            <span>Sort</span>
            <select
              id="catalog-sort-select"
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value);
                setPageIndex(0);
                resetInteractionState();
              }}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </header>

        <div className="catalog-results-meta">
          <p>{`${totalResults} result${totalResults === 1 ? "" : "s"}`}</p>
        </div>

        <div
          className="catalog-list"
          onMouseMove={(event) =>
            setCursor({
              x: event.clientX,
              y: event.clientY,
              visible: true,
            })
          }
          onMouseLeave={() => {
            setCursor((current) => ({ ...current, visible: false }));
            setRowY(null);
            setActiveProductId(null);
          }}
        >
          {!visibleProducts.length ? (
            <div className="catalog-empty-state" role="status" aria-live="polite">
              <strong>No results found</strong>
              <button type="button" onClick={clearFilters}>
                Clear filters
              </button>
            </div>
          ) : null}

          {visibleProducts.map((product, index) => (
            <button
              key={product.id}
              type="button"
              className={`catalog-row ${product.id === activeProduct?.id ? "is-active" : ""} ${product.id === leavingProductId ? "is-leaving" : ""}`}
              onMouseEnter={(event) => activateProduct(event, product.id)}
              onFocus={(event) => activateProduct(event, product.id)}
              onClick={() => openProduct(product.id)}
            >
              <span className="catalog-row__index">{getDisplayIndex(currentPageIndex, index)}</span>
              <strong className="catalog-row__title">{cleanTitle(product.title)}</strong>
              <em className="catalog-row__meta">{cleanCategory(product.category)}</em>
            </button>
          ))}
        </div>
      </section>

      {totalResults > PAGE_SIZE ? (
        <nav className="catalog-pagination" aria-label="Catalog pagination">
          <button
            type="button"
            onClick={() => {
              setPageIndex((current) => Math.max(current - 1, 0));
              resetInteractionState();
            }}
            disabled={currentPageIndex === 0}
          >
            Prev
          </button>
          <span>{`${String(currentPageIndex + 1).padStart(2, "0")} / ${String(pageCount).padStart(2, "0")}`}</span>
          <button
            type="button"
            onClick={() => {
              setPageIndex((current) => Math.min(current + 1, pageCount - 1));
              resetInteractionState();
            }}
            disabled={currentPageIndex >= pageCount - 1}
          >
            Next
          </button>
        </nav>
      ) : null}

      <aside className="catalog-right-panel" aria-label="Active product details">
        <span>{String(activeProductIndex + 1).padStart(3, "0")}</span>
        <strong>{cleanTitle(activeProduct?.title)}</strong>
        <em>{cleanCategory(activeProduct?.category)}</em>
        <p>Hover selection / click to open product view</p>
      </aside>

      <div
        key={`preview-${activeProduct?.id || "empty"}`}
        className={`catalog-cursor-preview ${cursor.visible ? "is-visible" : ""}`}
        aria-hidden="true"
        style={{
          left: `${cursor.x}px`,
          top: `${cursor.y}px`,
        }}
      >
        {activeImage ? <img src={activeImage} alt="" /> : null}
      </div>
    </main>
  );
}

export default ProductGrid;
