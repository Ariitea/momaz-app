# MOM-108 Pipeline Artifact Pack (Available in Frontend Workspace)

Date: 2026-04-12
Issue: [MOM-108](/MOM/issues/MOM-108)
Parent audit: [MOM-107](/MOM/issues/MOM-107)

## 1) Raw extraction export (before normalization)

Not available in this repository/workspace.

- No scraper source code, fetch logs, or raw dump files found.
- Repository contains frontend assets and a delivered catalog snapshot only.

## 2) Normalized output (available)

Primary normalized payload:

- `src/data/products.json`
- `public/data/products.json`

Integrity check:

- SHA-256 `src/data/products.json`: `2c1023a7cb4a84627dcdd43ed642ca42ddb45e97750a54dfe23efcba6f351f43`
- SHA-256 `public/data/products.json`: `2c1023a7cb4a84627dcdd43ed642ca42ddb45e97750a54dfe23efcba6f351f43`
- Result: identical files.

Metadata summary:

- generated_at: `2026-04-11T11:45:25Z`
- storefront: `https://a202401171449124002001685.wecatalog.cc/weshop/store/_dproQ6ja-7F03wvCcTC3V-xa_vgjgutMHry9dRw`
- total_products: `1920`
- product_count (array length): `1920`

Machine-readable summary:

- `docs/audit/mom-108-normalized-summary.json`

## 3) Active filtering / dedup rules (observable)

No explicit normalization/dedup code is present in this frontend repo.

Observed properties in delivered normalized output:

- Unique product IDs: 1920 (no duplicate `id`)
- SKU cardinality: 1 (all rows have `sku = "default"`)
- Unique `source_link`: 1920
- Unique `product_url`: 1920

Inference for audit:

- If upstream dedup/filtering exists, it runs outside this repo and cannot be inspected from current workspace.

## 4) Pagination log / endpoint coverage (observable)

No crawler pagination logs are available in this workspace.

Only endpoint evidence in normalized payload:

- storefront base domain: `a202401171449124002001685.wecatalog.cc`
- each product keeps a relative `source_link` + absolute `product_url`

No trace artifacts available for:

- paginated API/page sequence
- request counts per endpoint
- dropped/error pages

## 5) Nike / Air Jordan sample evidence from normalized output

Count by keyword match (title/category/sku, case-insensitive): 2 rows.

Sample extract file:

- `docs/audit/mom-108-nike-air-jordan.tsv`

Rows include fields:

- `id`, `sku`, `category`, normalized `title`, `product_url`, `source_link`

## 6) Required unblock to complete MOM-107 root-cause audit

To complete end-to-end diagnosis requested in [MOM-107](/MOM/issues/MOM-107), upstream scraper artifacts are still required:

- raw extraction dump before normalization
- normalization/filtering/dedup implementation or rule config used for this run
- pagination/request coverage logs for the run that generated `2026-04-11T11:45:25Z`
