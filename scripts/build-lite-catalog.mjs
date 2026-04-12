import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const FULL_CATALOG_PATH = path.resolve("public/data/products.json");
const LITE_CATALOG_PATH = path.resolve("public/data/products-lite.json");

function toLiteProduct(product) {
  return {
    id: product.id,
    sku: product.sku || "default",
    title: product.title || "Produit sans titre",
    category: product.category || "Sans categorie",
    price_amount: product.price_amount || "0.00",
    currency: product.currency || "",
    availability: product.availability || "A confirmer",
    updated_at_unix_ms: product.updated_at_unix_ms || 0,
    image: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : null,
  };
}

async function main() {
  const raw = await readFile(FULL_CATALOG_PATH, "utf8");
  const payload = JSON.parse(raw);
  const products = Array.isArray(payload?.products) ? payload.products : [];

  const litePayload = {
    generated_at: new Date().toISOString(),
    source_count: products.length,
    products: products.map(toLiteProduct),
  };

  await writeFile(LITE_CATALOG_PATH, `${JSON.stringify(litePayload)}\n`, "utf8");

  const fullBytes = Buffer.byteLength(raw, "utf8");
  const liteBytes = Buffer.byteLength(JSON.stringify(litePayload), "utf8");
  const reduction = fullBytes > 0 ? (((fullBytes - liteBytes) / fullBytes) * 100).toFixed(1) : "0.0";

  console.log(
    `[catalog-lite] wrote ${LITE_CATALOG_PATH} (${(liteBytes / 1024).toFixed(1)} KB, ${reduction}% smaller than full)`
  );
}

main().catch((error) => {
  console.error("[catalog-lite] FAIL", error);
  process.exitCode = 1;
});
