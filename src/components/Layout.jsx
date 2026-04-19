import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "./Navigation";

const SELECTION_STORAGE_KEY = "momaz.selection.list";

function readSelectionItems() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const parsed = JSON.parse(localStorage.getItem(SELECTION_STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function Layout({ children }) {
  const [selectionItems, setSelectionItems] = useState(() => readSelectionItems());
  const [selectionOpen, setSelectionOpen] = useState(false);

  useEffect(() => {
    const refreshSelection = () => setSelectionItems(readSelectionItems());

    window.addEventListener("storage", refreshSelection);
    window.addEventListener("momaz-selection-updated", refreshSelection);

    return () => {
      window.removeEventListener("storage", refreshSelection);
      window.removeEventListener("momaz-selection-updated", refreshSelection);
    };
  }, []);

  const removeSelectionItem = (itemId) => {
    const next = selectionItems.filter((item) => item.id !== itemId);
    setSelectionItems(next);
    localStorage.setItem(SELECTION_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("momaz-selection-updated"));
  };

  const startInquiry = () => {
    const lines = selectionItems.map((item, index) => {
      const title = item.title || "Untitled";
      const size = item.size || "N/A";
      const sourceLine =
        typeof item.productUrl === "string" && item.productUrl.trim() !== ""
          ? `\n   Source: ${item.productUrl.trim()}`
          : "";
      return `${index + 1}. ${title} (Size ${size})${sourceLine}`;
    });

    const mailtoSubject = encodeURIComponent("Momaz inquiry: selected pieces");
    const mailtoBody = encodeURIComponent(
      `Hello,\n\nI would like to start an inquiry about the following selection:\n\n${lines.join("\n\n")}\n\nThank you.`,
    );

    window.location.href = `mailto:?subject=${mailtoSubject}&body=${mailtoBody}`;
  };

  const hasSelection = selectionItems.length > 0;

  return (
    <div className="site-frame">
      <Navigation
        selectionCount={selectionItems.length}
        selectionOpen={selectionOpen}
        onToggleSelection={() => setSelectionOpen((open) => !open)}
      />
      {selectionOpen ? (
        <aside className="shortlist-panel" aria-label="Your selection">
          <header className="shortlist-panel__header">
            <h2>Your selection</h2>
          </header>

          {selectionItems.length === 0 ? (
            <div className="shortlist-panel__empty">
              <h3>No selections yet</h3>
              <p>Save pieces here while you compare details.</p>
            </div>
          ) : (
            <ul className="shortlist-panel__list">
              {selectionItems.map((item) => (
                <li key={item.id} className="shortlist-panel__item">
                  <div>
                    <p>{item.title || "Untitled"}</p>
                    <small>{`Size ${item.size || "N/A"}`}</small>
                  </div>
                  <button type="button" onClick={() => removeSelectionItem(item.id)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="shortlist-panel__actions">
            <Link className="shortlist-panel__cta" to="/" onClick={() => setSelectionOpen(false)}>
              Continue browsing
            </Link>
            <button type="button" className="shortlist-panel__cta" onClick={startInquiry} disabled={!hasSelection}>
              Start inquiry
            </button>
          </div>
        </aside>
      ) : null}
      {children}
    </div>
  );
}

export default Layout;
