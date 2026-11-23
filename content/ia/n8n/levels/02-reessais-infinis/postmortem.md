## Cause racine

Trois défauts cumulés :

1. **Toutes les erreurs 4xx étaient réessayées**, y compris `400 Bad Request`. Une requête
   invalide reste invalide : la renvoyer 42 000 fois ne change rien, sauf la facture.
2. **Aucune limite** : `MAX_TENTATIVES` était déclaré… et jamais utilisé.
3. **Aucune attente** entre deux tentatives (délai de 0) : le service était bombardé.

## Correctif

```python
passagere = statut == 429 or 500 <= statut <= 599
if not passagere or tentative >= MAX_TENTATIVES:
    return ("abandonner", 0)
return ("reessayer", 2 ** (tentative - 1))
```

## Le réflexe à garder

- On ne réessaie que les erreurs **passagères** : 429, 5xx, problèmes réseau.
- Toujours une **limite** de tentatives, et une **attente exponentielle** entre elles.
- Après l'abandon, on **signale** (workflow d'erreur, alerte) au lieu d'échouer en silence.
- Une constante déclarée mais jamais utilisée est un signal d'alarme.
