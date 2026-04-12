import { Routes, Route } from "react-router-dom";
import ProductGrid from "./components/ProductGrid";
import ProductPage from "./pages/ProductPage";

function App() {
  return (
    <main className="app-shell">
      <Routes>
        <Route path="/" element={<ProductGrid />} />
        <Route path="/product/:id" element={<ProductPage />} />
      </Routes>
    </main>
  );
}

export default App;