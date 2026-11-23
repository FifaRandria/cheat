## Cause racine

Trois bugs typiques de la première page interactive :

1. `querySelector("#ajouter")` cherchait un id qui n'existe pas (`btn-ajouter`) : il renvoyait
   `null`, et `null.addEventListener` plantait tout le script.
2. `addEventListener("onclick", ajouter())` : `"onclick"` n'est pas un nom d'événement, et
   `ajouter()` **appelait** la fonction tout de suite (d'où la quantité à 1 au chargement)
   au lieu de la **donner** à l'écouteur.
3. `vider` changeait la variable sans mettre l'écran à jour.

## Correctif

Le bon id, `"click"`, une fonction sans parenthèses, et une fonction `afficher()` appelée après
chaque changement : l'écran ne peut plus être en retard sur les données.

## Le réflexe à garder

- `Cannot read properties of null` après un `querySelector` : vérifie le sélecteur, et que le
  script s'exécute après la création des éléments.
- Une fonction passée à un écouteur s'écrit **sans** parenthèses.
- Une seule fonction qui met l'écran à jour, appelée après chaque modification.
