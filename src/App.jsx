import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProductGrid from "./components/ProductGrid";

const ProductPage = lazy(() => import("./pages/ProductPage"));

function App() {
  return (
    <Layout>
      <Suspense fallback={<p className="app-loading">Loading MOMAZ experience...</p>}>
        <Routes>
          <Route path="/" element={<ProductGrid />} />
          <Route path="/product/:id" element={<ProductPage />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;
