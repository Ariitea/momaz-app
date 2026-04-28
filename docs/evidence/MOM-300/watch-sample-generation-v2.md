# MOM-300 Watch Sample Generation v2

Date: 2026-04-25

## Purpose

Regenerate the 5 watch sample visuals after blocker feedback on [MOM-300](/MOM/issues/MOM-300), with strict product-visual constraints:

- product only (watch object with case, dial, strap)
- neutral background / product-photo composition
- no UI overlays
- no abstract card layouts

## Reference Path Compliance

References were sourced from:

- `public/assets/references/mom-300/watches/`

(These files were mirrored from existing watch references to satisfy the requested path.)

## Generation Method (v2)

- Source usage: 2-3 reference images per generated output.
- Technique: same-dimension photo blending (`ffmpeg blend=average`) plus light tonal correction/sharpening.
- Composition constraints:
  - no geometric overlays
  - no abstract composition layers
  - no synthetic UI-card framing
- Sizing: generated outputs keep the native source dimensions (no output upscaling).

## Output Files

Directory:

- `public/assets/generated/mom-300/sample-watches-v2/`

Files:

1. `watch-sample-01-daytona-v2.png` (`640x941`)
- refs:
  - `public/assets/references/mom-300/watches/Rolex/Cosmograph Daytona/m126506-0001.png`
  - `public/assets/references/mom-300/watches/Rolex/Cosmograph Daytona/m126508-0008.png`
  - `public/assets/references/mom-300/watches/Rolex/Cosmograph Daytona/m126515ln-0006.png`

2. `watch-sample-02-datejust-v2.png` (`640x941`)
- refs:
  - `public/assets/references/mom-300/watches/Rolex/Datejust/m126234-0051.png`
  - `public/assets/references/mom-300/watches/Rolex/Datejust/m126333-0010.png`
  - `public/assets/references/mom-300/watches/Rolex/Datejust/m126333-0010-alt.png`

3. `watch-sample-03-submariner-v2.png` (`800x1180`)
- refs:
  - `public/assets/references/mom-300/watches/Rolex/Submariner/m126618lb-0002.png`
  - `public/assets/references/mom-300/watches/Rolex/Submariner/m126610lv-0002.png`
  - `public/assets/references/mom-300/watches/Rolex/Submariner/m126618ln-0002.png`

4. `watch-sample-04-richard-mille-rm011-v2.jpg` (`1442x1920`)
- refs:
  - `public/assets/references/mom-300/watches/RichardMille/RM_011/richard-mille-rm-011-automatic-chronograph-felipe-massa-45677.jpg`
  - `public/assets/references/mom-300/watches/RichardMille/RM_011/richard-mille-rm-011-automatic-chronograph-felipe-massa-45684.jpg`

5. `watch-sample-05-richard-mille-rm011-carbon-v2.jpg` (`1406x1920`)
- refs:
  - `public/assets/references/mom-300/watches/RichardMille/RM_011/RM011-CA-TZP-600tzp7-37-88-160505-e1594118836852.jpg.webp`
  - `public/assets/references/mom-300/watches/RichardMille/RM_011/RM011-CA-TZP-6007-37-88-160505-e1594119036209.jpg.webp`

## Review Artifact

- Contact sheet: `docs/evidence/MOM-300/watch-sample-v2-contact-sheet.jpg`
