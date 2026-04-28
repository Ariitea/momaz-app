# MOM-303 Product Title Normalization (Full Catalog)

- Generated at: 2026-04-26T20:14:31.870Z
- Source catalog size: 1920
- Scope size: 1920
- Changed titles: 1125
- Unchanged titles: 795
- Uncertain cases: 795
- Confidence tier counts: HIGH=417, MEDIUM=708, LOW=795
- Generic-output blocked count: 0
- Soft title cap: 30 characters
- Deterministic consistency: confirmed (same input -> same output)

## Method Breakdown
- gentle_original_fallback: 795
- strong_token_extraction: 592
- known_model_pattern: 412
- alphanumeric_reference_pattern: 69
- brand_prefixed_fallback: 47
- rm_code_pattern: 5

## Confidence Tier Breakdown
- LOW: 795
- MEDIUM: 708
- HIGH: 417

## Brand Breakdown
- Unknown: 1258
- Hublot: 137
- Cartier: 102
- Audemars Piguet: 88
- Omega: 75
- Jaeger-LeCoultre: 70
- Vacheron Constantin: 57
- Patek Philippe: 43
- Panerai: 43
- Rolex: 31
- Tudor: 13
- Richard Mille: 3

## Uncertain Reason Breakdown
- no_known_model_pattern: 795

## Fallback Hierarchy
- 1) known model / RM code / reference code
- 2) brand-prefixed partial token for ambiguity
- 3) cleaned shortened original title
- 4) generic labels prevented (no `Watch`, `Luxury Watch`, empty label)

Report JSON: /Users/adriendesrames/.paperclip/instances/default/projects/137ea448-6a16-47f5-807b-72884ee5a4d2/c814d7c3-14af-4e3e-a664-e09c1ec60469/momaz-app/docs/evidence/MOM-303/title-normalization-full-report.json
