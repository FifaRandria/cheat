## Cause racine

Trois malentendus sur le fonctionnement de l'API :

1. **L'API est sans état.** Seule la dernière question était envoyée : le modèle ne pouvait
   pas savoir que le client s'appelait Ada.
2. **La consigne n'est pas un message.** Elle se place dans le champ `system`. Un message de
   rôle `system` en tête de la liste était refusé par l'API.
3. **La réponse est une liste de blocs.** Le premier bloc n'est pas forcément du texte : selon
   les options, il peut s'agir d'un bloc de réflexion, ou d'une demande d'outil.

Et `max_tokens`, obligatoire, manquait.

## Correctif

```python
"system": CONSIGNE,
"messages": list(historique) + [{"role": "user", "content": question}],
…
"".join(b["text"] for b in reponse["content"] if b["type"] == "text")
```

## Le réflexe à garder

- Garder l'historique côté application, et le renvoyer à chaque appel.
- Lire la documentation de l'API pour la forme exacte des requêtes et des réponses.
- Filtrer les blocs par type plutôt que de supposer leur position.
