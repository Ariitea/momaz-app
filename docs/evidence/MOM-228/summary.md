# MOM-228 Final Remediation Evidence

## Scope Mapping

1. S08 conversion intent
- S08 primary CTA now starts the tailored redesign path directly via `#tailored-redesign`.
- No S08 primary CTA path routes to `/product/:id` or any source listing.

2. Safe-zone viewport math
- Safe-zone focus math now uses viewport-specific denominators:
  - desktop: `1920x1080`
  - portrait: `390x844`
- Portrait normalization no longer uses fixed desktop denominators.

3. Objective viewport evidence (apply-now scenes)
- Overlay evidence captured at:
  - `1920x1080`
  - `1366x768`
  - `390x844`
- JSON evidence includes per-scene object-position and safe-zone overlay percentages for S01/S02/S04/S07/S08.

## Artifacts

- `s08-safe-zone-1920x1080.png`
- `s08-safe-zone-1366x768.png`
- `s08-safe-zone-390x844.png`
- `tailored-redesign-1920x1080.png`
- `tailored-redesign-1366x768.png`
- `tailored-redesign-390x844.png`
- `viewport-safe-zone-evidence.json`

## Commands Run

```bash
node scripts/capture-mom-228-evidence.mjs
npm run lint
npm run build
```
