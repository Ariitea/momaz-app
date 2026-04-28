# MOM-302 Local Preview Delivery (Option C)

## Status
Prepared a local-only review bundle for MOM-302 sample mappings without requiring deployment.

## Bundle
- Path: `docs/evidence/MOM-302/mom-302-local-preview-bundle.zip`
- SHA256: `b92f2422fe238a6813cf8abdb3a73966e266ae537198cb4109a4332ba9a37f86`

## Included
- Updated data snapshots:
  - `public/data/products.json`
  - `public/data/products-lite.json`
  - `src-products.json` (from `src/data/products.json`)
- Referenced local watch assets used by sample mappings: 9 files
- Evidence:
  - `mapping-report.json`
  - `summary.md`

## Review Steps
1. Unzip into project root.
2. Start local app with `npm run dev`.
3. Open sample products from `mapping-report.json` and confirm image URLs resolve to `/assets/references/mom-300/watches/...`.

## Guardrails
- Demo-only assets.
- No deployment or public publish.
- Keep bundle local; do not push to remote.
