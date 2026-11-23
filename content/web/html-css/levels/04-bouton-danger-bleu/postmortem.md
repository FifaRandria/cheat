## Cause racine

La règle `.btn-danger` existait, mais elle **perdait** la cascade :

| Règle | Spécificité |
|---|---|
| `.btn-danger` | (0, 1, 0) |
| `#formulaire button` | (1, 0, 1) : gagne |

Un id l'emporte sur n'importe quel nombre de classes. Déplacer `.btn-danger` à la fin du
fichier n'aurait rien changé : l'ordre ne départage que des règles de **même** spécificité.

## Correctif

```css
#formulaire .btn-danger { background: crimson; color: white; }
```

Spécificité (1, 1, 0) : elle bat (1, 0, 1). Et elle ne touche que le bouton danger du
formulaire : les autres boutons gardent leurs couleurs.

## Le réflexe à garder

- « Ma règle ne s'applique pas » : ouvre les outils de développement, et cherche la règle
  barrée et celle qui gagne.
- Évite les **id** dans les sélecteurs CSS : leur poids rend toute surcharge difficile. Une
  classe `.formulaire` aurait évité le bug.
- `!important` règle le symptôme et crée le prochain conflit.
