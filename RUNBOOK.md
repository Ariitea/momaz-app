# Daily Pipeline Runbook

## Command

Run from repository root:

```bash
./scripts/run_daily_pipeline.sh
```

Optional stage overrides:

```bash
DAILY_PIPELINE_SCRAPE_CMD="npm run catalog:scrape" \
DAILY_PIPELINE_NORMALIZE_CMD="npm run catalog:normalize" \
DAILY_PIPELINE_VALIDATE_CMD="npm run catalog:integrity" \
./scripts/run_daily_pipeline.sh
```

## What the Script Runs

1. Scrape stage
2. Normalization/transform stage
3. Validation checks

Current repository limitation:

- There is no built-in scrape or normalize implementation in this workspace.
- The script falls back to using `src/data/products.json` as the existing extracted snapshot.
- The normalization fallback syncs `src/data/products.json` to `public/data/products.json`.

## Expected Artifacts

- `src/data/products.json` (input snapshot)
- `public/data/products.json` (frontend copy after transform stage)
- `docs/audit/mom-115-integrity-report.json` (validation report)
- `docs/audit/mom-115-integrity-summary.md` (human-readable summary)

## Deterministic Exit Codes

- Exit `0`: all three stages completed successfully.
- Non-zero exit: first failing stage stops execution immediately (`set -euo pipefail`).

## Troubleshooting (Top 3 Failures)

1. Missing runtime tools
- Symptom: `Required command 'node' is not installed` or `Required command 'npm' is not installed`.
- Fix: install Node.js and npm, then rerun `./scripts/run_daily_pipeline.sh`.

2. Missing snapshot / scrape stage not configured
- Symptom: `No scrape command detected and src/data/products.json is missing`.
- Fix: either add `src/data/products.json` or provide a scrape command via `DAILY_PIPELINE_SCRAPE_CMD`.

3. Validation failure
- Symptom: script exits during validation with `[catalog-integrity] FAIL ...`.
- Fix: inspect `docs/audit/mom-115-integrity-report.json`, verify `src/data/products.json` and `public/data/products.json` stay in sync, then rerun.
