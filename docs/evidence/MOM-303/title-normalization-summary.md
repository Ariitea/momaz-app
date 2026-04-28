# MOM-303 Product Title Normalization (Sample)

- Generated at: 2026-04-26T19:37:21.507Z
- Source catalog size: 1920
- Sample size: 30
- Changed titles in sample: 30
- Unchanged titles in sample: 0
- Uncertain sample cases: 12
- Soft title cap: 30 characters

## Method Breakdown
- known_model_pattern: 16
- safe_fallback: 12
- rm_code_pattern: 2

## Brand Breakdown
- Rolex: 5
- Patek Philippe: 5
- Omega: 5
- Audemars Piguet: 5
- Hublot: 5
- Richard Mille: 3
- Cartier: 2

## Notes
- Deterministic extraction prioritizes explicit model patterns (e.g. Daytona, Datejust, Nautilus, RM codes).
- Low-confidence entries use safe fallback trimming after noise removal and brand dedup.
- This run is sample-only and does not mutate the main catalog files.

Report JSON: /Users/adriendesrames/.paperclip/instances/default/projects/137ea448-6a16-47f5-807b-72884ee5a4d2/c814d7c3-14af-4e3e-a664-e09c1ec60469/momaz-app/docs/evidence/MOM-303/title-normalization-sample-report.json
