import { Link } from "react-router-dom";

const navItems = [
  "New",
  "Clothes",
  "Shoes",
  "Bags",
  "Accessories",
  "Watches",
  "Archive",
];

function Navigation() {
  return (
    <header className="apple-nav" aria-label="Primary navigation">
      <div className="apple-nav__inner">
        <Link className="apple-nav__brand" to="/" aria-label="Momaz home">
          MOMAZ
        </Link>

        <nav className="apple-nav__menu">
          {navItems.map((item) => (
            <a key={item} href={`/#${item.toLowerCase()}`}>
              {item}
            </a>
          ))}
        </nav>

        <div className="apple-nav__actions">

          {/* SEARCH ICON */}
          <a href="/#search" aria-label="Search" className="apple-icon">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5"/>
              <line x1="16.65" y1="16.65" x2="21" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </a>

          {/* BAG ICON */}
          <a href="/#bag" aria-label="Bag" className="apple-icon">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
              <path d="M6 7h12l-1 13H7L6 7z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M9 7a3 3 0 016 0" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          </a>

        </div>
      </div>
    </header>
  );
}

export default Navigation;
