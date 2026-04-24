import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Navigation from "./components/Navigation";
import ProductGrid from "./components/ProductGrid";

const ProductPage = lazy(() => import("./pages/ProductPage"));

function App() {
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
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default App;
