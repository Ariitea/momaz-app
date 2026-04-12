import { useEffect, useState } from "react";

const CATALOG_URL = "/data/products.json";

let productsCache = null;
let productsPromise = null;

async function fetchCatalogProducts() {
  if (productsCache) {
    return productsCache;
  }

  if (!productsPromise) {
    productsPromise = fetch(CATALOG_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Catalog request failed (${response.status})`);
        }

        return response.json();
      })
      .then((payload) => {
        productsCache = Array.isArray(payload?.products) ? payload.products : [];
        return productsCache;
      })
      .catch((error) => {
        productsPromise = null;
        throw error;
      });
  }

  return productsPromise;
}

export function useCatalogProducts() {
  const [products, setProducts] = useState(() => productsCache || []);
  const [loading, setLoading] = useState(() => !productsCache);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    fetchCatalogProducts()
      .then((items) => {
        if (!isMounted) {
          return;
        }

        setProducts(items);
        setLoading(false);
      })
      .catch((catalogError) => {
        if (!isMounted) {
          return;
        }

        setError(catalogError);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { products, loading, error };
}
