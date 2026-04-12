import ProductGrid from "./components/ProductGrid";
import "./index.css";

function App() {
  return (
    <main className="app-shell">
      <header className="app-header">
        <h1>Momaz Catalog</h1>
        <p>Imported product catalog</p>
      </header>

      <ProductGrid />
    </main>
  );
}

export default App;