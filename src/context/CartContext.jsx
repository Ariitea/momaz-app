import { createContext, useCallback, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "momaz-cart-v1";

function normalizeText(value = "") {
  return value
    .replace(/[\u3400-\u9FFF]+/g, "")
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeCartItem(item = {}) {
  return {
    id: String(item.id || ""),
    title: normalizeText(item.title || "") || "Selected piece",
    image: item.image || "",
    category: normalizeText(item.category || "") || "Curated selection",
  };
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    if (typeof window === "undefined") {
      return [];
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed
        .map((entry) => ({
          ...normalizeCartItem(entry),
          quantity: Number.isFinite(entry?.quantity) ? Math.max(1, Math.floor(entry.quantity)) : 1,
        }))
        .filter((entry) => entry.id);
    } catch {
      return [];
    }
  });

  const addItem = useCallback((item) => {
    const normalized = normalizeCartItem(item);

    if (!normalized.id) {
      return;
    }

    setItems((current) => {
      const existingIndex = current.findIndex((entry) => entry.id === normalized.id);

      if (existingIndex < 0) {
        return [...current, { ...normalized, quantity: 1 }];
      }

      return current.map((entry, index) =>
        index === existingIndex
          ? { ...entry, quantity: entry.quantity + 1 }
          : entry
      );
    });
  }, []);

  const updateQuantity = useCallback((itemId, quantity) => {
    setItems((current) =>
      current.flatMap((entry) => {
        if (entry.id !== itemId) {
          return [entry];
        }

        if (quantity <= 0) {
          return [];
        }

        return [{ ...entry, quantity }];
      })
    );
  }, []);

  const removeItem = useCallback((itemId) => {
    setItems((current) => current.filter((entry) => entry.id !== itemId));
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = useMemo(
    () => items.reduce((sum, entry) => sum + entry.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      totalItems,
      addItem,
      updateQuantity,
      removeItem,
      clear,
    }),
    [items, totalItems, addItem, updateQuantity, removeItem, clear]
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export { CartContext };
