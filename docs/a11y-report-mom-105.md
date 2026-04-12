# MOM-105 Accessibility Verification Report

Date: 2026-04-12

## Scope
- Catalog page: `/`
- Product detail page: `/product/:id`

## Tooling
- Command: `npx lighthouse`
- Category: `accessibility`
- Runtime URL: local Vite dev server (`http://127.0.0.1:4173`)
- Chrome flags: `--headless=new --no-sandbox`

## Results
- Catalog (`/`): **96**
- Product detail (`/product/_dNDqfTi39r3T5wqeciHcubFSeuhlEpzcOOnvhRg`): **96**

Both pages are above the acceptance target of 95.

## Verification Command (Reference)
```bash
PORT=4173
PRODUCT_ID=$(jq -r '.products[0].id' public/data/products.json)
npm run dev -- --host 127.0.0.1 --port "$PORT"
npx --yes lighthouse "http://127.0.0.1:$PORT/" \
  --quiet \
  --chrome-flags='--headless=new --no-sandbox' \
  --only-categories=accessibility \
  --output=json \
  --output-path=/tmp/lh-home.json
npx --yes lighthouse "http://127.0.0.1:$PORT/product/$PRODUCT_ID" \
  --quiet \
  --chrome-flags='--headless=new --no-sandbox' \
  --only-categories=accessibility \
  --output=json \
  --output-path=/tmp/lh-pdp.json
```
