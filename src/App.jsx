import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProductGrid from "./components/ProductGrid";

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
    </Suspense>
  );
}

export default App;
