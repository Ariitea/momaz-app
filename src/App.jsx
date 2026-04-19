import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProductGrid from "./components/ProductGrid";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

const ProductPage = lazy(() => import("./pages/ProductPage"));

function App() {
  return (
    <Suspense
      fallback={
        <main className="app-shell">
          <p className="empty-state">Chargement de la page produit...</p>
        </main>
      }
    >
      <Routes>
        <Route path="/" element={<ProductGrid />} />
        <Route path="/product/:id" element={<ProductPage />} />
      </Routes>
      <Analytics />
      <SpeedInsights />
    </Suspense>
  );
}

export default App;
