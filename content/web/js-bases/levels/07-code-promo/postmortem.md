## Cause racine

Trois cas n'étaient pas prévus, avec trois symptômes différents :

| Cas | Ce qui se passait | Symptôme |
|---|---|---|
| `"vip"` en minuscules | la clé `vip` n'existe pas, `taux` vaut `undefined` | `NaN` |
| code inconnu | même chose | `NaN` |
| code absent | `undefined.trim()` | `TypeError` |

En suivant la méthode, les logs donnaient tout : les commandes qui marchaient avaient un code
**exactement** en majuscules, sans espace.

## Correctif

```js
const cle = (code ?? "").trim().toUpperCase();
const taux = REMISES[cle] ?? 0;
```

- `code ?? ""` remplace un code absent par un texte vide ;
- `.trim().toUpperCase()` normalise la saisie ;
- `?? 0` donne une remise nulle à un code inconnu.

## Le réflexe à garder

- **Normalise** toujours ce que saisit un utilisateur avant de t'en servir : espaces, casse,
  valeur absente.
- Une recherche dans un objet qui peut échouer doit avoir une **valeur par défaut** (`?? 0`).
- Compare ce qui marche et ce qui échoue : la différence pointe presque toujours la cause.
