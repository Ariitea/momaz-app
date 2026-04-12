# MOM-149 Mobile Lighthouse Evidence

## Scope
Final CTO verification for [MOM-148](/MOM/issues/MOM-148) payload target (<2MB total transfer) and mobile performance sanity.

## Command
```bash
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
npx --yes lighthouse "http://127.0.0.1:4173/" \
  --only-categories=performance \
  --form-factor=mobile \
  --throttling-method=simulate \
  --chrome-flags='--headless=new --no-sandbox' \
  --output=json \
  --output-path=docs/audit/MOM-149-lighthouse-mobile.json
```

## Result
- Performance score: `98`
- FCP: `1.41s`
- LCP: `2.17s`
- Total transfer size: `472,615 bytes` (`~0.47MB`)
- Unused JavaScript estimate: `25,112 bytes`

## Delta vs prior QA checkpoints
- From board-failed mobile snapshot (`~5.7MB` total payload): `-5.23MB` (`~91.7%` reduction)
- From later QA rerun (`~2.72MB` total payload): `-2.25MB` (`~82.6%` reduction)

## Acceptance
- Payload target `<2MB`: **PASS**
- Mobile LCP sanity (`~2.17s`): **PASS** for this local verification run

## Artifacts
- `docs/audit/MOM-149-lighthouse-mobile.json`
- `docs/audit/MOM-149-lighthouse-mobile-summary.json`
