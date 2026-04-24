import { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Navigation from "./components/Navigation";
import ProductGrid from "./components/ProductGrid";

const ProductPage = lazy(() => import("./pages/ProductPage"));

function App() {
  const [backTransition, setBackTransition] = useState(false);

  useEffect(() => {
    function onBackTransition() {
      setBackTransition(true);
      window.setTimeout(() => setBackTransition(false), 950);
    }

    window.addEventListener("momaz:pdp-back-transition", onBackTransition);
    return () => window.removeEventListener("momaz:pdp-back-transition", onBackTransition);
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

      {backTransition ? (
        <div className="global-back-transition-layer" aria-hidden="true" />
      ) : null}

      <Analytics />
    </>
  );
}

export default App;
