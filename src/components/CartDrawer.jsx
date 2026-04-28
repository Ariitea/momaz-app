import { useCart } from "../context/useCart";
import { Link } from "react-router-dom";

function clampQuantity(value) {
  return Math.min(Math.max(value, 0), 99);
}

export default function CartDrawer({ isOpen, onClose }) {
  const { items, totalItems, updateQuantity, removeItem, clear } = useCart();

  return (
    <>
      <div
        className={`cart-backdrop ${isOpen ? "is-open" : ""}`}
        onClick={onClose}
        aria-hidden={isOpen ? "false" : "true"}
      />
      <aside className={`cart-drawer ${isOpen ? "is-open" : ""}`} aria-label="Shopping bag">
        <header className="cart-drawer__head">
          <div>
            <p>Bag</p>
            <strong>{String(totalItems).padStart(2, "0")} items</strong>
          </div>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </header>

        {items.length ? (
          <>
            <ul className="cart-drawer__list">
              {items.map((item) => (
                <li key={item.id} className="cart-item">
                  <div className="cart-item__media">
                    {item.image ? <img src={item.image} alt="" /> : null}
                  </div>
                  <div className="cart-item__body">
                    <p>{item.category}</p>
                    <strong>{item.title}</strong>
                    <div className="cart-item__actions">
                      <button
                        type="button"
                        aria-label={`Decrease quantity for ${item.title}`}
                        onClick={() => updateQuantity(item.id, clampQuantity(item.quantity - 1))}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{String(item.quantity).padStart(2, "0")}</span>
                      <button
                        type="button"
                        aria-label={`Increase quantity for ${item.title}`}
                        onClick={() => updateQuantity(item.id, clampQuantity(item.quantity + 1))}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="cart-item__remove"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <footer className="cart-drawer__foot">
              <button type="button" onClick={clear}>
                Clear bag
              </button>
            </footer>
          </>
        ) : (
          <div className="cart-drawer__empty">
            <strong>Your bag is empty</strong>
            <p>Add a product from a product page to start building your selection.</p>
            <Link to="/" onClick={onClose}>
              Continue browsing
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
