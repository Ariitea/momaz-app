# MOM-141 - Blueprint de Contenu UX/UI Premium (FR)

## 1) Cadre et objectif

Ce blueprint transforme la direction creative V1 de [MOM-135](/MOM/issues/MOM-135) en plan d'execution page par page, directement exploitable par UX/UI et frontend, sans modifier le pipeline data ni le routing existant (`/` et `/product/:id`).

Intentions non negociables:
- Ton luxe editorial sobre (pas de messaging promotionnel agressif)
- Hierarchie visuelle claire avant densite catalogue
- Performance et lisibilite preservees
- Compatibilite responsive native

## 2) Materiaux de reference V1

Base assets issue de [MOM-134](/MOM/issues/MOM-134):
- Hero homepage 16:9: `docs/assets/mom-134/hero-homepage-master.jpg`
- Visuels catalogue 4:5: `docs/assets/mom-134/catalog-visual-01.jpg`, `catalog-visual-02.jpg`, `catalog-visual-03.jpg`
- Storytelling loop 16:9 (8s): `docs/assets/mom-134/storytelling-loop-01.mp4`
- Metadata/alt/narration: `docs/assets/mom-134/asset-metadata.json`

Regle de coherence:
- 1 point focal dominant par section media
- Contraste controle + espace negatif reserve aux overlays texte
- Composition compatible recadrage mobile 360px

## 3) Blueprint page 1 - Homepage / Catalogue

### 3.1 Role de la page
- Ouvrir sur une promesse premium immediate
- Amener rapidement vers l'exploration produit
- Maintenir un rythme editorial -> utilitaire -> editorial

### 3.2 Hierarchie de contenu (au-dessus de la ligne de flottaison)
1. Hero editorial (impact + contexte)
2. Manifeste court (1-2 phrases)
3. CTA de decouverte vers la grille
4. Indicateurs de curation (ex: total pieces, familles, nouveautes)

### 3.3 Hierarchie de contenu (sous la ligne de flottaison)
1. Bloc inventaire (resultats + contexte actif)
2. Toolbar de filtrage/recherche/tri
3. Chips d'etat actif
4. Grille produits
5. Respiration editoriale intermediaire (visuel ou storytelling loop)
6. Continuation de grille / pagination "Afficher plus"

### 3.4 Coexistence storytelling premium vs browsing
- Le hero installe la desirabilite, la grille confirme la valeur pratique.
- Le storytelling ne bloque jamais les controles catalogue.
- Chaque insertion editoriale (visuel/loop) doit servir une intention claire:
  - relancer l'attention,
  - contextualiser la selection,
  - puis ramener vers des cartes actionnables.

### 3.5 Wireframe textuel - Desktop

```text
[Hero pleine largeur 16:9]
  Kicker
  Titre premium (serif)
  Promesse courte
  CTA principal
  3 indicateurs de curation

[Bloc inventaire]
  Titre section + nb resultats
  Toolbar: Recherche | Categorie | Tri | Reset
  Chips d'etat

[Grille produits 4->3->2 colonnes]
  Cartes 4:5 (image, categorie, titre, prix, meta)

[Respiration editoriale]
  Visuel storytelling ou loop mute + poster

[CTA Afficher plus]
```

### 3.6 Wireframe textuel - Mobile

```text
[Hero compact 4:5 ou 16:9 recadre]
  Kicker
  Titre
  Promesse
  CTA

[Toolbar verticale]
  Recherche pleine largeur
  Categorie
  Tri
  Reset

[Chips horizontales scrollables]
[Grille 2 colonnes]
[Respiration editoriale ponctuelle]
[Afficher plus]
```

## 4) Blueprint page 2 - Product Detail Page

### 4.1 Role de la page
- Transformer l'interet visuel en intention d'action (CTA source)
- Concilier desir editorial et clarte decisionnelle

