# MOM-150 - Spec UX immersive luxe (FR)

## 1) But produit et resultat attendu

Momaz doit evoluer d'un catalogue efficace vers une experience editoriale premium, immersive et credible pour des produits percussifs visuellement.

Resultat attendu:
- perception premium immediate en page d'accueil
- parcours guide de la decouverte au produit
- decision produit fluide vers action externe
- implementation faisable sans changer routing ni pipeline data

Perimetre:
- homepage/catalogue (`/`)
- fiche produit (`/product/:id`)
- specifications UX/UI et motion implementation-ready

Hors perimetre:
- changement de schema data
- nouvelle route applicative
- implementation React dans ce ticket

## 2) Synthese recherche utilisateur (actionnable)

### 2.1 Personas operationnels
- Curateur rapide: veut filtrer vite puis comparer 3 a 5 pieces.
- Acheteur aspirationnel: attend une narration visuelle avant la fiche technique.
- Acheteur decideur: veut prix, disponibilite, source externe sans ambiguite.

### 2.2 Frictions detectees
- Experience trop utilitaire en entree: manque de "mise en scene".
- Catalogue trop homogene: rythme editorial insuffisant.
- PDP claire mais narration faible avant le CTA.
- Risque d'overdesign qui deteriore vitesse de comprehension.

### 2.3 Principes UX directeurs
- Experience avant listing: la page raconte avant de lister.
- Progressivite: orienter puis laisser explorer.
- Clarte transactionnelle: CTA et informations cle visibles tot.
- Continuite de contexte: retour catalogue sans perte filtres/scroll.

## 3) Journey map cible (homepage -> catalogue -> produit)

1. Arrivee hero
- Intention utilisateur: comprendre la promesse en moins de 3 secondes.
- Reponse UX: hero cinematic, texte court, preuve par stats.
- Signal de succes: scroll hero -> panel catalogue >= 78%.

2. Affinage catalogue
- Intention utilisateur: reduire l'espace de choix rapidement.
- Reponse UX: toolbar lisible, chips actives, ordre de controle clair.
- Signal de succes: temps median premier clic produit <= 30s.

3. Exploration cartes
- Intention utilisateur: prequalifier sans ouvrir toutes les fiches.
- Reponse UX: cartes editoriales avec hierarchie image/titre/prix/dispo.
- Signal de succes: CTR carte -> fiche >= 20%.

4. Validation en PDP
- Intention utilisateur: desir + verification + action.
- Reponse UX: galerie immersive puis narration puis CTA source.
- Signal de succes: clic sortant source >= 24%.

5. Retour et poursuite
- Intention utilisateur: continuer la selection sans repartir de zero.
- Reponse UX: restauration query + scroll + etat filtres.
- Signal de succes: abandon post-retour <= 22%.

## 4) Architecture de l'information (IA)

### 4.1 Niveau application
- Niveau 1: Catalogue (`/`)
- Niveau 2: Produit (`/product/:id`)

### 4.2 Homepage / Catalogue
- Z1 `catalog-hero`: promesse editoriale + stats
- Z2 `catalog-panel__heading`: contexte inventaire
- Z3 `products-toolbar`: recherche / categorie / tri / reset
- Z4 `products-toolbar__chips`: etats actifs
- Z5 `products-grid`: cartes produits
- Z6 `products-load-more`: continuation

### 4.3 PDP
- Z1 `product-detail__nav`: retour + identifiant
- Z2 `product-detail__headline`: categorie, titre, prix
- Z3 `product-gallery`: media principal + miniatures
- Z4 `product-detail__panel`: narration, attributs, action
- Z5 `related-products`: relance d'exploration

## 5) Wireframes textuels (implementation-ready)

### 5.1 Homepage desktop
```text
[Hero immersif]
  Kicker court
  H1 editorial fort
  Sous-texte (1 a 2 lignes)
  3 stats de preuve

[Panel catalogue]
  Heading + resultat courant
  Toolbar 4 colonnes: Search | Categorie | Tri | Reset
  Chips d'etat actif
  Grille cartes (4/3/2 colonnes selon largeur)
  Bouton Afficher plus
```

Regles:
- Hero lisible sans overlap sur 1280 a 1440.
- Aucune insertion de bloc editorial entre toolbar et debut grille.
- 1ere ligne de cartes visible sans friction juste apres hero.

### 5.2 Homepage mobile
```text
[Hero compact]
  Kicker
  H1
  Sous-texte
  Stats empilees

[Panel vertical]
  Search pleine largeur
  Categorie pleine largeur
  Tri pleine largeur
  Reset pleine largeur
  Chips scrollables
  Grille 2 colonnes
  Afficher plus
```

Regles:
- Cibles tactiles >= 44x44.
- Densite controlee, pas de surcharge textuelle.

