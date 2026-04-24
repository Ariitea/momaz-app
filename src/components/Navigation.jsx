import { Link } from "react-router-dom";

const categories = ["New", "Clothes", "Shoes", "Bags", "Accessories", "Watches"];

function Navigation() {
  return (
    <header className="site-nav" aria-label="Primary navigation">
      <Link className="site-nav__logo" to="/">MOMAZ</Link>

      <nav className="site-nav__categories" aria-label="Categories">
        {categories.map((category) => (
          <a key={category} href={`/#${category.toLowerCase()}`}>
            {category}
          </a>
        ))}
      </nav>

      <div className="site-nav__actions">
        <a href="/#selection">Selection</a>
        <a href="/#tailored-redesign">Apply</a>
      </div>
    </header>
  );
}

export default Navigation;
