---
id: llm-04
title: "Les agents : un LLM qui utilise des outils"
minutes: 15
summary: Donner des outils à un modèle, écrire la boucle qui les exécute, et l'encadrer pour qu'elle reste sûre et bornée.
check:
  - prompt: "Que signifie `stop_reason: \"tool_use\"` ?"
    choices:
      - Le modèle a fini sa réponse
      - "Le modèle demande l'exécution d'un outil : ton code doit l'exécuter et renvoyer le résultat"
    answer: 1
  - prompt: Qui exécute réellement l'outil « meteo » défini par ton application ?
    choices:
      - Le modèle, sur les serveurs du fournisseur
      - "Ton code : le modèle ne fait que demander l'appel, avec les paramètres"
    answer: 1
  - prompt: Pourquoi limiter le nombre de tours de la boucle ?
    choices:
      - "Un agent peut tourner en rond indéfiniment : chaque tour coûte un appel facturé"
      - Ce n'est pas utile
    answer: 0
---

## Un modèle qui agit

Un LLM seul ne connaît que ce qu'on lui envoie. Pour qu'il consulte une base de données,
appelle une API ou fasse un calcul fiable, on lui décrit des **outils**. Un **agent** est un
LLM qui décide lui-même quels outils utiliser, dans quel ordre, pour atteindre un but.

## Décrire un outil

```python
outils = [
    {
        "name": "stock_piece",
        "description": "Renvoie le nombre de pièces en stock pour une référence. "
                       "À utiliser avant de promettre une réparation.",
        "input_schema": {
            "type": "object",
            "properties": {"reference": {"type": "string", "description": "ex. CH-11V"}},
            "required": ["reference"],
        },
    }
]
```

La `description` est lue par le modèle : c'est elle qui lui fait choisir le bon outil au bon
moment. Elle mérite autant de soin qu'un prompt.

## La boucle

Le modèle ne **fait** rien lui-même : il **demande**. Quand il veut un outil, la réponse
s'arrête avec `stop_reason == "tool_use"` et contient un bloc :

```json
{ "type": "tool_use", "id": "toolu_01A", "name": "stock_piece", "input": { "reference": "CH-11V" } }
```

Ton code exécute l'outil, puis renvoie le résultat dans un message `user`, en citant l'`id` de
la demande :

```python
messages = [{"role": "user", "content": question}]

for tour in range(MAX_TOURS):
    reponse = client.messages.create(
        model="claude-opus-5-5", max_tokens=4096, tools=outils, messages=messages,
    )
    if reponse.stop_reason == "end_turn":
        break

    # 1. Garder la demande du modèle dans l'historique
    messages.append({"role": "assistant", "content": reponse.content})

    # 2. Exécuter chaque outil demandé, et renvoyer TOUS les résultats ensemble
    resultats = []
    for bloc in reponse.content:
        if bloc.type == "tool_use":
            resultats.append({
                "type": "tool_result",
                "tool_use_id": bloc.id,             # relie le résultat à la demande
                "content": executer(bloc.name, bloc.input),
            })
    messages.append({"role": "user", "content": resultats})
```

Les trois oublis classiques, que tu répareras dans un niveau :

1. ne pas ajouter la réponse `assistant` à l'historique : le modèle ne sait plus qu'il a
   demandé un outil ;
2. oublier `tool_use_id` : le résultat n'est relié à aucune demande, et l'API refuse la
   requête ;
3. aucune limite de tours : un agent qui tourne en rond coûte un appel facturé par tour.

## Encadrer un agent

| Garde-fou | Pourquoi |
|---|---|
| un **nombre maximal de tours** | éviter les boucles infinies et les factures surprises |
| un outil inconnu ou en erreur renvoie un `tool_result` avec `"is_error": True` | le modèle peut corriger sa demande au lieu de faire planter l'application |
| **valider** les paramètres reçus | le modèle peut se tromper de format, ou avoir lu une injection |
| une **confirmation humaine** pour les actions irréversibles | supprimer, payer, envoyer : jamais sans validation |
| des **journaux** de chaque appel d'outil | comprendre après coup ce que l'agent a fait |

> **À retenir** : un agent n'est pas toujours la bonne solution. Si les étapes sont connues
> d'avance, un simple enchaînement d'appels écrit dans le code est moins cher, plus rapide et
> plus prévisible. On réserve l'agent aux tâches dont le chemin ne peut pas être prévu.

Le SDK d'Anthropic propose aussi un *tool runner* qui écrit cette boucle pour toi, et des
services hébergés qui exécutent l'agent entier. Écrire la boucle une fois à la main reste le
meilleur moyen de comprendre ce qu'ils font.

## Ce que tu sais faire maintenant

- Décrire un outil : nom, description, schéma des paramètres.
- Écrire la boucle `tool_use` → exécution → `tool_result`, sans les trois oublis classiques.
- Encadrer un agent : limite de tours, erreurs d'outil, validation, confirmation humaine.
- Choisir entre un agent et un simple enchaînement d'appels.
