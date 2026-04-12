# MOM-144 - Ecrans UX/UI annotes (Desktop + Mobile) et spec d'implementation

## 1) Objectif et perimetre

Ce document convertit le blueprint [MOM-141](/MOM/issues/MOM-141) en spec UX/UI actionnable pour l'implementation des pages:
- `/` (homepage/catalogue)
- `/product/:id` (fiche produit)

Perimetre:
- 4 variantes minimales: homepage desktop/mobile + PDP desktop/mobile
- annotations de hierarchie, espacement, ordre de contenu, comportements interactifs
- contraintes accessibilite, responsive et fallback data/media
- increments UX prioritises avec criteres d'acceptation mesurables

Hors perimetre:
- changement de routing
- changement pipeline data
- implementation React/CSS dans ce ticket

## 2) Synthesis UX (recherche/contraintes produit)

### 2.1 Signaux utilisateurs exploites
- Utilisateur exploration rapide: besoin de filtrer et comparer vite dans un catalogue dense.
- Utilisateur desirabilite premium: attend un ton editorial, une respiration visuelle, sans perdre les controles.
- Utilisateur decision PDP: veut verifier image, prix, disponibilite, puis agir (ouvrir source) sans friction.

### 2.2 Risques UX a traiter
- Hero trop dominant qui retarde l'entree catalogue.
- CTA PDP repousse sous la ligne de flottaison mobile par narration longue.
- Perte de contexte retour catalogue (scroll + filtres).
- Degradation accessibilite (focus faible, contraste insuffisant, motion excessive).

## 3) Journey map cible (condensee)

1. Arrivee homepage -> comprehension positionnement premium en <= 3s.
2. Passage toolbar/chips -> reduction de l'espace de choix en <= 2 interactions.
3. Ouverture PDP -> validation visuelle + metadata + action source en sequence claire.
4. Retour catalogue -> conservation des filtres/query + restoration scroll.

## 4) IA et ordre de contenu

## 4.1 Homepage (`/`)
1. `catalog-hero` (promesse + stats)
2. `catalog-panel__heading` (contexte inventaire)
3. `products-toolbar` (recherche/categorie/tri/reset)
4. `products-toolbar__chips` (etat actif)
5. `products-grid` (cartes)
6. `products-load-more` (progression)

## 4.2 PDP (`/product/:id`)
1. `product-detail__nav` (retour + ID)
2. `product-detail__headline` (categorie/titre/prix)
3. `product-detail__layout`
4. `product-gallery` (visuel principal + miniatures)
5. `product-detail__panel` (identite, attributs, action)
6. `related-products` (continuite exploration)

## 5) Wireframes annotes - Homepage

## 5.1 Desktop (>= 1025px)

Canvas cible: `1320px` max, padding shell `28/22/70`.

```text
[01 Hero editorial - catalog-hero]
  - Kicker
  - H1 premium
  - Sous-texte + caption
  - 3 stats (Total / Visibles / Familles)
  - Raison d'ordre: desirabilite immediate puis preuve chiffrable

[02 Inventaire - catalog-panel]
  [02A Heading] titre + total resultats
  [02B Toolbar 4 colonnes]
    - Recherche (dominante largeur)
    - Categorie
    - Tri
    - Reset
  [02C Chips etat actif]
  [02D Grille cartes 244px min]
  [02E CTA "Afficher plus"]
```

Annotations implementation:
- Espace vertical Hero -> Panel: `18px`.
- Toolbar desktop: `minmax(260,1.7fr) + 2x minmax(190,1fr) + auto`.
- Cartes: ratio image `4:5`, densite reguliere, gap `18px`.
- Zone recadrage hero securisee: centre + tiers gauche pour texte (eviter overlays sur zones fortes).

## 5.2 Mobile (<= 640px)

```text
[01 Hero compact]
  Kicker
  H1
  Sous-texte
  Stats empilees (1 colonne)

[02 Panel compact]
  Heading
  Toolbar verticale (1 colonne)
  Chips scrollables/wrap
  Grille 2 colonnes fluides (min 168px)
  Bouton "Afficher plus" plein axe de lecture
```

Annotations implementation:
- Padding cartes/panels: `14px`.
- Gap grille mobile: `12px`.
- Priorite interaction pouce: cibles >= `44px` (deja respecte sur inputs/boutons).
- Aucun bloc editorial ne doit s'intercaler entre toolbar et premiers produits sur mobile.

## 6) Wireframes annotes - PDP

## 6.1 Desktop (>= 1025px)

```text
[01 Nav]
  Retour catalogue                                  ID

[02 Headline]
  Categorie
  Titre produit
  Prix

[03 Layout 2 colonnes]
  [Gauche ~56%] Galerie
    - image principale (max-height 640)
    - miniatures
  [Droite ~44%] Panel narration/action
    - Bloc 1 Identite
    - Bloc 2 Attributs (dl)
    - Bloc 3 Action (CTA source + note)

[04 Related products]
```

Annotations implementation:
- Ratio layout actuel `1.25fr / 1fr` valide pour lecture premium + clarte action.
- CTA source doit rester visible dans la premiere hauteur d'ecran desktop standard (900px) avec contenu nominal.
- Related products toujours apres action principale (jamais avant).

## 6.2 Mobile (<= 1024px, focus <= 640px)

```text
Retour + ID
Categorie
Titre
Prix
Image principale
Miniatures
Bloc Identite
Bloc Attributs
Bloc Action (CTA prioritaire)
Produits associes
```

