# MOM-143 - Page-by-Page Creative Content Blueprint (V1 Expansion)

## 1) Purpose and Scope
This blueprint converts the approved V1 creative direction from [MOM-136](/MOM/issues/MOM-136) and [MOM-135](/MOM/issues/MOM-135) into implementation-ready page content guidance.

Goals:
- define page inventory and hierarchy
- map visual intent, copy tone, and media assets per section
- specify asset constraints and fallback behavior
- provide clear frontend handoff and acceptance criteria

## 2) Creative Baseline (Locked)
- Positioning: premium editorial, restrained, contemporary
- Tone: curated, confident, selective (no aggressive promotional language)
- Visual principles: one dominant focal point, controlled contrast, protected negative space for text overlays
- Performance guardrails: align to [MOM-132](/MOM/issues/MOM-132) media thresholds

## 3) Asset Inventory and Status

| Asset ID | Source file | Primary usage | Format / ratio | Status |
|---|---|---|---|---|
| `hero-homepage-master` | `docs/assets/mom-134/hero-homepage-master.jpg` | Home hero | JPG, 16:9, 2560x1440 | Ready |
| `catalog-visual-01` | `docs/assets/mom-134/catalog-visual-01.jpg` | Category/product cards | JPG, 4:5, 1200x1500 | Ready |
| `catalog-visual-02` | `docs/assets/mom-134/catalog-visual-02.jpg` | Category/product cards | JPG, 4:5, 1200x1500 | Ready |
| `catalog-visual-03` | `docs/assets/mom-134/catalog-visual-03.jpg` | Category/product cards | JPG, 4:5, 1200x1500 | Ready |
| `storytelling-loop-01` | `docs/assets/mom-134/storytelling-loop-01.mp4` | Editorial interstitial | MP4, 16:9, 8s, muted loop | Ready |
| `storytelling-loop-01-poster` | `docs/assets/mom-134/storytelling-loop-01-poster.jpg` | Loop fallback poster | JPG, 16:9 | Ready |

Metadata source:
- `docs/assets/mom-134/asset-metadata.json`
- `docs/assets/mom-134/checksums.sha256`
- `docs/assets/mom-134/creative-note.md`

## 4) Page Inventory and Hierarchy

### Page A - Home (Primary Entry)
Purpose:
- establish premium perception in first viewport
- drive into category exploration with minimal friction

Section hierarchy:
1. Hero (visual + headline + supporting line + primary CTA)
2. Curation indicators (pieces, categories, freshness)
3. Featured categories
4. Editorial interstitial (loop or static poster)
5. Featured products strip
6. CTA to full catalog

Content mapping:
- Hero visual: `hero-homepage-master`
- Interstitial: `storytelling-loop-01` (poster fallback)
- Product snippets: `catalog-visual-01/02/03` in rotation

Copy tone:
- short premium statements
- quality and curation language
- no discount-first phrasing

Constraints:
- hero overlay text must remain legible at 360px and 1440px
- animation budget: 160-280ms transitions, disabled with `prefers-reduced-motion`

### Page B - Category / Catalog Listing
Purpose:
- preserve browse efficiency while maintaining editorial value

Section hierarchy:
1. Category header (title, context sentence)
2. Filter/Sort/Search toolbar
3. Active filter chips
4. Product grid
5. Mid-grid editorial break (image or loop)
6. Pagination / load more

Content mapping:
- Card media standard: `catalog-visual-01/02/03` (4:5)
- Optional break media: `storytelling-loop-01` or static poster

Copy tone:
- utility-first microcopy with premium framing
- concise labels and no noisy messaging

Constraints:
- keep filtering controls always accessible on mobile
- maintain 4:5 ratio in card frames across breakpoints

### Page C - Product Detail
Purpose:
- convert interest into click-through action with high trust

Section hierarchy:
1. Back to catalog + category context
2. Product title and price
3. Gallery (main image + thumbnails)
4. Product narrative (identity -> material -> usage)
5. Key attributes list
6. Primary source CTA
7. Related products

Content mapping:
- Main visual priority: `catalog-visual-01/02/03` by product mapping
- Optional inline editorial media: `storytelling-loop-01-poster` when loop is not suitable

Copy tone:
- specific and descriptive, not promotional
- confidence through material/finish details

Constraints:
- CTA should be visible without excessive scrolling on mobile
- metadata must remain scannable (short bullet groups)

### Page D - Supporting Pages (About, Method, Contact)
Purpose:
- reinforce trust and brand credibility around the shopping flow

Section hierarchy:
1. Intro hero block (lighter variant)
2. Narrative sections (mission/process/proof)
3. Trust anchors (partners/results/process quality)
4. Contact/action block

Content mapping:
- Reuse `hero-homepage-master` crops for intro hero where needed
- Use `catalog-visual-02/03` as section accents

Copy tone:
- transparent, expert, calm
- process clarity over slogans

Constraints:
- supporting pages must not compete visually with commerce CTAs
- maintain consistent type scale and spacing rhythm with core pages

## 5) Placement Rules and Fallback Logic
- Missing loop file: use `storytelling-loop-01-poster.jpg`
- Missing product visual: fallback to next available `catalog-visual-*` asset
- Missing alt text: load from `asset-metadata.json`
- High-latency conditions: prioritize static image rendering before optional motion media

## 6) Frontend Integration Recommendations
- keep existing routing and data flow unchanged
- implement section order exactly as defined per page
- wire media slots by asset ID to avoid hardcoded filenames in UI components
- centralize media fallback logic in one utility for hero, cards, and interstitials
- enforce alt text required checks during build/review

## 7) Acceptance Criteria (Implementation Handoff Ready)
- page hierarchy for Home, Category, Product, and Supporting pages is fully defined
- each section has visual intent + copy tone + mapped asset(s)
- all required V1 assets have source paths and status
- fallback behavior is explicitly documented for video/image/alt text
- frontend handoff constraints and integration guidance are explicit and testable

## 8) Approval Gate
This document satisfies the blueprint requirement that blocks direct frontend integration after [MOM-136](/MOM/issues/MOM-136). Final integration can proceed once this blueprint is reviewed/accepted in [MOM-143](/MOM/issues/MOM-143).