### 4.2 Hierarchie visuelle cible
1. Retour catalogue + contexte categorie
2. Titre produit + prix (lisibles immediatement)
3. Galerie hero (visuel principal + miniatures)
4. Bloc storytelling produit
5. Bloc attributs/metadata
6. CTA source (prioritaire, explicite)
7. Produits associes (continuite d'exploration)

### 4.3 Placement storytelling
- Storytelling court en 3 actes:
  - Acte 1: Identite (piece, intention, style)
  - Acte 2: Matiere/detail (preuves percue de qualite)
  - Acte 3: Projection usage (pourquoi maintenant)
- Le texte ne doit pas repousser le CTA hors zone utile en mobile.

### 4.4 Composition imagery + metadata + CTA
- Desktop: split 60/40 (galerie / contenu)
- Mobile: sequence verticale galerie -> narration -> metadata -> CTA
- Metadata structuree en liste concise (sans surcharge)
- CTA unique principal: libelle orientee action et confiance

### 4.5 Wireframe textuel - Desktop

```text
[Retour catalogue]                      [Reference produit]
[Categorie]
[Titre]
[Prix]

[Colonne gauche 60%]                   [Colonne droite 40%]
  Image principale                        Bloc Identite
  Miniatures                              Bloc Attributs
                                          Bloc Storytelling court
                                          CTA source principal

[Produits associes]
```

### 4.6 Wireframe textuel - Mobile

```text
Retour
Categorie
Titre
Prix
Image principale
Miniatures
Bloc Identite
Bloc Attributs
Bloc Storytelling
CTA source principal
Produits associes
```

## 5) Direction motion / interaction

Tone motion: cinematique maitrisee, jamais demonstrative.

A rendre "cinematique":
- Apparition hero (fade + leger deplacement)
- Transition d'entree des cartes en cascade courte
- Focus galerie produit (transition image douce)

A garder "retenu":
- Hover CTA
- Etats toolbar/chips
- Feedback de filtres

Regles:
- Duree cible UI: 160-280ms
- Stagger cartes: 30-50ms (plafond total 300ms)
- `prefers-reduced-motion: reduce` desactive les animations non essentielles

## 6) Logique d'integration de contenu

### 6.1 Ou placer hero / visuels / loop
- Hero 16:9 en tete homepage
- Visuels 4:5 dans la grille et respirations editoriales
- Storytelling loop entre blocs catalogue (jamais en lecture forcee avec son)

### 6.2 Fallbacks obligatoires
- Loop indisponible: poster statique (hero ou visuel 4:5 selon contexte)
- Image manquante: visuel secondaire du batch V1
- Alt text absent: fallback depuis metadata standardisee

### 6.3 Adaptation responsive
- Priorite mobile: lisibilite de la promesse + acces filtres + CTA produit visible vite
- Recadrage hero preserve zone texte securisee
- Cartes restent coherentes a 2 colonnes sans collision meta

## 7) Guidance execution UX/UI + Frontend

### 7.1 UX/UI Designer
- Produire maquettes desktop/mobile a partir des wireframes ci-dessus
- Fixer les zones de respiration editoriale (points exacts entre blocs)
- Verrouiller l'ordre des informations critiques (titre/prix/CTA)

### 7.2 Frontend Engineer
- Ne pas modifier pipeline data
- Ne pas introduire de nouveau routing
- Implementer la hierarchie de sections et les transitions selon les seuils motion
- Verifier les fallbacks media en mode degrade

## 8) Checklist de validation avant implementation

- Hero lisible en < 3s sur 360px et 1440px
- Navigation catalogue sans perte de contexte
- CTA source visible sans friction sur fiche produit
- Motion sobre et coherent avec le ton premium
- Fallback media valides (image/loop/alt)
- Contrastes et focus conformes AA

## 9) Livrables confirms pour MOM-141

- Blueprint page par page (homepage/catalogue + product detail)
- Wireframes textuels desktop/mobile
- Guidance de placement de contenu
- Recommandations motion/interaction
- Logique d'integration et fallback responsive