Annotations implementation:
- Passage a `1 colonne` sous `1024px`.
- Miniatures tactiles >= `44x44` (64/56 actuellement).
- Regle critique: CTA source visible sans depasser 1.5 viewport apres headline sur contenu nominal.
- Si narration depasse 5 lignes, tronquer avec "Lire plus" (increment UX suivant, voir section 11).

## 7) Motion map (avec fallback reduce)

| Element | Intention | Timing cible | Reduce motion |
|---|---|---:|---|
| Hero apparition | Installer ton premium | 220-280ms | Apparition immediate |
| Cartes grille (entree) | Donner rythme de curation | 180-220ms + stagger 30-45ms | Sans stagger |
| Hover carte | Feedback discret | 160-200ms | Aucun mouvement Y |
| Changement image galerie | Continuite visuelle | 180-220ms | Cut instantane |
| Focus controles | Lisibilite clavier | <=120ms | identique |

Contraintes:
- plafond animation sequence liste: `300ms`
- aucune animation bloquante sur filtrage
- respecter `prefers-reduced-motion: reduce`

## 8) Accessibilite (AA) et exigences testables

1. Contraste texte principal/fond >= `4.5:1`, texte large >= `3:1`.
2. Ordre de tabulation: hero -> toolbar -> chips -> grille -> load more -> footer logique.
3. Focus visible sur tous controles interactifs (outline >= 2px perceptible).
4. Champs formulaire avec labels explicites (recherche/categorie/tri).
5. Images:
- hero/editorial: alt descriptif contextualise
- galerie: alt indexe coherent
- fallback alt si metadata absente
6. Etats erreur/empty avec role ARIA deja presents (`role=alert` ou `status`) a conserver.
7. Miniatures galerie pilotables clavier (`ArrowLeft/Right/Home/End`) a conserver.

## 9) Responsive et zones crop-safe

Breakpoints de reference:
- Desktop: `>=1025px`
- Tablet/mobile large: `641-1024px`
- Mobile: `<=640px`

Zones media:
- Hero: proteger la bande texte sur tiers gauche/central.
- Cartes produits `4:5`: sujet centre, marge de securite 8% haut/bas.
- Galerie PDP: eviter recadrage extremite produit (marge interne recommandee 6%).

Fallbacks obligatoires:
- `product.images` vide -> placeholder (deja en place)
- `product_url` absent -> message non bloquant (deja en place)
- prix nul/0 -> "Prix sur demande" (deja en place)
- metadata absente -> valeurs de secours explicites (deja en place)

## 10) Handoff engineering (implementation-ready)

Sections exactes a implementer/valider:
- Homepage: `catalog-hero`, `catalog-panel`, `products-toolbar`, `products-toolbar__chips`, `products-grid`, `products-load-more`
- PDP: `product-detail__nav`, `product-detail__headline`, `product-detail__layout`, `product-gallery`, `product-detail__panel`, `related-products`

Checklist de validation technique:
1. Conservation querystring + scroll restoration catalogue -> PDP -> catalogue.
2. Visibilite CTA PDP mobile dans la fenetre d'action (<= 1.5 viewport apres headline).
3. Aucun overflow horizontal entre `320px` et `1440px`.
4. Focus clavier non masque sur tous composants interactifs.
5. Etats loading/error/empty verifies sur homepage et PDP.
6. Perf percue: interactions filtre/tri sans animation bloquante.

## 11) UX increments prioritises (testables)

## Increment 1 - P0 (bloquant release UX)
Objectif: garantir parcours catalogue -> action PDP sans friction.
- Scope:
  - stabiliser ordre blocs mobile PDP pour remonter l'action
  - confirmer CTA visible rapidement
  - verifier continuation catalogue (query + scroll)
- Acceptance criteria:
  - Sur viewport `390x844`, CTA source visible sans depasser 1.5 viewport apres headline
  - Retour catalogue restaure scroll <= 300ms apres navigation
  - 0 regression sur filtres actifs au retour
- KPI cible:
  - baisse de 20% des sorties PDP sans clic action

## Increment 2 - P1
Objectif: renforcer lisibilite des etats catalogue.
- Scope:
  - clarifier chips actives et relation avec resultats visibles
  - harmoniser densite toolbar en tablette
- Acceptance criteria:
  - utilisateur identifie etat filtre actif en <= 2s (test modere 5 participants)
  - reset ramene a vue defaut en 1 action, sans ambiguite
- KPI cible:
  - reduction de 15% des reinitialisations successives (<10s)

## Increment 3 - P1
Objectif: fiabiliser experience media degradee.
- Scope:
  - fallback visuel et alt systematiques
  - normalisation messages indisponibilite source
- Acceptance criteria:
  - 100% produits sans image affichent placeholder sans rupture layout
  - 100% produits sans URL affichent etat explicite non bloquant
- KPI cible:
  - 0 erreur UI bloquante sur echantillon QA de 200 produits

## 12) Blocages business potentiels (a escalader seulement si decides)

Aucun blocage business immediate detecte pour executer MOM-144.
Decision eventuelle a arbitrer plus tard: troncature narrative PDP ("Lire plus") vs texte integral par defaut.

## 13) Resultat attendu de ce lot MOM-144

Le lot fournit un cadre UX complet, testable et directement executable par frontend sans ambiguite structurelle, avec priorisation incrementale et mesures de succes associees.
