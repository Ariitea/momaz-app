# MOM-152 Mobile Lighthouse Evidence

## Scope
Validation finale de l'implementation UX/UI V4 pour [MOM-152](/MOM/issues/MOM-152), avec focus sur la contrainte mobile Performance >= 80.

## Command
```bash
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
npx --yes lighthouse "http://127.0.0.1:4173/" \
  --only-categories=performance,accessibility,best-practices,seo \
  --form-factor=mobile \
  --screenEmulation.mobile=true \
  --chrome-flags='--headless=new --no-sandbox --disable-dev-shm-usage' \
  --output=json --output=html \
  --output-path=docs/audit/MOM-152-lighthouse-mobile
```

## Result
- Performance: `89`
- Accessibility: `100`
- Best practices: `100`
- SEO: `92`
- FCP: `2.53s`
- LCP: `3.31s`
- Total transfer size: `536,312 bytes`

## Acceptance
- Mobile performance >= 80: **PASS**
- Accessibility baseline (AA proxy): **PASS** on this local run

## Artifacts
- `docs/audit/MOM-152-lighthouse-mobile.report.json`
- `docs/audit/MOM-152-lighthouse-mobile.report.html`
- `docs/audit/MOM-152-lighthouse-mobile-summary.json`
