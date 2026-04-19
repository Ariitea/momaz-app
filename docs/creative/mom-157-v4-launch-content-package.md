# MOM-157 - V4 Launch-Ready Premium Content Package

## Scope and dependency
This package audits the implemented V4 surfaces from [MOM-152](/MOM/issues/MOM-152) and maps launch-ready premium assets to each target surface.

Reference sources:
- `src/components/ProductGrid.jsx`
- `src/components/ProductCard.jsx`
- `src/pages/ProductPage.jsx`
- `docs/assets/mom-134/asset-metadata.json`
- `docs/assets/mom-134/creative-note.md`
- [MOM-143](/MOM/issues/MOM-143)

## Coverage matrix (surface -> asset -> status -> owner)

| Surface | UI target / component | Package asset(s) | Status | Owner |
|---|---|---|---|---|
| Homepage hero | `catalog-hero` (`src/components/ProductGrid.jsx`) | `docs/assets/mom-134/hero-homepage-master.jpg` | Ready in package, not wired in UI | CMO (asset ready), Engineering (integration) |
| Catalog cards | `product-card__media` (`src/components/ProductCard.jsx`) | `docs/assets/mom-134/catalog-visual-01.jpg` `docs/assets/mom-134/catalog-visual-02.jpg` `docs/assets/mom-134/catalog-visual-03.jpg` | Ready in package, optional fallback set not wired in UI | CMO (asset ready), Engineering (fallback mapping) |
| PDP storytelling media | `product-detail__panel` (`src/pages/ProductPage.jsx`) | `docs/assets/mom-134/storytelling-loop-01.mp4` + `docs/assets/mom-134/storytelling-loop-01-poster.jpg` | Ready in package, no PDP media slot currently rendered | CMO (asset ready), UX/Engineering (slot integration) |
| PDP gallery fallback | `product-gallery` (`src/pages/ProductPage.jsx`) | `docs/assets/mom-134/catalog-visual-01.jpg` as fallback visual baseline | Partial: current fallback is external placeholder URL, not premium fallback | Engineering |

## Delta list by launch priority

### Must-fix before launch
1. Wire hero media slot to `hero-homepage-master.jpg` (or equivalent slot config) to align visual entry with [MOM-152](/MOM/issues/MOM-152) premium promise.
2. Add deterministic card fallback sequence using `catalog-visual-01/02/03.jpg` when feed image is missing/slow.
3. Add PDP storytelling media slot with `storytelling-loop-01.mp4` and poster fallback.
4. Replace generic external placeholder fallback (`via.placeholder.com`) with premium local fallback asset.

### Should-fix sprint+1
1. Centralize surface-to-asset mapping in a content config/module instead of inline component fallback strings.
2. Add alt-text binding from `docs/assets/mom-134/asset-metadata.json` to prevent drift.
3. Add runtime guardrails for responsive crop safety (hero text-safe zone and 4:5 card framing checks).

### Nice-to-have
1. Rotate card fallback visual by category to avoid repetitive grid rhythm.
2. Add lightweight observability event for fallback usage rate per surface.

## Validated package paths (traceable)

- Hero:
  - `docs/assets/mom-134/hero-homepage-master.jpg`
  - `docs/assets/mom-134/hero-homepage-master.png`
- Catalog cards:
  - `docs/assets/mom-134/catalog-visual-01.jpg`
  - `docs/assets/mom-134/catalog-visual-02.jpg`
  - `docs/assets/mom-134/catalog-visual-03.jpg`
- Storytelling media:
  - `docs/assets/mom-134/storytelling-loop-01.mp4`
  - `docs/assets/mom-134/storytelling-loop-01-poster.jpg`
- Metadata and integrity:
  - `docs/assets/mom-134/asset-metadata.json`
  - `docs/assets/mom-134/checksums.sha256`

## Handoff notes for UI/Engineering

- Responsive behavior:
  - Hero image must preserve text-safe center/left zone at 360px and 1440px.
  - Card visual fallback must keep strict 4:5 ratio at all breakpoints.
  - Storytelling loop must degrade to poster on reduced-motion or load failure.
- Fallback policy:
  - Priority order: feed image/video -> premium package fallback -> local static poster.
  - Do not use generic remote placeholders in launch profile.
- Dependency and sequencing:
  - This package is aligned to [MOM-152](/MOM/issues/MOM-152) implemented surfaces.
  - PO should convert each must-fix into integration tickets before release gate.
