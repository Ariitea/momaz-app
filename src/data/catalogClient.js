import { useEffect, useState } from "react";

const CATALOG_URLS = {
  lite: "/data/products-lite.json",
  full: "/data/products.json",
};

const productsCacheByMode = {
  lite: null,
  full: null,
};

const productsPromiseByMode = {
  lite: null,
  full: null,
};

function resolveMode(mode) {
  return mode === "full" ? "full" : "lite";
}

function normalizeProducts(payload, mode) {
  if (mode === "lite") {
    return Array.isArray(payload?.products) ? payload.products : [];
  }

  return Array.isArray(payload?.products) ? payload.products : [];
}

async function fetchCatalogProducts(mode = "lite") {
  const resolvedMode = resolveMode(mode);

  if (productsCacheByMode[resolvedMode]) {
    return productsCacheByMode[resolvedMode];
  }

  if (!productsPromiseByMode[resolvedMode]) {
    productsPromiseByMode[resolvedMode] = fetch(CATALOG_URLS[resolvedMode])
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Catalog request failed (${response.status})`);
        }

        return response.json();
      })
      .then((payload) => {
        productsCacheByMode[resolvedMode] = normalizeProducts(payload, resolvedMode);
        return productsCacheByMode[resolvedMode];
      })
      .catch((error) => {
        productsPromiseByMode[resolvedMode] = null;
        throw error;
      });
  }

  return productsPromiseByMode[resolvedMode];
}

export function prefetchFullCatalogProducts() {
  fetchCatalogProducts("full").catch(() => {
    // Best-effort background prefetch only.
  });
}

export function useCatalogProducts(options = {}) {
  const mode = resolveMode(options.mode);
  const [products, setProducts] = useState(() => productsCacheByMode[mode] || []);
  const [loading, setLoading] = useState(() => !productsCacheByMode[mode]);
  const [error, setError] = useState(() => null);

  useEffect(() => {
    let isMounted = true;

    fetchCatalogProducts(mode)
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
  }, [mode]);

  return { products, loading, error };
}
