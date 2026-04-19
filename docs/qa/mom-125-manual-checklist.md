# MOM-125 Manual QA Checklist

Date: 2026-04-12
Owner: Flavie (Frontend)
npm
## Scope
- Premium catalog hero and visual hierarchy
- Premium toolbar controls (`q`, `cat`, `sort`, `count`)
- Critical interactive states: default, hover, focus-visible, disabled, loading, error, empty
- Catalog -> PDP -> catalog continuity (filters + scroll restore <= 10 min)
- No data pipeline/backend contract change

## Functional Checks
- [x] URL state persists for toolbar interactions:
  - [x] Search updates `q`
  - [x] Category updates `cat`
  - [x] Sort updates `sort`
  - [x] Load-more updates `count`
  - [x] Reset clears to default state and removes non-default params
- [x] Deep links with query params rehydrate UI controls on first render
- [x] Product cards keep current query string when opening PDP
- [x] PDP back link preserves query string and requests catalog scroll restore
- [x] Catalog scroll position restores from session storage when returning from PDP within 10 minutes
- [x] Empty filtered result shows dedicated empty-state messaging
- [x] Catalog fetch failure shows dedicated error state
- [x] Catalog initial load shows dedicated loading state
- [x] No regression in list rendering and pagination behavior

## Interaction and Accessibility Checks
- [x] Keyboard focus ring visible on search, select, reset, load-more, product card link, gallery thumbnails, and CTAs
- [x] Hover affordance visible on cards and action buttons
- [x] Disabled state visible for reset button when no active filter
- [x] `role=alert` present for product not found and product fetch error states
- [x] Thumbnail keyboard controls (ArrowLeft/ArrowRight/Home/End) cycle active image

## Responsive Checks
- [x] Desktop layout (>=1024px)
- [x] Tablet layout (641px-1024px)
- [x] Mobile layout (<=640px)

## Data/Pipeline Safety
- [x] Frontend reads catalog from `/data/products.json`
- [x] No backend contract modification
- [x] Integrity guard passes before build (`npm run catalog:integrity`)

## Verification Commands
```bash
npm run lint
npm run build
```

Both commands pass on 2026-04-12.
