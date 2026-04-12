# MOM-134 - Note d'intention creative (batch P1)

## Positionnement
Direction editoriale premium, sobre et contemporaine, alignee avec [MOM-131](/MOM/issues/MOM-131):
- un point focal dominant par asset
- contraste controle et espace negatif pour overlays UI
- tonalite curation/exclusivite (sans codes promotionnels agressifs)

## Narration par slot
- Hero homepage: ouverture de collection, signal de qualite et de rarete, lecture immediate en < 3s.
- Catalog visual 01: accent matiere/detail, intention "quality-first".
- Catalog visual 02: accent silhouette et profondeur, intention "curated selection".
- Catalog visual 03: accent finition/lumiere, intention "premium confidence".
- Storytelling loop: transition editoriale douce (macro -> ambiance), comprehension conservee en mode muet.

## Cohesion UX/UI
- Ratios et dimensions compatibles avec les templates definis dans [MOM-131](/MOM/issues/MOM-131).
- Poids de livraison conformes aux seuils de gouvernance de [MOM-132](/MOM/issues/MOM-132) pour hero, cartes, loop et poster.
- Strategie fallback: masters PNG + deliverables JPEG web-optimises (codec AVIF/WebP non disponible dans l'environnement de generation de ce run).

## Points de controle avant integration
- Validation PO/engineering requise via ticket dedie avant usage frontend.
- Verification finale a faire sur:
  - lisibilite overlay a 360px/1440px
  - rendu mobile des recadrages 4:5
  - contraste percu sur sections texte

## Note de rebaseline checksum
- `asset-metadata.json` a ete ajuste apres generation initiale des checksums pour corriger des champs descriptifs (texte) sans changer les IDs assets ni les chemins de fichiers.
- `checksums.sha256` a ete rebase pour aligner l'integrite du package avec le contenu metadata actuellement versionne.