### 5.3 PDP desktop
```text
[Retour catalogue]                                   [ID]
[Categorie]
[Titre]
[Prix]

[Colonne gauche 56%]          [Colonne droite 44%]
  Media principal               Bloc Identite
  Miniatures                    Bloc Attributs
                                Bloc Action (CTA source)

[Produits associes]
```

Regles:
- CTA source visible dans la premiere hauteur d'ecran standard desktop.
- Ordre narratif fixe: desir -> preuve -> action.

### 5.4 PDP mobile
```text
Retour + ID
Categorie
Titre
Prix
Image principale
Miniatures
Bloc Identite
Bloc Attributs
Bloc Action
Produits associes
```

Regles:
- CTA source visible avant 1.5 viewport apres headline.
- Miniatures pilotables tactile + clavier.

## 6) Design system haute-fidelite (specs)

### 6.1 Typographie
- Display: `Cormorant Garamond` (hero, titres impactants).
- UI/body: `Manrope` (controle, metadata, texte courant).
- Echelle:
  - Hero H1: `clamp(2.4rem, 3.2vw + 0.9rem, 4.8rem)`
  - Titre section: `clamp(1.3rem, 1.1vw + 0.8rem, 2rem)`
  - Body: `1rem`, line-height `1.55`
  - Meta: `0.75rem` a `0.85rem`, uppercase trackee

### 6.2 Palette et contraste
<<<<<<< HEAD
- Base: ivoire, bronze, vert profond.
- Surfaces: eviter blanc pur uniforme; utiliser variations de tons sobres.
- Contraste minimal:
  - texte principal >= 7:1
  - texte secondaire >= 4.5:1
- Focus ring global: `#6d4a0f` (2px min, perceptible partout)
=======
- Systeme couleur officiel verrouille: Option C (Ultra Minimal Sharp), validee board.
- Base palette officielle:
  - `--color-white: #FFFFFF`
  - `--color-black: #000000`
  - `--color-gray-300: #DADADA`
- Discipline:
  - aucune nouvelle couleur primaire autorisee
  - accent rare, intentionnel et non systematique
  - coherence stricte hero/catalogue/PDP
- Contraste minimal:
  - texte principal >= 7:1
  - texte secondaire >= 4.5:1
- Focus ring global: 2px minimum, contraste >= 3:1 sur surface voisine.
>>>>>>> c16edbe (Implement Momaz V4 immersive UX/UI)

### 6.3 Layout et grille
- Max container: `1320px`
- Echelle spacing: `8 / 12 / 16 / 24 / 32 / 48`
- Grille cartes:
  - desktop: min `244px`
  - mobile: min `168px`
- Ratio images cartes: `4:5`

### 6.4 Motion system
- Hero reveal: 220 a 280ms
- Entree cartes: 180 a 220ms, stagger 30 a 45ms
- Hover carte: translation max -4px
- Transition galerie PDP: 180 a 220ms
- `prefers-reduced-motion: reduce`: suppression stagger + translation

## 7) Accessibilite et exigences non-negociables

- WCAG 2.2 AA sur homepage et PDP.
- Focus visible sur tous les elements interactifs.
- Ordre tab logique et stable: hero -> toolbar -> chips -> grille -> load more.
- Labels explicites pour recherche, tri, categorie.
- Messages de resultat filtres avec region `aria-live="polite"`.
- Etats vide/erreur avec role `status` ou `alert` selon criticite.
- Lien externe source annonce "nouvel onglet".
- Navigation clavier galerie conservee (`Arrow`, `Home`, `End`).

## 8) Increments UX priorises (testables)

### Increment UX-1 (Priorite P0)
Intitule: Hero immersif + entree catalogue orientee

Portee:
- `catalog-hero`
- `catalog-panel__heading`
- rythme hero -> panel

Acceptance criteria:
- Promesse comprise en <= 3s sur 360px et 1440px (test guerrilla 5 personnes).
- Scroll hero -> panel >= 78% sur sessions qualifiees.
- Aucune regression Lighthouse mobile (Performance >= 68, A11y >= 94).

Mesure:
- event `hero_panel_transition`
- event `hero_seen_3s`

### Increment UX-2 (Priorite P0)
Intitule: Toolbar et filtration premium sans friction

Portee:
- `products-toolbar`
- `products-toolbar__chips`

Acceptance criteria:
- Parcours filtrage complet faisable clavier seul en <= 25s.
- `reset` restaure l'etat attendu en une action.
- Aucun piege focus sur breakpoints 360/768/1280.

Mesure:
- event `filter_apply`
- event `filter_reset`
- KPI `time_to_first_product_open`

### Increment UX-3 (Priorite P1)
Intitule: Cartes editoriales a forte desirabilite

