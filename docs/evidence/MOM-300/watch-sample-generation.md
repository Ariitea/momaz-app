# MOM-300 Watch Sample Generation

Date: 2026-04-25

## Scope

Generated 5 sample watch visuals using 2-3 source references per output, focused on:

- product silhouette
- materials
- luxury watch photography style

## Reference Path Note

Requested reference path in task comment:

- `public/assets/references/mom-300/watches/`

Available reference set in workspace:

- `public/assets/references/mom-301/watches/`

This sample uses the available watch references under `mom-301/watches`.

## Output Samples

All outputs are `1280x1280` PNG files in:

- `public/assets/generated/mom-300/sample-watches/`

1. `watch-sample-01-daytona.png`
- `public/assets/references/mom-301/watches/Rolex/Cosmograph Daytona/m126500ln-0001.png`
- `public/assets/references/mom-301/watches/Rolex/Cosmograph Daytona/m126506-0001.png`
- `public/assets/references/mom-301/watches/Rolex/Cosmograph Daytona/m126519ln-0006.png`

2. `watch-sample-02-datejust.png`
- `public/assets/references/mom-301/watches/Rolex/Dayjust41/m126234-0051.png`
- `public/assets/references/mom-301/watches/Rolex/Dayjust41/m126334-0002.png`
- `public/assets/references/mom-301/watches/Rolex/Dayjust41/m126333-0010.png`

3. `watch-sample-03-submariner.png`
- `public/assets/references/mom-301/watches/Rolex/Submariner/m126610ln-0001.png`
- `public/assets/references/mom-301/watches/Rolex/Submariner/m126618lb-0002.png`
- `public/assets/references/mom-301/watches/Rolex/Submariner/m126610lv-0002.png`

4. `watch-sample-04-richard-mille-rm011.png`
- `public/assets/references/mom-301/watches/RichardMille/RM_011/richard-mille-rm-011-automatic-chronograph-felipe-massa-45677.jpg`
- `public/assets/references/mom-301/watches/RichardMille/RM_011/richard-mille-rm-011-automatic-chronograph-felipe-massa-45325.jpg`

5. `watch-sample-05-richard-mille-rm27.png`
- `public/assets/references/mom-301/watches/RichardMille/RM_27/2705F1.jpg`
- `public/assets/references/mom-301/watches/RichardMille/RM_27/2705F21.jpg`
- `public/assets/references/mom-301/watches/RichardMille/RM_27/rm_27_05_rafa_carbon_tpt_6_h_louzon_bb.jpg`

## Generation Method

- Deterministic compositing with `ffmpeg` filter graphs.
- Per-output visual treatment combines reference crops/layers and contrast/saturation grading to produce non-identical concept-style samples.
- No catalog schema/data mutation in this step.
