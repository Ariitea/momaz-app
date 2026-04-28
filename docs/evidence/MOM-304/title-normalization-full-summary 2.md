# MOM-304 Product Title Normalization (Full Catalog)

- Generated at: 2026-04-26T20:59:37.553Z
- Source catalog size: 1920
- Scope size: 1920
- Changed titles: 3
- Unchanged titles: 1917
- Uncertain cases: 241
- Confidence tier counts: HIGH=412, MEDIUM=1267, LOW=241
- Generic-output blocked count: 0
- Soft title cap: 30 characters
- Deterministic consistency: confirmed (same input -> same output)
- Dictionary brands covered: 8
- Delta vs MOM-303: HIGH=-5, MEDIUM=+559, LOW=-554
- Delta uncertain cases vs MOM-303: -554

## Method Breakdown
- non_watch_passthrough: 1218
- dictionary_exact_match: 404
- gentle_original_fallback: 241
- brand_prefixed_fallback: 47
- legacy_model_pattern: 7
- strong_token_extraction: 2
- rm_code_pattern: 1

## Confidence Tier Breakdown
- MEDIUM: 1267
- HIGH: 412
- LOW: 241

## Brand Breakdown
- Unknown: 1285
- Hublot: 137
- Cartier: 102
- Audemars Piguet: 88
- Omega: 75
- Jaeger-LeCoultre: 70
- Vacheron Constantin: 57
- Patek Philippe: 43
- Panerai: 43
- Tudor: 13
- Rolex: 6
- Richard Mille: 1

## Uncertain Reason Breakdown
- no_known_model_pattern: 241

## Fallback Hierarchy
- 1) brand model dictionary exact/partial matching
- 2) legacy known model / RM code / reference code
- 3) cleaned shortened original title
- 4) generic labels prevented (no `Watch`, `Luxury Watch`, empty label)

Report JSON: /Users/adriendesrames/.paperclip/instances/default/projects/137ea448-6a16-47f5-807b-72884ee5a4d2/c814d7c3-14af-4e3e-a664-e09c1ec60469/momaz-app/docs/evidence/MOM-304/title-normalization-full-report.json
