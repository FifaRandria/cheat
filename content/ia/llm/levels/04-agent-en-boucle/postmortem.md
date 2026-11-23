## Cause racine

La boucle d'agent cumulait les trois oublis classiques, plus deux :

1. La réponse `assistant` n'était jamais ajoutée à l'historique : à chaque tour, le modèle
   recevait un résultat d'outil sans voir sa propre demande, et redemandait le même outil.
2. Les `tool_result` n'avaient pas de `tool_use_id` : l'API ne pouvait pas les relier aux
   demandes.
3. `while True` sans limite : 412 tours facturés pour une seule question.
4. Un outil inconnu (`planning_atelier`, renommé la veille) levait une `KeyError` et faisait
   planter la conversation.
5. Chaque résultat partait dans son propre message, au lieu d'un seul message par tour.

## Correctif

```python
for _ in range(MAX_TOURS):
    reponse = llm.creer(messages=messages, outils=list(outils))
    if reponse["stop_reason"] == "end_turn":
        return texte(reponse)
    messages.append({"role": "assistant", "content": reponse["content"]})
    resultats = [executer_outil(outils, b) for b in reponse["content"] if b["type"] == "tool_use"]
    messages.append({"role": "user", "content": resultats})
return "Désolé, je n'ai pas pu terminer."
```

## Le réflexe à garder

- Un agent a **toujours** une limite de tours, et idéalement un budget.
- Une erreur d'outil est une information pour le modèle (`is_error`), pas une raison de
  planter.
- Journaliser chaque tour : c'est grâce aux logs que la boucle infinie a été comprise.
