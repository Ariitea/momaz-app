import { Link, useLocation } from "react-router-dom";

function Navigation() {
  const location = useLocation();
  const isProductPage = location.pathname.startsWith("/product/");

  return (
    <header
      className={`reference-nav ${isProductPage ? "reference-nav--product" : ""}`}
      aria-label="Primary navigation"
    >
      <Link className="reference-nav__brand" to="/">
        MOMAZ™
      </Link>

      <div className="reference-nav__group">
        <a href="/#about">About</a>
        <span>Paris</span>
        <span className="reference-nav__coords">48.8566° N, 2.3522° E</span>
      </div>

      <nav className="reference-nav__group reference-nav__catalog" aria-label="Catalog">
        <a href="/#catalog">Catalog</a>
        <a href="/#clothes">Clothes</a>
        <a href="/#shoes">Shoes</a>
        <a href="/#bags">Bags</a>
        <a href="/#watches">Watches</a>
      </nav>

      <div className="reference-nav__group">
        <a href="/#drops">Drops</a>
        <a href="/#new">New</a>
        <a href="/#archive">Archive</a>
      </div>

      <div className="reference-nav__group reference-nav__right">
        <a href="/#bag">Bag 0</a>
        <a href="/#account">Account</a>
      </div>
    </header>
  );
}

export default Navigation;
