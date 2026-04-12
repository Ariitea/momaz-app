import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve } from "node:path";

const ROOT = process.cwd();
const SRC_PATH = resolve(ROOT, "src/data/products.json");
const FRONTEND_PATH = resolve(ROOT, "public/data/products.json");
const REPORT_PATH = resolve(ROOT, "docs/audit/mom-115-integrity-report.json");
const SUMMARY_PATH = resolve(ROOT, "docs/audit/mom-115-integrity-summary.md");

const PRIORITY_BRANDS = [
  { key: "nike", label: "Nike", patterns: [/\bnike\b/i] },
  { key: "air_jordan", label: "Air Jordan", patterns: [/\bair\s*jordan\b/i, /\bjordan\b/i] },
  { key: "adidas", label: "Adidas", patterns: [/\badidas\b/i] },
  { key: "louis_vuitton", label: "Louis Vuitton", patterns: [/\blouis\s*vuitton\b/i, /\blv\b/i] },
];

function hashText(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function loadCatalog(path) {
  const raw = readFileSync(path, "utf8");
  const parsed = JSON.parse(raw);
  const products = Array.isArray(parsed?.products) ? parsed.products : [];

  return {
    path,
    hash: hashText(raw),
    generatedAt: parsed?.generated_at ?? null,
    storefront: parsed?.storefront ?? null,
    totalProductsField: Number(parsed?.total_products ?? 0),
    products,
  };
}

function canonicalizeSourceId(product) {
  if (typeof product?.source_id === "string" && product.source_id.trim()) {
    return product.source_id.trim();
  }

  if (typeof product?.source_link === "string" && product.source_link.includes("/")) {
    const parts = product.source_link.split("/").filter(Boolean);
    if (parts.length > 0) {
      return parts[parts.length - 1].trim();
    }
  }

  if (typeof product?.id === "string") {
    return product.id.trim();
  }

  return "";
}

function countByBrand(products) {
  const counters = Object.fromEntries(PRIORITY_BRANDS.map((b) => [b.key, 0]));

  for (const product of products) {
    const joined = [product?.title, product?.category, product?.sku]
      .filter((v) => typeof v === "string")
      .join(" ");

    for (const brand of PRIORITY_BRANDS) {
      if (brand.patterns.some((regex) => regex.test(joined))) {
        counters[brand.key] += 1;
      }
    }
  }

  return PRIORITY_BRANDS.map((brand) => ({
    key: brand.key,
    label: brand.label,
    count: counters[brand.key],
  }));
}

function uniqueSet(values) {
  return new Set(values.filter((value) => typeof value === "string" && value.length > 0));
}

function findMissing(leftSet, rightSet) {
  const missing = [];
  for (const item of leftSet) {
    if (!rightSet.has(item)) {
      missing.push(item);
    }
  }
  return missing;
}

function main() {
  const normalized = loadCatalog(SRC_PATH);
  const frontend = loadCatalog(FRONTEND_PATH);

  const rawVolume = normalized.totalProductsField;
  const normalizedVolume = normalized.products.length;
  const frontendVolume = frontend.products.length;

  const normalizedSourceIds = normalized.products.map((product) => canonicalizeSourceId(product));
  const frontendIds = frontend.products
    .map((product) => (typeof product?.id === "string" ? product.id.trim() : ""));

  const normalizedSourceSet = uniqueSet(normalizedSourceIds);
  const frontendIdSet = uniqueSet(frontendIds);

  const missingInFrontend = findMissing(normalizedSourceSet, frontendIdSet);
  const missingInNormalized = findMissing(frontendIdSet, normalizedSourceSet);

  const hasDuplicateNormalizedSourceIds = normalizedSourceSet.size !== normalizedSourceIds.length;
  const hasDuplicateFrontendIds = frontendIdSet.size !== frontendIds.length;

  const diffs = {
    raw_vs_normalized: Math.abs(rawVolume - normalizedVolume),
    raw_vs_frontend: Math.abs(rawVolume - frontendVolume),
    normalized_vs_frontend: Math.abs(normalizedVolume - frontendVolume),
    normalized_missing_in_frontend: missingInFrontend.length,
    frontend_missing_in_normalized: missingInNormalized.length,
  };

  const allDiffsAreZero = Object.values(diffs).every((diff) => diff === 0);
  const bijectionOk =
    !hasDuplicateNormalizedSourceIds &&
    !hasDuplicateFrontendIds &&
    missingInFrontend.length === 0 &&
    missingInNormalized.length === 0;

  const status = allDiffsAreZero && bijectionOk ? "pass" : "fail";

  const report = {
    issue: "MOM-115",
    checked_at: new Date().toISOString(),
    status,
    raw: {
      source: "src/data/products.json.total_products",
      volume: rawVolume,
      generated_at: normalized.generatedAt,
      storefront: normalized.storefront,
    },
    normalized: {
      source: "src/data/products.json.products",
      volume: normalizedVolume,
      sha256: normalized.hash,
    },
    frontend: {
      source: "public/data/products.json.products",
      volume: frontendVolume,
      sha256: frontend.hash,
    },
    diffs,
    identifier_bijection: {
      source_identifier_field: "source_id (fallback: source_link tail, then id)",
      frontend_identifier_field: "id",
      normalized_unique_identifiers: normalizedSourceSet.size,
      frontend_unique_identifiers: frontendIdSet.size,
      duplicates: {
        normalized_source_identifiers: hasDuplicateNormalizedSourceIds,
        frontend_identifiers: hasDuplicateFrontendIds,
      },
      missing_in_frontend_sample: missingInFrontend.slice(0, 20),
      missing_in_normalized_sample: missingInNormalized.slice(0, 20),
      is_bijective: bijectionOk,
    },
    priority_brand_counts: countByBrand(frontend.products),
  };

  mkdirSync(resolve(ROOT, "docs/audit"), { recursive: true });
  writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  const summary = [
    "# MOM-115 Catalog Integrity Check",
    "",
    `- Status: **${status.toUpperCase()}**`,
    `- Checked at: ${report.checked_at}`,
    `- Raw volume: ${rawVolume}`,
    `- Normalized volume: ${normalizedVolume}`,
    `- Frontend volume: ${frontendVolume}`,
    `- Diffs (raw/normalized, raw/frontend, normalized/frontend): ${diffs.raw_vs_normalized}, ${diffs.raw_vs_frontend}, ${diffs.normalized_vs_frontend}`,
    `- Identifier bijection: ${bijectionOk ? "OK" : "FAIL"}`,
    "",
    "## Priority Brand Counts",
    ...report.priority_brand_counts.map((brand) => `- ${brand.label}: ${brand.count}`),
    "",
    `Report JSON: ${REPORT_PATH}`,
  ].join("\n");

  writeFileSync(SUMMARY_PATH, `${summary}\n`, "utf8");

  if (status !== "pass") {
    console.error("[catalog-integrity] FAIL", JSON.stringify(report.diffs));
    process.exit(1);
  }

  console.log("[catalog-integrity] PASS");
  console.log(`raw=${rawVolume} normalized=${normalizedVolume} frontend=${frontendVolume}`);
  console.log("report=docs/audit/mom-115-integrity-report.json");
  console.log("summary=docs/audit/mom-115-integrity-summary.md");
}

main();
