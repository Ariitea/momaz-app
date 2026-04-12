# MOM-121 - Blueprint UX/UI V3 Premium (FR)

## 1) Contexte et objectif produit

Momaz dispose deja d'une base fonctionnelle React:
- listing catalogue
- recherche, filtre, tri
- fiche produit avec galerie
- lien vers source externe

Objectif V3: transformer cette base en experience e-shop premium editoriale, sans changer le pipeline data ni la structure de routing (`/` et `/product/:id`).

## 2) Synthese recherche utilisateur (hypotheses actionnables)

### 2.1 Segments cibles
- Curateur exigeant: veut scanner vite puis ouvrir quelques pieces fortes.
- Acheteur inspirationnel: veut immersion visuelle et narration.
- Acheteur comparatif: veut prix, disponibilite, collection et sortie externe rapide.

### 2.2 Frictions observees sur la base actuelle
- Densite d'information bonne, mais hierarchie premium encore trop "outil".
- Toolbar efficace, mais manque de guidance editoriale (intention de collection, contexte visuel).
- Fiche produit claire, mais narration faible entre visuel, attributs et CTA source.

### 2.3 Principes UX V3
- Montrer moins, signifier plus: prioriser l'intention curatoriale.
- Rythme editorial: alterner respiration (hero, espacements) et densite (grille, meta).
- Continuites de navigation: filtre conserve + retour catalogue sans perte de contexte.
- Transparence du statut produit: prix/disponibilite/source visibles sans ambiguïte.

## 3) Journey map cible (end-to-end)

### Etape A - Entree catalogue
- Intention: comprendre le ton premium et l'etendue de collection.
- UI: hero editoriale + KPI synthese.
- KPI: taux de scroll hero -> grille >= 75%.

### Etape B - Affinage
- Intention: reduire rapidement l'espace de recherche.
- UI: toolbar sticky (desktop) avec recherche, categorie, tri, reset.
- KPI: temps median jusqu'au 1er clic produit <= 35s.

### Etape C - Exploration carte
- Intention: prequalifier sans ouvrir chaque fiche.
- UI: cards plus hierarchisees (image, titre, prix, metadata compacte).
- KPI: CTR carte -> fiche >= 18%.

### Etape D - Fiche produit
- Intention: confirmer desir et confiance avant sortie externe.
- UI: galerie immersive + panel narration en 3 actes (identite, attributs, action).
- KPI: taux de clic source externe depuis fiche >= 22%.

### Etape E - Retour catalogue
- Intention: reprendre la recherche au bon niveau de scroll/filtre.
- UI: restoration scroll + query params (deja present, a conserver).
- KPI: rebond post-retour <= 25%.

## 4) Architecture de l'information (IA)

### 4.1 Niveau application
- Niveau 1: Catalogue (`/`)
- Niveau 2: Produit (`/product/:id`)

### 4.2 Catalogue (zones)
- Z1 Hero editoriale (kicker, titre, manifeste, stats)
- Z2 Entete inventaire (result count + contexte actif)
- Z3 Toolbar controle (search/filter/sort/reset)
- Z4 Chips d'etat actif
- Z5 Grille produits
- Z6 Pagination progressive ("Afficher plus")

### 4.3 Produit (zones)
- Z1 Navigation retour + ID
- Z2 Headline (categorie, titre, prix)
- Z3 Galerie (visuel principal + miniatures)
- Z4 Panel narration
- Z5 Bloc produits associes

## 5) Wireframes textuels implementation-ready

## 5.1 Catalogue desktop
```
[Hero editorial plein largeur contenu]
  Kicker
  Titre serif impactant
  Sous-texte curatoriel
  3 KPI (Total / Visibles / Familles)

[Panel inventaire]
  [Titre section + nb resultats]
  [Toolbar 4 colonnes: Search | Categorie | Tri | Reset]
  [Chips etat actif]
  [Grille cartes 4/3/2 colonnes selon breakpoint]
  [CTA afficher plus]
```

## 5.2 Catalogue mobile
```
[Hero compact]
[Panel]
  Search (full width)
  Categorie (full width)
  Tri (full width)
  Reset (full width)
  Chips scrollables horizontalement
  Grille cartes 2 colonnes
  Afficher plus
```

## 5.3 Fiche produit desktop
```
[Retour catalogue]                         [ID]
[Categorie]
[Titre produit]
[Prix]

[Colonne gauche 60%]   [Colonne droite 40%]
  Image principale       Bloc 1 Identite
  Miniatures             Bloc 2 Attributs (dl)
                         Bloc 3 Action (CTA source + note)

[Section produits associes]
```

## 5.4 Fiche produit mobile
```
Retour
Headline
Image principale
Miniatures
Bloc Identite
Bloc Attributs
Bloc Action
Produits associes (2 colonnes)
```

## 6) Design system V3 (specs)

### 6.1 Typographie
- Display editorial: `Cormorant Garamond` (deja en place) pour H1/H2 premium.
- Texte utilitaire: `Manrope` pour controles, meta, labels.
- Echelle:
  - Hero titre: `clamp(2.2rem, 3.4vw + 0.7rem, 4.4rem)`
  - Section titre: `clamp(1.3rem, 1.2vw + 0.8rem, 2rem)`
  - Body: `1rem` / `line-height: 1.55`
  - Meta: `0.72rem-0.82rem`, uppercase trackee.

### 6.2 Layout et spacing
- Container max: `1320px` (conserve).
- Grille principale: espace vertical section `18-24px`.
- Rythme interne cards/panels: pas de 4px (`8/12/16/24/32`).
- Rayons: conserver token `--radius-*`, augmenter coherence sur mini-elements (chips/thumbs).

