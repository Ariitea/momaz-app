import { Link, useLocation } from "react-router-dom";

function Navigation({ selectionCount, selectionOpen, onToggleSelection }) {
  const location = useLocation();

  return (
    <header className="site-nav" aria-label="Primary navigation">
      <button type="button" className="site-nav__icon-button" aria-label="Open menu">
        <span aria-hidden="true">☰</span>
      </button>

      <Link className="site-nav__logo" to="/">
        MOMAZ
      </Link>

      <div className="site-nav__actions">
        {location.pathname === "/" ? (
          <button type="button" className="site-nav__icon-button" aria-label="Search collection">
            <span aria-hidden="true">⌕</span>
          </button>
        ) : (
          <Link className="site-nav__icon-button" to="/" aria-label="Back to collection">
            <span aria-hidden="true">⌂</span>
          </Link>
        )}

        <button
          type="button"
          className={`site-nav__icon-button site-nav__icon-button--static ${selectionOpen ? "is-active" : ""}`}
          aria-label={`Selections with ${selectionCount} item${selectionCount === 1 ? "" : "s"}`}
          onClick={onToggleSelection}
        >
          <span aria-hidden="true">◍</span>
          <span className="site-nav__label">Selections</span>
          <span className="site-nav__count">{selectionCount}</span>
        </button>
      </div>
    </header>
  );
}

export default Navigation;
