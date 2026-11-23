---
id: html-css-04
title: Boîtes, flexbox et responsive
minutes: 15
summary: Le modèle de boîte, l'alignement avec flexbox et l'adaptation aux écrans de téléphone.
check:
  - prompt: "Avec `width: 300px; padding: 20px; border: 2px solid;` et le box-sizing par défaut, quelle largeur occupe la boîte ?"
    choices:
      - 300 px
      - 344 px
      - 322 px
    answer: 1
    explain: "Par défaut (content-box), width ne compte que le contenu : 300 + 2×20 + 2×2 = 344 px."
  - prompt: Quelle propriété aligne des éléments flex sur l'axe principal (horizontal par défaut) ?
    choices:
      - "`align-items`"
      - "`justify-content`"
      - "`text-align`"
    answer: 1
  - prompt: "Que fait `@media (max-width: 600px) { … }` ?"
    choices:
      - Applique les règles uniquement sur les écrans de 600 px de large ou moins
      - Limite la page à 600 px de large
      - Applique les règles sur les écrans de plus de 600 px
    answer: 0
---

## Tout est une boîte

Chaque élément est une boîte, faite de quatre couches, de l'intérieur vers l'extérieur :

| Couche | Rôle |
|---|---|
| **content** | le contenu (texte, image) |
| **padding** | l'espace intérieur, entre le contenu et la bordure |
| **border** | la bordure |
| **margin** | l'espace extérieur, entre la boîte et ses voisines |

```css
.carte {
  width: 300px;
  padding: 20px;
  border: 2px solid #ddd;
  margin: 16px;
}
```

## Le piège du box-sizing

Par défaut, `width` ne mesure **que le contenu**. La carte ci-dessus occupe donc
`300 + 20 + 20 + 2 + 2 = 344 px` de large. Trois cartes de « 300 px » ne tiennent pas dans
900 px, et la dernière passe à la ligne : un bug de mise en page classique.

```css
*, *::before, *::after {
  box-sizing: border-box;
}
```

Avec `border-box`, `width` inclut le padding et la bordure : la carte fait **vraiment**
300 px. Presque tous les projets modernes commencent par cette règle.

## Flexbox : aligner sans souffrir

Pour mettre des éléments côte à côte et les aligner, on déclare le parent en `display: flex` :

```html
<nav class="menu">
  <a href="/">Accueil</a>
  <a href="/cours">Cours</a>
  <a href="/profil">Profil</a>
</nav>
```

```css
.menu {
  display: flex;
  justify-content: space-between; /* axe principal : horizontal */
  align-items: center;            /* axe secondaire : vertical */
  gap: 16px;                      /* espace entre les éléments */
}
```

| Propriété (sur le parent) | Effet |
|---|---|
| `flex-direction: row` / `column` | ligne (par défaut) ou colonne |
| `justify-content` | répartition sur l'axe principal : `flex-start`, `center`, `space-between` |
| `align-items` | alignement sur l'axe secondaire : `stretch`, `center`, `flex-start` |
| `gap` | l'espace entre les enfants, sans bricoler les marges |
| `flex-wrap: wrap` | autorise le passage à la ligne quand la place manque |

> **Astuce** : `justify-content` et `align-items` échangent leur rôle quand
> `flex-direction: column`. Si un centrage « ne marche pas », vérifie la direction.

## Le responsive : un site, tous les écrans

Plus de la moitié des visites se font sur téléphone. Deux ingrédients :

1. La balise `viewport` dans le `<head>` (vue dans la première leçon). Sans elle, le téléphone
   affiche une version bureau minuscule.
2. Les **media queries**, des règles qui ne s'appliquent que sous certaines conditions :

```css
.cartes {
  display: flex;
  gap: 16px;
}

@media (max-width: 600px) {
  .cartes {
    flex-direction: column; /* sur petit écran, les cartes s'empilent */
  }
}
```

> **Attention** : une largeur fixe comme `width: 1200px` déborde sur un téléphone (390 px de
> large environ) et crée un défilement horizontal. Préfère `max-width: 1200px; width: 100%;`.

## Ce que tu sais faire maintenant

- Calculer la taille réelle d'une boîte, et utiliser `box-sizing: border-box`.
- Aligner des éléments avec flexbox (`justify-content`, `align-items`, `gap`).
- Adapter une mise en page aux petits écrans avec une media query.
- Éviter les largeurs fixes qui débordent sur mobile.
