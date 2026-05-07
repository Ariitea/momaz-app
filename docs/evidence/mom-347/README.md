# MOM-347 Evidence

Captured on 2026-05-07 against the local `vite preview` build at `http://127.0.0.1:4173/`.

Files:
- `catalog-light.png`
- `catalog-dark.png`
- `catalog-hover.png`
- `catalog-search-autocomplete.png`
- `catalog-pagination-15-items.png`
- `catalog-parity.json`

Checklist:
- Category rail readability: active and inactive category buttons use theme-specific colors instead of forced white text.
- Hover/blend behavior: one canonical row-state block drives hover and active foreground contrast against the selector band.
- Light/dark parity snapshot: `catalog-parity.json` records computed rail, hover-row, and band colors for both color schemes.
- Search submit/autocomplete: search input is visible, Enter commits the query, and dataset-backed suggestions are shown inline.
- Metadata/model label behavior: row and detail metadata use derived brand/model labeling instead of raw fragmented category text.
- Pagination density: catalog page size is 15 items.
