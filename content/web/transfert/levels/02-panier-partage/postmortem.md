## Cause racine

Une ligne identique dans les deux langages, mais un comportement différent :

- En **JavaScript**, `panier = []` est évalué **à chaque appel**.
- En **Python**, `panier=[]` est évalué **une seule fois**, quand la fonction est définie. Tous
  les appels sans panier partagent la **même** liste, qui grossit à chaque client.

Le même piège se cachait dans `nouvelle_commande`, avec `lignes=[]`.

## Correctif

```python
def ajouter(article, panier=None):
    if panier is None:
        panier = []
    panier.append(article)
    return panier
```

## Le réflexe à garder

- Un portage « ligne à ligne » transporte la syntaxe, pas le comportement. Relis chaque ligne
  avec les pièges du nouveau langage en tête.
- En Python : jamais de liste, de dictionnaire ou d'objet modifiable comme valeur par défaut.
  Les outils d'analyse (pylint, ruff) le signalent automatiquement.
- Garder les tests d'origine et les porter **avec** le code : ils auraient détecté le bug
  avant la mise en ligne.