Portee:
- hierarchie carte
- media et metadata

Acceptance criteria:
- Titre/prix/disponibilite lisibles sans hover.
- Ecart visuel coherent entre etat repos, hover et focus.
- Stabilite layout grille entre cartes longues et courtes.

Mesure:
- KPI `card_to_pdp_ctr >= 20%`
- event `product_card_open`

### Increment UX-4 (Priorite P1)
Intitule: PDP storytelling avec CTA hautement visible

Portee:
- `product-detail__headline`
- `product-gallery`
- `product-detail__panel`

Acceptance criteria:
- CTA source visible avant 1.5 viewport mobile.
- Informations critiques (titre, prix, CTA) visibles sans scroll desktop nominal.
- Lecture ecran du CTA claire et non ambigue.

Mesure:
- KPI `pdp_to_external_click >= 24%`
- event `pdp_cta_click`

### Increment UX-5 (Priorite P2)
Intitule: Continuite de parcours et relance exploration

Portee:
- restoration contexte catalogue
- `related-products`

Acceptance criteria:
- Retour PDP -> catalogue conserve query + scroll.
- Related products clicables au clavier et en tactile.
- Taux de reprise de navigation post-retour en hausse.

Mesure:
- event `catalog_context_restored`
- event `related_product_click`

## 9) Spec handoff engineering

### 9.1 Checklist implementation
1. Respect des sections cibles:
- homepage: `catalog-hero`, `catalog-panel`, `products-toolbar`, `products-toolbar__chips`, `products-grid`, `products-load-more`
- PDP: `product-detail__nav`, `product-detail__headline`, `product-detail__layout`, `product-gallery`, `product-detail__panel`, `related-products`
2. Aucun overflow horizontal de 320 a 1440.
3. Motion degrade proprement avec `prefers-reduced-motion`.
4. Validation clavier complete sur toolbar, grille, galerie, CTA.

### 9.2 Test matrix minimum
- Viewports: 360x800, 768x1024, 1280x800, 1440x900
- Input: clavier seul, tactile, souris
- Scenarios:
  - filtrer -> ouvrir produit -> retour catalogue
  - ouvrir source externe depuis PDP
  - fallback image/metadata absentes

## 10) Risques et blocages business

Aucun blocage business immediat.

Risques a surveiller:
- Si l'equipe exige video hero lourde, arbitrage business necessaire entre impact visuel et budget performance.
- Si ajout d'un long contenu editorial avant toolbar, risque de baisse d'efficacite discovery.

Decision blocker a escalader seulement si:
- demande explicite de privilegier esthetique au detriment des seuils perf/a11y definis.
<<<<<<< HEAD
=======

## 11) Color system final valide (board)

Decision board:
- Option C (Ultra Minimal Sharp) est validee et devient reference officielle.

Palette verrouillee:
- `#FFFFFF` (surfaces claires dominantes)
- `#000000` (texte principal, surfaces sombres, contrast anchors)
- `#DADADA` (surfaces secondaires, separateurs, etat neutre)

Regles non negociables:
- ne pas introduire de nouvelles couleurs primaires
- accent facultatif uniquement pour micro-emphase (liens ou focus ponctuel)
- pas d'accent continu sur de grands blocs
- coherence hero, catalogue, PDP obligatoire

Quick apply final (hero + product card):
```text
Hero:
- Fond dominant #FFFFFF
- Typo principale #000000
- Elements secondaires (rules/captions) #DADADA
- CTA primaire: fond #000000, texte #FFFFFF
- CTA secondaire: contour #000000, fond transparent

Product card:
- Surface carte #FFFFFF
- Titre + prix #000000
- Meta + separators #DADADA
- Etat hover: elevation/ombre uniquement (pas de nouvelle couleur)
- Focus ring: #000000 (2px min)
```

Mapping tokens implementation-ready:
- `--surface-primary: #FFFFFF`
- `--surface-secondary: #DADADA`
- `--text-primary: #000000`
- `--text-on-dark: #FFFFFF`
- `--border-subtle: #DADADA`
- `--action-primary-bg: #000000`
- `--action-primary-fg: #FFFFFF`
- `--focus-ring: #000000`

Acceptance criteria de verrouillage couleur:
- zero ajout de couleur primaire hors `#FFFFFF/#000000/#DADADA`
- contraste AA valide sur hero, toolbar, cartes, PDP CTA
- revue visuelle cross-page validee (hero/catalogue/PDP) sans derive chromatique
- guideline \"accent minimal\" respectee sur toutes vues

Outcome:
- identite visuelle nette, memorable et moderne, avec discipline chromatique forte.
>>>>>>> c16edbe (Implement Momaz V4 immersive UX/UI)
