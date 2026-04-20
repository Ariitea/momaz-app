import { Link, useLocation } from "react-router-dom";

function Navigation() {
  const location = useLocation();
  const isSceneFlow = location.pathname === "/";

  return (
    <header className="site-nav" aria-label="Primary navigation">
      <Link className="site-nav__icon-button" to="/" aria-label="Go to scene home">
        <span aria-hidden="true">⌂</span>
      </Link>

      <Link className="site-nav__logo" to="/">
        MOMAZ
      </Link>

      <div className="site-nav__actions">
        {isSceneFlow ? (
          <span className="site-nav__meta">Scene flow</span>
        ) : (
          <Link className="site-nav__icon-button" to="/" aria-label="Back to scene flow">
            <span aria-hidden="true">←</span>
          </Link>
        )}
      </div>
    </header>
  );
}

export default Navigation;
