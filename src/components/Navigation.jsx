import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function Navigation() {
  const location = useLocation();
  const isProductPage = location.pathname.startsWith("/product/");
  const [isDarkSystem, setIsDarkSystem] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setIsDarkSystem(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const variant = isProductPage
    ? isDarkSystem ? "dark-product" : "light-product"
    : isDarkSystem ? "dark-home" : "light-home";

  return (
    <header className={`momaz-nav momaz-nav--${variant}`}>
      <Link className="momaz-nav__brand" to="/">MOMAZ™</Link>

      <div className="momaz-nav__group">
        <a href="/#about">About</a>
        <span>Paris</span>
        <span>48.8566° N, 2.3522° E</span>
      </div>

      <nav className="momaz-nav__group momaz-nav__center">
        <a href="/#catalog">Catalog</a>
        <a href="/#clothes">Clothes</a>
        <a href="/#shoes">Shoes</a>
        <a href="/#bags">Bags</a>
        <a href="/#watches">Watches</a>
      </nav>

      <div className="momaz-nav__group">
        <a href="/#drops">Drops</a>
        <a href="/#new">New</a>
        <a href="/#archive">Archive</a>
      </div>

      <label className="reference-nav__search" htmlFor="reference-nav-search">
        <input
          id="reference-nav-search"
          type="search"
          placeholder="Search"
          autoComplete="off"
          aria-label="Search catalog"
        />
      </label>

      <div className="momaz-nav__group momaz-nav__right">
        <a href="/#bag">Bag 0</a>
        <a href="/#account">Account</a>
      </div>
    </header>
  );
}

export default Navigation;
