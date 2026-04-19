# MOM-158 - PDP storytelling slot + regles responsive crop/fallback (V4)

## 1) Decision UX (P1 launch)

Objectif: ajouter un slot storytelling premium dans la zone `product-detail__panel` et verrouiller des regles media responsive/crop/fallback exploitables directement en implementation.

Outcome attendu mesurable:
- taux de clic sortant PDP (`product_detail_source_click`) >= 24% sur sessions PDP qualifiees;
- taux d'usage fallback premium (pas de placeholder generique) = 100% des cas de defaut media;
- aucun echec QA sur les contraintes ratio/crop en mobile (360px) et desktop (1440px).

Dependencies:
- surface base: [MOM-152](/MOM/issues/MOM-152)
- package creatif: [MOM-157](/MOM/issues/MOM-157)

## 2) IA et placement final

### 2.1 PDP desktop (`>= 1025px`)

Structure conservee:
1. `product-detail__nav`
2. `product-detail__headline`
3. `product-detail__layout`

Regle de placement:
- inserer le storytelling media en premier bloc dans `article.product-detail__panel`;
- ordre fixe des blocs panel:
  1. Storytelling media (nouveau)
  2. `1. Identite`
  3. `2. Attributs`
  4. `3. Action`

Rationale UX:
- desir visuel avant preuve et CTA;
- CTA reste dans la premiere hauteur visible grace au panel sticky existant.

### 2.2 PDP mobile/tablet (`<= 1024px`)

Regle de lecture verticale:
1. galerie principale (`product-gallery`)
2. miniatures
3. storytelling media (dans `product-detail__panel`)
4. identite
5. attributs
6. action/CTA

Constraint:
- sur mobile, `product-detail__panel` reste non-sticky (comportement existant) et le storytelling doit apparaitre avant le bloc action, sans depasser 1.5 viewport apres la headline.

## 3) Spec du slot storytelling

### 3.1 Composant cible

Fichier de reference:
- `src/pages/ProductPage.jsx`

Nouveau bloc recommande dans `product-detail__panel`:
- wrapper: `.product-detail__story`
- element video: `.product-detail__story-media`
- element poster fallback: `.product-detail__story-poster`
- caption aide/non bloquante: `.product-detail__story-note`

### 3.2 Ratio et dimensions

- ratio verrouille: `4 / 5` (coherent avec media card V4) pour eviter rupture de rythme visuel entre catalogue et PDP;
- desktop: largeur fluide de la colonne panel, hauteur derivee du ratio;
- mobile: pleine largeur panel, ratio identique;
- `object-fit: cover` obligatoire pour video et poster.

### 3.3 Source d'asset

Storytelling package:
- video: `docs/assets/mom-134/storytelling-loop-01.mp4`
- poster: `docs/assets/mom-134/storytelling-loop-01-poster.jpg`

## 4) Politique fallback (ordre obligatoire)

### 4.1 PDP storytelling media

Ordre strict:
1. flux media produit (si video disponible dans le feed)
2. fallback premium package (`storytelling-loop-01.mp4`)
3. poster local premium (`storytelling-loop-01-poster.jpg`)

Interdiction:
- aucun fallback sur URL `via.placeholder.com` ou equivalent generique.

### 4.2 Galerie PDP principale

Ordre strict image principale:
1. `product.images[activeIndex]`
2. fallback premium local `docs/assets/mom-134/catalog-visual-01.jpg`
3. poster local storytelling `docs/assets/mom-134/storytelling-loop-01-poster.jpg`

### 4.3 Cards catalogue (`product-card__media`)

Ordre strict:
1. feed image (`product.image` ou `product.images[0]`)
2. fallback premium sequence cyclique: `catalog-visual-01.jpg` -> `catalog-visual-02.jpg` -> `catalog-visual-03.jpg`
3. poster local storytelling

Regle implementation:
- selection fallback deterministic par index de card pour eviter repetition visuelle.

## 5) Crop-safe constraints (hero + card)

### 5.1 Hero (`catalog-hero`)

Composant de reference:
- `src/components/ProductGrid.jsx` + `src/index.css`

Contraintes:
- zone texte sure (sans collision forte contraste/image): 0-62% largeur, 8-78% hauteur;
- aux breakpoints 360px et 1440px, kicker/H1/subtitle doivent rester sur fond avec contraste >= 4.5:1;
- aucun contenu critique asset (visage/logo central) ne doit etre place dans les 6% exterieurs de chaque bord.

### 5.2 Card media (`product-card__media`)

Contraintes:
- ratio base `4:5` preserve sur variants par defaut;
- variant `feature` (16:10) autorise seulement pour rythme editorial, mais image doit conserver sujet principal dans 15%-85% horizontal et 12%-88% vertical;
- variant `tall` (4:6) garde meme regle de zone sure, sans couper sujet principal.

## 6) Motion et accessibilite

### 6.1 Reduced motion

Si `prefers-reduced-motion: reduce`:
- ne pas autoplay la video storytelling;
- afficher directement le poster premium;
- aucun effet de zoom ou transition non essentielle sur le slot storytelling.

### 6.2 Load failure

Si echec chargement video:
- swap immediat vers poster local;
- conserver note textuelle discrete (`role="status"`) indiquant media simplifie;
- ne pas masquer ni deplacer le CTA source.

### 6.3 A11y requirements

- media storytelling decoratif: `aria-hidden="true"` si aucune information nouvelle;
- si media porte un message produit specifique, fournir `aria-label` explicite et caption texte;
- focus clavier inchange sur boutons/CTA existants;
- cibles interactives >= 44x44 conservees.

## 7) Increment UX priorise (testable)

### Increment UX-PDP-Story-1 (P1)

Scope:
- `src/pages/ProductPage.jsx`
- classes panel/media associees dans `src/index.css`

Acceptance criteria:
- AC1: slot storytelling existe dans `product-detail__panel` avec ratio `4:5` sur mobile et desktop;
- AC2: ordre fallback applique strictement (`feed -> premium fallback -> local poster`) sans placeholder generique;
- AC3: reduced-motion et echec video tombent sur poster premium sans regression UX du bloc action;
- AC4: regles crop-safe hero + cards referencees et liees aux surfaces [MOM-152](/MOM/issues/MOM-152) et [MOM-157](/MOM/issues/MOM-157).

Instrumentation minimale recommandee:
- `pdp_story_media_rendered` (mode: feed|premium_video|poster)
- `pdp_story_media_failed`
- `product_detail_source_click`

## 8) Checklist handoff engineering (implementation-ready)

1. Ajouter bloc storytelling dans `article.product-detail__panel` avant bloc `1. Identite`.
2. Introduire map centralisee d'assets premium locaux (hero/cards/storytelling/poster).
3. Supprimer tout fallback `via.placeholder.com` sur PDP et cards.
4. Appliquer ordre fallback obligatoire pour `product-gallery` et `product-card__media`.
5. Ajouter styles du slot storytelling avec ratio 4:5 + `object-fit: cover`.
6. En `prefers-reduced-motion`, forcer poster statique.
7. Ajouter gestion d'erreur media avec bascule poster et statut discret.
8. Verifier crop-safe en captures 360px / 768px / 1024px / 1440px sur hero + cards + PDP panel.
9. Verifier clavier: navigation gallery + focus CTA inchanges.
10. Valider tracking des 3 evenements pour mesure post-release.
