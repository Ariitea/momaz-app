#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

timestamp() {
  date -u +"%Y-%m-%dT%H:%M:%SZ"
}

log() {
  printf '[%s] [daily-pipeline] %s\n' "$(timestamp)" "$*"
}

fail() {
  log "ERROR: $*"
  exit 1
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || fail "Required command '$1' is not installed or not on PATH."
}

has_npm_script() {
  local script_name="$1"
  node -e "const p=require('./package.json'); process.exit(p.scripts && p.scripts['$script_name'] ? 0 : 1);"
}

run_cmd_stage() {
  local stage_name="$1"
  local stage_cmd="$2"
  log "START ${stage_name}"
  log "Command: ${stage_cmd}"
  bash -lc "$stage_cmd"
  log "DONE ${stage_name}"
}

log "Pipeline run started in ${ROOT_DIR}"

require_cmd node
require_cmd npm
[[ -f package.json ]] || fail "package.json not found. Run this script from the project repository."
[[ -f scripts/check-catalog-integrity.mjs ]] || fail "Missing required validator script: scripts/check-catalog-integrity.mjs"

SCRAPE_CMD="${DAILY_PIPELINE_SCRAPE_CMD:-}"
NORMALIZE_CMD="${DAILY_PIPELINE_NORMALIZE_CMD:-}"
VALIDATE_CMD="${DAILY_PIPELINE_VALIDATE_CMD:-npm run catalog:integrity}"

if [[ -z "$SCRAPE_CMD" ]]; then
  if has_npm_script "catalog:scrape"; then
    SCRAPE_CMD="npm run catalog:scrape"
  elif [[ -f scripts/scrape-catalog.mjs ]]; then
    SCRAPE_CMD="node scripts/scrape-catalog.mjs"
  else
    SCRAPE_CMD="__use_existing_snapshot__"
  fi
fi

if [[ -z "$NORMALIZE_CMD" ]]; then
  if has_npm_script "catalog:normalize"; then
    NORMALIZE_CMD="npm run catalog:normalize"
  elif [[ -f scripts/normalize-catalog.mjs ]]; then
    NORMALIZE_CMD="node scripts/normalize-catalog.mjs"
  else
    NORMALIZE_CMD="__sync_snapshot_to_public__"
  fi
fi

if [[ "$SCRAPE_CMD" == "__use_existing_snapshot__" ]] && [[ ! -f src/data/products.json ]]; then
  fail "No scrape command detected and src/data/products.json is missing. Set DAILY_PIPELINE_SCRAPE_CMD or add a scrape stage script."
fi

if [[ "$NORMALIZE_CMD" == "__sync_snapshot_to_public__" ]] && [[ ! -f src/data/products.json ]]; then
  fail "Normalization fallback requires src/data/products.json, but the file is missing."
fi

if [[ "$SCRAPE_CMD" == "__use_existing_snapshot__" ]]; then
  log "START scrape stage"
  log "No scrape command found in this repo. Using existing snapshot at src/data/products.json."
  log "DONE scrape stage"
else
  run_cmd_stage "scrape stage" "$SCRAPE_CMD"
fi

if [[ "$NORMALIZE_CMD" == "__sync_snapshot_to_public__" ]]; then
  log "START normalization/transform stage"
  mkdir -p public/data
  cp src/data/products.json public/data/products.json
  log "Synced src/data/products.json -> public/data/products.json"
  log "DONE normalization/transform stage"
else
  run_cmd_stage "normalization/transform stage" "$NORMALIZE_CMD"
fi

run_cmd_stage "validation checks" "$VALIDATE_CMD"

log "Pipeline run completed successfully."
for artifact in \
  "src/data/products.json" \
  "public/data/products.json" \
  "docs/audit/mom-115-integrity-report.json" \
  "docs/audit/mom-115-integrity-summary.md"
do
  if [[ -f "$artifact" ]]; then
    log "Artifact: $artifact"
  fi
done
