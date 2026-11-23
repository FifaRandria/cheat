---
id: llm-01
title: Appeler un LLM par API
minutes: 15
summary: L'anatomie d'une requête et d'une réponse, l'historique à renvoyer à chaque appel, les jetons, les coûts et les erreurs.
check:
  - prompt: Le modèle « oublie » ce que l'utilisateur a dit au message précédent. Cause la plus probable ?
    choices:
      - Le modèle a une mauvaise mémoire
      - "L'API est sans état : il faut renvoyer tout l'historique de la conversation à chaque appel"
      - La clé d'API a expiré
    answer: 1
  - prompt: "Que signifie `stop_reason: \"max_tokens\"` ?"
    choices:
      - La réponse est complète
      - "La réponse a été coupée : la limite max_tokens a été atteinte"
    answer: 1
  - prompt: Où placer la clé d'API ?
    choices:
      - Dans le code, pour que tout le monde l'ait
      - "Dans une variable d'environnement (ANTHROPIC_API_KEY), jamais dans Git"
    answer: 1
---

## Un LLM, vu depuis le code

Un **LLM** (*Large Language Model*, grand modèle de langage) comme Claude s'utilise depuis ton
code par une **API HTTP** : tu envoies une conversation, il renvoie la suite. Les fournisseurs
proposent des bibliothèques (SDK) qui simplifient l'appel. En Python, avec le SDK d'Anthropic :

```python
import anthropic

client = anthropic.Anthropic()   # lit la clé dans ANTHROPIC_API_KEY

reponse = client.messages.create(
    model="claude-opus-5-5",
    max_tokens=1024,
    system="Tu es l'assistant d'un atelier vélo. Réponds en deux phrases maximum.",
    messages=[
        {"role": "user", "content": "Ma chaîne saute quand je pédale fort. Pourquoi ?"},
    ],
)

for bloc in reponse.content:
    if bloc.type == "text":
        print(bloc.text)
```

## Les éléments d'une requête

| Champ | Rôle |
|---|---|
| `model` | le modèle utilisé (ici `claude-opus-5-5`) |
| `max_tokens` | la longueur **maximale** de la réponse, en jetons |
| `system` | les consignes générales : rôle, ton, règles. Séparé des messages |
| `messages` | la conversation : une liste de `{"role": "user" ou "assistant", "content": …}` |

La conversation commence toujours par un message `user`, puis alterne avec `assistant`.

> **Attention** : l'API est **sans état**. Elle ne se souvient de rien entre deux appels. Pour
> une conversation, ton code garde l'historique et le **renvoie en entier** à chaque appel, en
> ajoutant la nouvelle question à la fin.

```python
historique = [
    {"role": "user", "content": "Je m'appelle Ada."},
    {"role": "assistant", "content": "Bonjour Ada !"},
]
messages = historique + [{"role": "user", "content": "Comment je m'appelle ?"}]
```

## La réponse

```json
{
  "role": "assistant",
  "content": [
    { "type": "text", "text": "Ta chaîne est probablement usée ou détendue…" }
  ],
  "stop_reason": "end_turn",
  "usage": { "input_tokens": 52, "output_tokens": 61 }
}
```

- `content` est une **liste de blocs**. Selon les options, il peut contenir d'autres blocs que
  du texte (une réflexion du modèle, une demande d'outil…) : on filtre sur `type == "text"`
  plutôt que de prendre aveuglément le premier.
- `stop_reason` dit **pourquoi** la réponse s'arrête : `end_turn` (terminée), `max_tokens`
  (coupée, la réponse est incomplète), `tool_use` (le modèle veut utiliser un outil, leçon 4).
- `usage` compte les **jetons** consommés.

## Les jetons et le coût

Un **jeton** (*token*) est un morceau de mot : en français, un mot fait en moyenne un à deux
jetons. Les fournisseurs facturent au million de jetons, en entrée (ce que tu envoies) et en
sortie (ce qui est généré, plus cher).

Comme l'historique est renvoyé à chaque appel, **une longue conversation coûte de plus en plus
cher** : le 20ᵉ message renvoie les 19 précédents. D'où l'intérêt de limiter l'historique, et
des mécanismes de cache proposés par les fournisseurs.

## Les réglages de génération

Beaucoup d'API exposent une `temperature` (le degré de hasard dans le choix des mots). Sur les
modèles récents de Claude, ce paramètre n'est plus accepté : on règle plutôt l'**effort**,
c'est-à-dire la profondeur de réflexion (`output_config={"effort": "low"}` pour une tâche
simple et rapide, `"high"` pour un problème difficile). Retiens l'idée générale : chaque
fournisseur a ses réglages, et leur documentation fait foi.

## Les erreurs à prévoir

| Code | Signification | Réaction |
|---|---|---|
| 400 | requête invalide | corriger le code, ne pas réessayer |
| 401 | clé invalide | vérifier la configuration |
| 429 | trop de requêtes | attendre, puis réessayer |
| 500, 529 | panne ou surcharge passagère | réessayer avec une attente croissante |

Tu reconnais la logique de réessai du module n8n : on ne réessaie que les erreurs
**passagères**. Le SDK le fait d'ailleurs pour toi (deux réessais par défaut).

## Ce que tu sais faire maintenant

- Écrire une requête : modèle, `max_tokens`, consigne système, messages.
- Renvoyer l'historique pour tenir une conversation.
- Lire une réponse : blocs de contenu, `stop_reason`, jetons consommés.
- Anticiper les coûts et les erreurs d'un appel à un LLM.
