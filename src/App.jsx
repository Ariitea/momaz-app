import { Routes, Route } from "react-router-dom";
import ProductGrid from "./components/ProductGrid";
import ProductPage from "./pages/ProductPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ProductGrid />} />
      <Route path="/product/:id" element={<ProductPage />} />
    </Routes>
  );
}

export default App;