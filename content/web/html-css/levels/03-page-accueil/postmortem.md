## Ce qu'il fallait écrire

Un squelette sémantique complet :

```html
<header>
  <nav>
    <ul>
      <li><a href="/">Accueil</a></li>
      …
    </ul>
  </nav>
</header>
<main>
  <h1>Atelier Rustine</h1>
  <section>
    <h2>Apprendre en réparant</h2>
    <p>…</p>
  </section>
  …
</main>
<footer><p>© 2026 Atelier Rustine</p></footer>
```

## Pourquoi une liste pour la navigation ?

Un lecteur d'écran annonce « liste, 3 éléments » : la personne sait immédiatement combien de
destinations l'attendent. Avec des liens à la suite, elle doit tous les écouter.

## Le réflexe à garder

- Commencer chaque page par le plan : `header`, `main`, `footer`, puis les titres.
- Une seule balise `main` et un seul `h1` par page.
- Ne jamais oublier la balise `viewport` : sans elle, aucun CSS responsive ne fonctionne.