### 6.3 Palette premium
- Conserver socle actuel (ivoire + bronze + vert profond).
- Renforcer contraste texte secondaire pour atteindre AA.
- Token recommande:
  - Texte principal >= 7:1 sur surfaces claires.
  - Texte secondaire >= 4.5:1.
  - Focus ring unique: `#6d4a0f` (deja coherent).

### 6.4 Cards et media
- Image ratio conserve `4:5` pour coherence editorial mode.
- Overlay categorie plus discret (opacite reduite, blur leger).
- CTA de carte uniquement en fin de bloc avec contraste suffisant.

### 6.5 Motion
- Hover card: translation max `-4px` + shadow progressive (deja present).
- Ajouter apparition en cascade a l'entree de grille (stagger 30-50ms par carte, max 300ms).
- Respect `prefers-reduced-motion: reduce` -> desactivation transitions non essentielles.

## 7) Exigences accessibilite (non-negociables)

- WCAG 2.2 AA sur toutes vues catalogue + fiche.
- Focus visible sur tous elements interactifs (deja base presente, a etendre).
- Ordre tab logique: hero -> toolbar -> chips -> cartes -> pagination.
- Cibles tactiles min 44x44 px (miniatures deja conformes).
- `aria-live="polite"` sur message de resultats filtres (nouvelle exigence).
- Etats erreurs et vides avec role `alert` ou `status` contextuel.
- Lien externe source: mention explicite "nouvel onglet" (deja partiel, a homogeniser).
- Tests clavier:
  - navigation toolbar complete sans souris
  - miniatures galerie: fleches/home/end (deja implemente)

## 8) Increments UX prioritises (testables)

## Increment 1 - Hierarchie catalogue premium
- Portee: hero + entete panel + toolbar densite/rythme.
- Impact attendu: meilleure comprehension de collection et orientation initiale.
- Acceptance criteria:
  - Hero lisible en 3 secondes (kicker + titre + promesse) sur 360px et 1440px.
  - Toolbar utilisable entierement clavier, sans piege focus.
  - Aucune regression sur recherche/filtre/tri existants.
- KPI:
  - Scroll hero -> grille >= 75%
  - Temps median 1er clic produit <= 35s.

## Increment 2 - Carte produit editoriale
- Portee: hierarchie contenu carte, traitement media, meta compacte.
- Impact attendu: hausse du CTR vers fiche.
- Acceptance criteria:
  - Titre, prix, categorie, disponibilite lisibles sans hover.
  - Etat hover et focus equivalents en feedback visuel.
  - Grille reste stable entre 168px et 320px de largeur carte.
- KPI:
  - CTR carte -> fiche >= 18%
  - Diminution taux retour immediat catalogue (<10s) de 15%.

## Increment 3 - Fiche storytelling + CTA externe
- Portee: headline produit, narration en blocs, CTA source.
- Impact attendu: confiance + clic sortant qualifie.
- Acceptance criteria:
  - Information essentielle visible sans scroll sur desktop (titre, prix, CTA).
  - CTA source unique, explicite, accessible clavier et lecteur ecran.
  - Bloc attributs aligne et robuste aux valeurs manquantes.
- KPI:
  - Clic source externe >= 22%
  - Temps moyen sur fiche >= 55s.

## Increment 4 - Continuite de parcours et related products
- Portee: retour catalogue, produits associes, continuites d'exploration.
- Impact attendu: plus de sessions multi-fiches.
- Acceptance criteria:
  - Retour catalogue restaure scroll + filtres dans 100% des cas nominals.
  - Produits associes toujours affiches si >=1 item meme categorie.
  - Message clair si aucun associe.
- KPI:
  - Nb median fiches vues/session +20%
  - Rebond post-retour <= 25%.

## 9) Spec engineering (mapping direct composants actuels)

- `src/components/ProductGrid.jsx`
  - Conserver logique URL params et restoration scroll.
  - Ajouter region `aria-live` pour feedback de filtre.
  - Prevoir classe state pour toolbar sticky desktop.

- `src/components/ProductCard.jsx`
  - Reprioriser ordre visuel: categorie (badge discret) -> titre -> prix -> meta.
  - Uniformiser libelles fallback (sans caracteres ambigus).

- `src/pages/ProductPage.jsx`
  - Conserver navigation galerie clavier existante.
  - Rendre CTA source plus prominent au-dessus de la note explicative.
  - Garder logique related products actuelle (categorie + recence).

- `src/index.css`
  - Consolidation tokens contrastes/espacements.
  - Ajouter media query `prefers-reduced-motion`.
  - Verifier contrastes AA sur chips/meta/labels secondaires.

## 10) Plan de validation UX

- QA fonctionnelle:
  - Recherche, filtre, tri, reset, afficher plus.
  - Aller/retour fiche <> catalogue avec conservation contexte.
- QA accessibilite:
  - Navigation clavier complete
  - Audit contraste automatise + spot-check manuel
  - Verification annonces lecteurs ecran (NVDA/VoiceOver)
- QA performance percue:
  - LCP visuel hero + grille
  - fluidite scroll/hover sur mobile milieu de gamme

## 11) Risques et decisions business a escalader uniquement si necessaire

Aucun blocker business critique a ce stade.
Decisions optionnelles (non bloquantes) a arbitrer par PO si souhait d'optimisation:
- niveau de theatralîte motion (sobre vs editoriale marquee)
- intensite visuelle du hero selon positionnement marque final

