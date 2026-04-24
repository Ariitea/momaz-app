import { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Navigation from "./components/Navigation";
import ProductGrid from "./components/ProductGrid";

const ProductPage = lazy(() => import("./pages/ProductPage"));

function App() {
  const location = useLocation();
  const [transition, setTransition] = useState(null);

  useEffect(() => {
    document.body.classList.toggle("route-product", location.pathname.startsWith("/product/"));
    document.body.classList.toggle("route-home", location.pathname === "/");

    return () => {
      document.body.classList.remove("route-product", "route-home");
    };
  }, [location.pathname]);

  useEffect(() => {
    function onBackTransition() {
      setTransition({ type: "back", y: "50vh" });
      window.setTimeout(() => setTransition(null), 1100);
    }

    function onProductTransition(event) {
      setTransition({
        type: "product",
        y: `${event.detail?.y || window.innerHeight / 2}px`,
      });
      window.setTimeout(() => setTransition(null), 1100);
    }

    window.addEventListener("momaz:pdp-back-transition", onBackTransition);
    window.addEventListener("momaz:catalog-product-transition", onProductTransition);

    return () => {
      window.removeEventListener("momaz:pdp-back-transition", onBackTransition);
      window.removeEventListener("momaz:catalog-product-transition", onProductTransition);
    };
  }, []);

  return (
    <>
      <Navigation />
      <Suspense
        fallback={
          <main className="page-shell">
            <p className="empty-state">Chargement...</p>
          </main>
        }
      >
        <Routes>
          <Route path="/" element={<ProductGrid />} />
          <Route path="/product/:id" element={<ProductPage />} />
        </Routes>
      </Suspense>

      {transition ? (
        <div
          className={`momaz-transition-layer momaz-transition-layer--${transition.type}`}
          style={{ "--transition-y": transition.y }}
          aria-hidden="true"
        />
      ) : null}

      <Analytics />
    </>
  );
}

export default App;
