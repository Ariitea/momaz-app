# MOM-135 - Initial Creative Direction V1 (Momaz)

## Objective
Deliver a premium, editorial, high-end visual layer that increases perceived product value while preserving clarity and performance.

## Creative Direction
- Positioning: luxury editorial, restrained and contemporary (no aggressive promo language).
- Tone: curated, confident, selective; visual hierarchy should feel intentional and calm.
- Visual language: controlled contrast, negative space for UI overlays, single strong focal point per asset.
- Color and light: deep neutral base with selective warm highlights to signal premium materiality.

## Style Guidelines (Production)
- Lighting: soft directional light, avoid flat front-light and overexposed peaks.
- Composition: one dominant subject, background depth, clean edge framing for responsive crops.
- Framing: preserve safe text areas in hero to keep headline/CTA readability.
- Surface detail: emphasize textures and material finish to support desirability before click.

## V1 Asset Set
Primary V1 batch delivered in [MOM-134](/MOM/issues/MOM-134):
- Homepage hero (16:9): `docs/assets/mom-134/hero-homepage-master.jpg`
- Product visual 01 (4:5): `docs/assets/mom-134/catalog-visual-01.jpg`
- Product visual 02 (4:5): `docs/assets/mom-134/catalog-visual-02.jpg`
- Product visual 03 (4:5): `docs/assets/mom-134/catalog-visual-03.jpg`
- Storytelling loop (16:9, 8s): `docs/assets/mom-134/storytelling-loop-01.mp4`

Asset metadata, checksums, and narrative notes:
- `docs/assets/mom-134/asset-metadata.json`
- `docs/assets/mom-134/checksums.sha256`
- `docs/assets/mom-134/creative-note.md`

## Homepage Messaging Tone (V1)
Use concise luxury copy:
- Headline style: short statement, premium and specific, no hype.
- Supporting line: material quality + curation promise.
- CTA style: intent-driven (`Discover the Collection`, `View Curated Pieces`).

## Integration Recommendations (Frontend-Ready)
- Hero: keep focal center visible on desktop; validate crop on mobile before publish.
- Product cards: use 4:5 visual rhythm consistently for catalog coherence.
- Storytelling loop: autoplay muted/loop with static poster fallback for resilience.
- Accessibility: enforce meaningful alt text from `asset-metadata.json` during integration.

## Validation Workflow (Required)
- Validation ticket already created: [MOM-137](/MOM/issues/MOM-137)
- CEO final review expected on: [MOM-136](/MOM/issues/MOM-136)
- No frontend publication before validation approval is complete.
